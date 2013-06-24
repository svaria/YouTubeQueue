$(document).ready(function() {
	//when ready, populate popup
	var queue = chrome.extension.getBackgroundPage().upNext.queue;
	var currentVid = chrome.extension.getBackgroundPage().upNext.currentVid;
	if(queue.length!==0){
		//at least 1 element in the queue, display it

		//create list
		$("body").append('<ul class="queue">');
		//add elements from queue
		for(var i =0; i<queue.length;i++){
			//figure out what to actually add, for now just title
			$("ul").append('<li class="enqueued">'+queue[i].vidTitle+"</li>");
		}
		//close list
		$("body").append("</ul>");

	} else {
		//empty queue, so add p element to tell user
		$("body").append('<p class="empty">There are no elements in the queue</p>');
	}
});
