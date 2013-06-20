function checkforYoutubeURL(tabID,changeInfo,tab){
	console.log(tab.url);
	if(tab.url.indexOf("youtube.com")!==-1){
			chrome.pageAction.show(tabID);
	}
};

chrome.tabs.onUpdated.addListener(checkforYoutubeURL);