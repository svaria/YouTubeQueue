function YUNVid(vidTitle,url){
	this.vidTitle=vidTitle;
	var initURL = function(){
		if(url.indexOf("youtube.com")>-1){
			return url;
		} else {
			return "http://www.youtube.com"+url;
		}
	}
	this.url  = initURL();
}

var upNext={}
upNext.tabID=null;
upNext.queue=[];
upNext.currentVid=-1;
upNext.inList= true;



/*function checkforYoutubeURL(tabID,changeInfo,tab){
	//show if on youtube
	if(tab.url.indexOf("youtube.com")!==-1){
		chrome.pageAction.show(tabID);

	}
	if(upNext.queue.length!==0){
		chrome.pageAction.show(tabID);
	}else {
		if(tab.url.indexOf("youtube.com")===-1)
			chrome.pageAction.hide(tabID);
	}

};*/

/*function updatePageActionInTab(activeInfo){
	//show on activation of tab
	chrome.tabs.get(activeInfo.tabId,function(tab){
		if(tab.url.indexOf("youtube.com")!==-1){
			chrome.pageAction.show(tab.id);
		} else {
			if(upNext.queue.length===0)
				chrome.pageAction.hide(tab.id);
		}
		if(upNext.queue.length!==0){
			chrome.pageAction.show(tab.id);
		}
	});
}

function actionClicked(tab){
	chrome.windows.getCurrent({populate:true},function(win){
		var t = win.tabs;
		var b = false;
		for(var i = 0; i<t.length;i++){
			b= b || (t[i].url.indexOf("youtube.com")!==-1);
		}
		alert(b);
		if(b){
			chrome.browserAction.setPopup({'popup':'popup.html'});
		} else {
			chrome.browserAction.setPopup({'popup':'popup-no-yt.html'});
		}
	});
}*/

//maintains whether the current playing video is a video in the queue or not
function updateListener(tabId, changeInfo,tab){
	if(tabId===upNext.tabID && changeInfo.url!==undefined){
		upNext.inList=false;
		for(var i = 0;i<upNext.queue.length;i++){
			if(changeInfo.url===upNext.queue[i].url){
				upNext.inList=true;
				break;
			}
		}
		console.log(changeInfo.url);
		console.log(upNext.inList);
	}
}

function youtubeTabExited(tabId, removeInfo){
	if(upNext.queue.length!==0 && upNext.tabID===tabId){
		//main youtube tab was closed, set to null
		//no more current vid
		upNext.tabID=null;
		upNext.currentVid=-1;
	}
}

//handles add request
function addRequest(request,sender){
	//add it in this case
	if(upNext.queue.length===0 ||upNext.tabID===null){
		//either no vids or old vid tab closed
		upNext.tabID=sender.tab.id;
	} 
	var toEnq = new YUNVid(request.vidTitle,request.url);
	//need to decide whether to allow multiple queues or not
	//for now, no multiple tabs
	upNext.queue.push(toEnq);
}

//handles remove request
//request is always valid remove
function removeRequest(request){
	//remove it in this case
	//tab id does not matter in this case as it is a temp variable
	var toRemove = new YUNVid(request.vidTitle,request.url);
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
		if(upNext.inList){
			//only increment the counter if the video that ended was in the list
			upNext.currentVid++;
		}
		chrome.tabs.update(upNext.tabID,{url:upNext.queue[upNext.currentVid].url});
	}
}

function redirectRequest(request){
	if(upNext.tabID!==null){
		//tab still is open
		chrome.tabs.update(upNext.tabID,{url:request.url,active:false});
	} else {
		//tab was closed
		chrome.tabs.create({url:request.url,active:false}, function(tab){
			//update tabID with above callback
			upNext.tabID=tab.id;
		});
	}
	upNext.currentVid=request.vidIndex;
}

function queueRequest(sendResponse){
	sendResponse({queue:upNext.queue});
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
		case 'redirect':
			redirectRequest(request);
		case 'queue':
			queueRequest(sendResponse);
			break;
		default:
			alert("error1");
			break;
	}
}

//listeners
/*chrome.tabs.onUpdated.addListener(checkforYoutubeURL);
//does not work
		chrome.tabs.onActivated.addListener(updatePageActionInTab);*/

chrome.tabs.onUpdated.addListener(updateListener);
chrome.runtime.onMessage.addListener(messageListener);
//chrome.browserAction.onClicked.addListener(actionClicked);
chrome.tabs.onRemoved.addListener(youtubeTabExited);

