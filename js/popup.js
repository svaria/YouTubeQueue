
var upNext = chrome.extension.getBackgroundPage().upNext;

var queue =upNext.queue;
var currentVid = upNext.currentVid;
var tabID= upNext.tabID;
var inList = upNext.inList;

$(document).ready(function() {
	//when ready, populate popup
	if(queue.length!==0){
		//at least 1 element in the queue, display it

		//create list
		$(".add-here").append('<div><ul class="queue"></ul><div>');
		//add elements from queue
		for(var i =0; i<queue.length;i++){
			//order: meta, title, delete, bar, (play)
			var titleSpan = '<span class="vid-title title-container">'+queue[i].vidTitle+'</span>';
			var currentTitleSpan = '<span class="title-container">'+queue[i].vidTitle+'</span>';
			var deleteIconSpan = '<span class="delete"><i class="icon-remove"></i></span>';
			var barIconSpan= '<span class="bar"></span>';
			//initialize with loading icon
			var statusIconSpan = '<span class="status" id="status-icon"><i class="icon-spinner icon-spin" id="insert-icon"></i></span>';

			var iconSpan = '<span class="icon-container">'+deleteIconSpan+barIconSpan+'</span>';
			var currentIconSpan = '<span class="icon-container">'+deleteIconSpan+barIconSpan+statusIconSpan+'</span>';

			//var metaTabId = '<meta name="tabID" content="'+queue[i].tabID+'">';
			var metaIndex = '<meta name="index" content="'+i+'">';
			var meta  = metaIndex;

			if(i===currentVid &&inList){
				$("ul").append('<li class="enqueued current" ><a href="'+queue[i].url+'">'+meta+currentTitleSpan+currentIconSpan+'</a></li>');
			}else{
				$("ul").append('<li class="enqueued"><a href="'+queue[i].url+'">'+meta+titleSpan+iconSpan+'</a></li>');
			}
		}
		
		//make sure icon is always correct
		//iff the tabID is not null
		if(tabID!==null){
			setCorrectIcon();
		}


		//in addition to css changes, also add capability to remove link
		$(".enqueued").hover(function(){
			var $i= $(this).find(".delete");
			var $bar = $(this).find(".bar");
			$bar.toggle();
			$i.toggle();
		});

		//when specific video is removed from playlist
		$(".delete").click(function(){
			$l = $(this).parents(".enqueued");
			var url = $(this).parents("a").attr('href');
			var vidTitle = $(this).siblings(".vid-title").html();
			//remove video from queue
			var message={};
			message.requestType="remove";
			message.vidTitle = vidTitle;
			message.url = url;
			//message.tabID= tabID;
			chrome.runtime.sendMessage(message);
			
			if($l.hasClass("current")){
				//handle when current video is playing
				//go to next vid
				var message2={};
				message2.requestType="next";
				chrome.runtime.sendMessage(message2);

			}

			//reuse old message but change url to just last part
			message.url = message.url.substring(message.url.lastIndexOf("/"));
			if(tabID!==null){
				//only send if tab still exists
				chrome.tabs.sendMessage(tabID,message);
			}

			//refresh page
			location.reload();
		});

		//current video status icon clicked-> toggle status of video
		$("#status-icon").click(function(){
			//tabID is non null since status icon was clicked
			//pause/play video and change icon
			var message={};
			message.requestType="toggle";
			chrome.tabs.sendMessage(tabID,message);
		});

		//when vid title is clicked redirect to page
		$(".vid-title").click(function(){
			var message={};
			message.requestType="redirect";
			//message.tabID= parseInt($(this).siblings("meta[name=tabID]").attr("content"));
			message.vidIndex= parseInt($(this).siblings("meta[name=index]").attr("content"));
			message.url = $(this).parent('a').attr('href');
			chrome.runtime.sendMessage(message, function(response){location.reload()});
		});

		$("#clear-button").click(function(){
			chrome.extension.getBackgroundPage().upNext.queue=[];
			chrome.extension.getBackgroundPage().upNext.currentVid=-1;
			
			if(tabID!==null){
				//only send if tab still exists
				var message = {};
				message.requestType="remove";
				for(var i = 0;i<queue.length;i++){
					//loop through queue and restore buttons on page
					message.url = queue[i].url.substring(queue[i].url.lastIndexOf("/"));
					chrome.tabs.sendMessage(tabID,message);
				}
			}

			location.reload();
		});

	} else {
		$("#clear-button").hide();
		$(".add-here").append('<p class="empty">There are no elements in the queue. Go to <a id="youtube-url">YouTube</a> and add some!</p>');

		$("#youtube-url").click(function(){
			chrome.tabs.create({active:true,url:"http://www.youtube.com"});
		});
	}
});

//get video status if it exists and set correct icon
function setCorrectIcon(){
	var message ={};
	message.requestType="vidStatus";
	var iconInterval = setInterval(function(){
		chrome.tabs.sendMessage(tabID,message, function(response){
			if(response.vidStatus!==null ||response.vidStatus!==undefined){
				//player is present
				switch(response.vidStatus){
					case 0:
						if(currentVid===queue.length){
							//not queue.length-1 because counter is incremented to account for
							//potential addition of new videos 
							//its the last vid in the queue and it has ended
							$("#insert-icon").removeClass();
							$("#insert-icon").addClass("icon-stop");
							clearInterval(iconInterval);
						}
						break;
					case 1:
						$("#insert-icon").removeClass();
						$("#insert-icon").addClass("icon-play");
						break;
					case 2:
						$("#insert-icon").removeClass();
						$("#insert-icon").addClass("icon-pause");
						break;
					case 3:
						$("#insert-icon").removeClass();
						$("#insert-icon").addClass("icon-spinner icon-spin");
						break;
					default:
						break;
				}
			} 
		});
	},1000);

}
