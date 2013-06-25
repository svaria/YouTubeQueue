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
				$("ul").append('<li class="enqueued current"><a href="'+queue[i].url+'">'+queue[i].vidTitle+'<i class="icon-play exclude"></i></a></li>');
			}else{
				$("ul").append('<li class="enqueued"><a href="'+queue[i].url+'">'+queue[i].vidTitle+"</a></li>");
			}
		}

		//in addition to css changes also add capability to remove link
		$(".enqueued").hover({
			//if it has class current, add in a different place
		});

	} else {
		//empty queue, so add p element to tell user
		$(".add-here").append('<p class="empty">There are no elements in the queue</p>');
	}
});
