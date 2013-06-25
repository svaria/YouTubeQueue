$(document).ready(function() {
	//when ready, populate popup
	var queue = chrome.extension.getBackgroundPage().upNext.queue;
	var currentVid = chrome.extension.getBackgroundPage().upNext.currentVid;
	if(queue.length!==0){
		//at least 1 element in the queue, display it
		//create list
		$(".add-here").append('<ul class="queue"></ul>');
		//add elements from queue
		for(var i =0; i<queue.length;i++){
			//figure out what to actually add, for now just title
			if(i===currentVid-1){
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
			if($l.hasClass("current")){
				//handle when current video is playing
			} else {
				//handle when not current vid playing
			}
		});

		//when vid title is clicked redirect to page
		$(".vid-title").click(function(){

		})

	} else {
		//empty queue, so add p element to tell user
		$(".add-here").append('<p class="empty">There are no elements in the queue</p>');
	}
});
