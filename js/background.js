function YUNVid(vidTitle,url,vidID){
	this.vidTitle=vidTitle;
	this.url=url;
	this.vidID=vidID;
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

chrome.tabs.onUpdated.addListener(checkforYoutubeURL);

var queue=[];
