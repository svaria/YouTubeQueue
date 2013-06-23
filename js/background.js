function YUNVid(vidTitle,url,tabID){
	this.vidTitle=vidTitle;
	this.url=url;
	this.tabID=tabID;
}

function checkforYoutubeURL(tabID,changeInfo,tab){
	console.log(tab.url);
	//show if on youtube
	if(tab.url.indexOf("youtube.com")!==-1){
			chrome.pageAction.show(tabID);
	}

	//or if the queue has videos in it
	if(queue.length!==0){
		chrome.pageAction.show(tabID)
	}

};

function messageListener(request, sender, sendResponse){
	//if(request.inf){
		//if popup is requesting queue data
	//	sendResponse(queue);
	//}else {
		//if yUN is sending data
		var toEnq = new YUNVid(request.vidTitle,request.url,sender.tab.id);
		//need to decide whether to allow multiple queues or not
		//for now, no multiple tabs
		queue.push(toEnq);
	//}
}


chrome.tabs.onUpdated.addListener(checkforYoutubeURL);
chrome.runtime.onMessage.addListener(messageListener);


var queue=[];
