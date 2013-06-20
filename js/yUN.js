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

	function clickHandler(){
		//add logic for when button clicked
		//if it has not been added to queue then add
		if($(this).hasClass("not-added")){
			//change button text to added , potentially add remove function
			//call function to add to playlist to queue
			
			$(this).html("Added");
			$(this).parent(".yUN-span").css({
				"left":addedLeftPad
			});
			$(this).css({
				"border-color":"#b8b8b8"
			});
			$(this).removeClass("hover-highlight");
			$(this).removeClass("not-added");
		} else {
			//it is already in queue, remove it
			//call function to remove from queue
			
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
var fullLeftPad = "304px";//304px
var addedLeftPad= "347px";
var removeLeftPad= "338px";
var bottomPad= "4px";