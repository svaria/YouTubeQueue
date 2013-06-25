$(document).ready(function(){
	//add necessary css classes to DOM NO WHITESPACE ALLOWED
	$("head").append('<style id="yUN-btn-css" type="text/css">.normal-btn{font-size:10px;color:#888;padding:0 3px;height:18px;border-color:#d8d8d8;-webkit-border-radius: 2px;border-radius:2px;border-width:1px;border-style:solid;font-weight:bold;white-space:nowrap;word-wrap: normal;vertical-align: middle;cursor: pointer;font-family:arial,sans-serif;margin:0;background-image:linear-gradient(to bottom,#fff 0,#fbfbfb 100%);}</style>');
	$("head").append('<style id="yUN-highlight" type="text/css">.hover-highlight{-webkit-box-shadow:#999 0px 0px 3px;background:#F3F3F3 -webkit-gradient(linear, 0% 0%, 0% 100%, from(white), to(#EBEBEB));background-image:-webkit-gradient(linear, 0% 0%, 0% 100%, from(white), to(#EBEBEB));border-color:#999;outline:0px;}</style>');
	$("head").append('<style id="yUN-highlight-remove" type="text/css">.hover-highlight-remove{background:#ad0000;color:white;border-color:black;}</style>');

	//addbutton to only those which are true videos
	$(".related-video").parent(".video-list-item.related-list-item")
						.append('<span class="yUN-span"><button class="yUN-btn not-added normal-btn">Add To Up Next</button></span>');

	//add initial css to span
	$(".yUN-span").css({
		"position":"absolute",
		"left":fullLeftPad,
		"bottom":bottomPad
	});

	//add state listener
	stateListener();


	//logic for when Load more suggestions button is pressed
	$("#watch-more-related-button").click(function(){
		//simulate wait time for load
		setTimeout(function(){
			$(".related-list-item:not(:has(.yUN-span))").append('<span class="yUN-span yUN-more-suggestions"><button class="yUN-btn not-added normal-btn yUN-more-suggestions">Add To Up Next</button></span>');

			$(".yUN-span.yUN-more-suggestions").css({
				"position":"absolute",
				"left":fullLeftPad,
				"bottom":bottomPad
			});
			//reactivate handlers
			$(".yUN-btn.yUN-more-suggestions").click(clickHandler);
			$(".yUN-btn.yUN-more-suggestions").hover(hoverIn,hoverOut);
		},500);
	});


	function stateListener(){
		//get player object
		var vidType = flashOrHtml();
		var player = getYoutubePlayer(vidType);
		console.log(player);
		if(vidType==="flash"){
			if(player){
				var inter1 = setInterval(function(){
					try{
						var state = player.getPlayerState();
						if(state===0){
							//movie has ended
							console.log("movie ended");
							clearInterval(inter1);
							//logic for next page
							goToNext();
							
						}
					} catch (error) {
						console.log(error);
					}
				},1500);
			}
		} else {
			//html5 player
			var inter2 = setInterval(function(){
				if(player.ended===true){
					//movie has ended
					console.log("movie ended html");
					clearInterval(inter2);
					//logic for next page
					goToNext();
				}
			},1500);
		}
	}

	function clickHandler(){
		//add logic for when button clicked
		//if it has not been added to queue then add
		if($(this).hasClass("not-added")){
			//change button text to added , potentially add remove function
			//call function to add to playlist to queue
			getInfo(this,"add");

			//UI changes
			$(this).html("Added");
			$(this).parent(".yUN-span").css({
				"left":addedLeftPad
			});
			$(this).removeClass("hover-highlight");
			$(this).removeClass("not-added");
		} else {
			//it is already in queue, remove it
			//call function to remove from queue
			getInfo(this,"remove");

			//UI Changes
			$(this).html("Add To Up Next");
			$(this).parent(".yUN-span").css({"left":fullLeftPad});
			$(this).css({"border-color":"#d8d8d8"});
			$(this).removeClass("hover-highlight-remove");
			$(this).addClass("not-added");

		}
	}

	function hoverIn(){
		if($(this).hasClass("not-added")){
			//if its not been added then use default hover class
			$(this).addClass("hover-highlight");
		} else {
			//if its been added use red class for removal
			$(this).addClass("hover-highlight-remove");
			$(this).html("Remove");
			$(this).parent(".yUN-span").css({"left":removeLeftPad});
		}
	}

	function hoverOut(){
		if($(this).hasClass("not-added")){
			$(this).removeClass("hover-highlight");
		} else {
			$(this).removeClass("hover-highlight-remove");
			$(this).html("Added");
			$(this).parent(".yUN-span").css({"left":addedLeftPad});
		}
	}

	//set click logic
	$(".yUN-btn").click(clickHandler);
	//set hover logic
	$(".yUN-btn").hover(hoverIn, hoverOut);
});

//function to redirect to next url
function goToNext(){
	var message = {};
	message.requestType= "next";
	chrome.runtime.sendMessage(message,function(){});
}

//function to get url, id and title from video when clicked and add it to queue
function getInfo(pressed,requestType){
	var $anc =$(pressed).parent(".yUN-span").siblings("a");
	var url = $anc.attr("href");
	var vidTitle = $anc.children(".title").html();
	//alert(url+"\n"+vidTitle);
	var message = {};
	message.vidTitle=vidTitle;
	message.url=url;
	message.requestType= requestType;
	chrome.runtime.sendMessage(message,function(){});
}

//function to get the type of the video
function flashOrHtml(){
	if($("#movie_player").hasClass("html5-video-player")
		|| $("#captions").get().length!==0 
		|| $("#www-player-css").get().length!==0
		){
		return 'html';
	} else 
		return "flash"
}

//function to get the video player object
//vid is either flash or html
function getYoutubePlayer(vidType){
	if(vidType==="html"){
		//html5 movie player
		var p = $(".html5-main-video").get();
		if(p.length!==0){
			return p[0];
		}else {
			return false;
		}
	}else{
		//flash way to get player
		var p = $("#movie_player").get();
		if(p.length!==0){
			return p[0];
		} else {
			return false;
		}
	}
}

var fullLeftPad = "304px";//304px
var addedLeftPad= "347px";
var removeLeftPad= "338px";
var bottomPad= "4px";