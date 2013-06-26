isOpen();

var queue = chrome.extension.getBackgroundPage().upNext.queue;
var currentVid = chrome.extension.getBackgroundPage().upNext.currentVid;
$(document).ready(function() {
	//when ready, populate popup
	if(queue.length!==0){
		//at least 1 element in the queue, display it
		//create list
		$(".add-here").append('<ul class="queue"></ul>');
		//add elements from queue
		for(var i =0; i<queue.length;i++){
			//figure out what to actually add, for now just title
			if(i===currentVid){
				$("ul").append('<li class="enqueued current"><a href="'+queue[i].url+'">'+queue[i].vidTitle+'<span class="delete"><i class="icon-remove"></i></span><span class="exclude"><i class="icon-play"></i></span></a></li>');
			}else{
				$("ul").append('<li class="enqueued"><a href="'+queue[i].url+'"><span class="vid-title">'+queue[i].vidTitle+'</span><span class="delete"><i class="icon-remove"></i></span></a></li>');
			}
		}

		//in addition to css changes, also add capability to remove link
		$(".enqueued").hover(function(){
			var $i= $(this).find(".delete");
			$i.toggle();
		});

		//when specific video is removed from playlist
		$(".delete").click(function(){
			$l = $(this).parents(".enqueued");
			var url = $(this).parents("a").attr('href');
			//alert(url);
			var vidTitle = $(this).siblings(".vid-title").html();
			//alert(vidTitle);
			//remove video from queue
			var message={};
			message.requestType="remove";
			message.vidTitle = vidTitle;
			message.url = url;
			chrome.runtime.sendMessage(message,function(){});
			
			if($l.hasClass("current")){
				//handle when current video is playing
				//go to next vid
				var message2={};
				message2.requestType="next";
				chrome.runtime.sendMessage(message2,function(){});

			}
			//refresh page
			location.reload();

		});

		//when vid title is clicked redirect to page
		$(".vid-title").click(function(){

		});

	} else {
		$(".add-here").append('<p class="empty">There are no elements in the queue. Add some!</p>');
	}
});

function isOpen(){
	chrome.tabs.query({},function(tabs){
		var b = false;
		for(var i = 0; i<tabs.length;i++){
			if(tabs[i].url.indexOf("youtube.com")!==-1){
				b= true;
				break;
			}
		}
		if(!b){
			chrome.tabs.create({active:false,url:"http://www.youtube.com"});
		}	
	});
}
