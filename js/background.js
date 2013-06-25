function YUNVid(vidTitle,url,tabID){
	this.vidTitle=vidTitle;
	var initURL = function(){
		if(url.indexOf("youtube.com")>-1){
			return url;
		} else {
			return "http://www.youtube.com"+url;
		}
	}
	this.url  = initURL();
	this.tabID=tabID;
}

var upNext={}
upNext.queue=[];
upNext.currentVid=-1;



function checkforYoutubeURL(tabID,changeInfo,tab){
	//show if on youtube
	if(tab.url.indexOf("youtube.com")!==-1){
		chrome.pageAction.show(tabID);
	}
	if(upNext.queue.length!==0){
		chrome.pageAction.show(tabID);
	}else {
		if(tab.url.indexOf("youtube.com")==-1)
			chrome.pageAction.hide(tabID);
	}

};

function updatePageActionInTab(activeInfo){
	//or if the queue has videos in it
	alert(upNext.queue.length);
		//force firing update event to update page
		//does not fire update event
		chrome.tabs.update(activeInfo.tabId,{});
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
//request is always valid remove
function removeRequest(request){
	//remove it in this case
	//tab id does not matter in this case as it is a temp variable
	var toRemove = new YUNVid(request.vidTitle,request.url,null);
	for(var i = 0; i<upNext.queue.length;i++){
		if(upNext.queue[i].url===toRemove.url){
			//found video to remove
			upNext.queue.splice(i,1);
			//if vid to be deleted is CURRENT vid or lower decrement counter to adjust for shifting in array
			if(i<=upNext.currentVid && i>=0){
				upNext.currentVid--;
			}
			break;
		}
	}
}

//handles redirect to next vid
function nextRequest(request){
	//non empty queue and also not last vid in queue
	if(upNext.queue.length>0 && upNext.currentVid!==upNext.queue.length-1){
		upNext.currentVid++;
		chrome.tabs.update(upNext.queue[upNext.currentVid].tabID,{url:upNext.queue[upNext.currentVid].url});
	}
}

//appropriately handles each request
function messageListener(request, sender, sendResponse){
	switch(request.requestType){
		case 'add':
			addRequest(request,sender);
			break;
		case 'remove':
			removeRequest(request);
			break;
		case 'next':
			nextRequest(request);
			break;
		default:
			alert("error");
			break;
	}
}

//listeners
chrome.tabs.onUpdated.addListener(checkforYoutubeURL);
//does not work
//chrome.tabs.onActivated.addListener(updatePageActionInTab);
chrome.runtime.onMessage.addListener(messageListener);



