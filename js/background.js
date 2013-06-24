function YUNVid(vidTitle,url,tabID){
	this.vidTitle=vidTitle;
	this.url="http://www.youtube.com"+url;
	this.tabID=tabID;
}

var upNext={}
upNext.queue=[];
upNext.currentVid=0;



function checkforYoutubeURL(tabID,changeInfo,tab){
	//show if on youtube
	if(tab.url.indexOf("youtube.com")!==-1){
		chrome.pageAction.show(tabID);
	}
	if(upNext.queue.length!==0){
		chrome.pageAction.show(tabID);
	}

};

function updatePageActionInTab(activeInfo){
		//or if the queue has videos in it
		alert(upNext.queue.length);
	if(upNext.queue.length!==0){
		chrome.pageAction.show(activeInfo.tabId);
	}

}

//handles add request
function addRequest(request,sender){
		//add it in this case
		var toEnq = new YUNVid(request.vidTitle,request.url,sender.tab.id);
		//need to decide whether to allow multiple queues or not
		//for now, no multiple tabs
		upNext.queue.push(toEnq);
}

//handles remove request
function removeRequest(request,sender){
	//remove it in this case
		var toRemove = new YUNVid(request.vidTitle,request.url,sender.tab.id);
		for(var i = 0; i<upNext.queue.length;i++){
			if(upNext.queue[i].url===toRemove.url){
				upNext.queue.splice(i,1);
				break;
			}
		}
}

//handles redirect to next vid
function nextRequest(request,sender){
	//non empty queue and also not last vid in queue
	if(upNext.queue.length>0 && upNext.currentVid!==upNext.queue.length){
		chrome.tabs.update(upNext.queue[upNext.currentVid].tabID,{url:upNext.queue[upNext.currentVid].url});
		upNext.currentVid++;
	}
}

//appropriately handles each request
function messageListener(request, sender, sendResponse){
	switch(request.requestType){
		case 'add':
			addRequest(request,sender);
			break;
		case 'remove':
			removeRequest(request,sender);
			break;
		case 'next':
			nextRequest(request,sender);
			break;
		default:
			alert("error");
			break;
	}
}

//listeners
chrome.tabs.onUpdated.addListener(checkforYoutubeURL);
chrome.runtime.onMessage.addListener(messageListener);



