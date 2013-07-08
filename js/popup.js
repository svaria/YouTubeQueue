
var queue = chrome.extension.getBackgroundPage().upNext.queue;
var currentVid = chrome.extension.getBackgroundPage().upNext.currentVid;
var tabID= chrome.extension.getBackgroundPage().upNext.tabID;
//isYoutubeOpen();
$(document).ready(function() {
	//when ready, populate popup
	if(queue.length!==0){
		//at least 1 element in the queue, display it

		//create list
		$(".add-here").append('<ul class="queue"></ul>');
		//add elements from queue
		for(var i =0; i<queue.length;i++){
			//order: meta, title, delete, (play)
			var titleSpan = '<span class="vid-title">'+queue[i].vidTitle+'</span>';
			var currentTitleSpan = '<span>'+queue[i].vidTitle+'</span>';
			var deleteIconSpan = '</span><span class="delete"><i class="icon-remove"></i></span>';
			//initialize with loading icon
			var statusIconSpan = '<span class="exclude" id="status-icon"><i class="icon-spinner icon-spin" id="insert-icon"></i></span>';

			//var metaTabId = '<meta name="tabID" content="'+queue[i].tabID+'">';
			var metaIndex = '<meta name="index" content="'+i+'">';
			var meta  = metaIndex;

			if(i===currentVid){
				//$("ul").append('<li class="enqueued current" ><a href="'+queue[i].url+'">'+queue[i].vidTitle+'<span class="delete"><i class="icon-remove"></i></span><span class="exclude"><i class="icon-play"></i></span></a></li>');
				$("ul").append('<li class="enqueued current" ><a href="'+queue[i].url+'">'+meta+currentTitleSpan+deleteIconSpan+statusIconSpan+'</a></li>');
			}else{
				//$("ul").append('<li class="enqueued"><a href="'+queue[i].url+'">'+meta+'<span class="vid-title">'+queue[i].vidTitle+'</span><span class="delete"><i class="icon-remove"></i></span></a></li>');
				$("ul").append('<li class="enqueued"><a href="'+queue[i].url+'">'+meta+titleSpan+deleteIconSpan+'</a></li>');
			}
		}
		
		//make sure icon is always correct
		setCorrectIcon();


		//in addition to css changes, also add capability to remove link
		$(".enqueued").hover(function(){
			var $i= $(this).find(".delete");
			$i.toggle();
		});

		//when specific video is removed from playlist
		$(".delete").click(function(){
			$l = $(this).parents(".enqueued");
			var url = $(this).parents("a").attr('href');
			var vidTitle = $(this).siblings(".vid-title").html();
			//var tabID = $(this).siblings("meta[name=tabID]").attr("content");
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

			//TODO - fix removals on page


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
			//TODO - fix removals on page
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
			if(response.vidStatus!==null){
				//player is present
				switch(response.vidStatus){
					case 0:
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
				}
			}
		});
	},500);

}

//TODO make sure its ok to remove below
//opens youtube if queue length is 0 and youtube not open
function isYoutubeOpen(){
	chrome.tabs.query({},function(tabs){
		var b = false;
		for(var i = 0; i<tabs.length;i++){
			if(tabs[i].url.indexOf("youtube.com")!==-1){
				b= true;
				break;
			}
		}
		if(!b && queue.length===0){
			chrome.tabs.create({active:true,url:"http://www.youtube.com"});
		}	
	});
}
