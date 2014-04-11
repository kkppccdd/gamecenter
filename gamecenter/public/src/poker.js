/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * Object card, used to represent card
 */
var Card = function(id, frontImage, backImage) {
	var card = cc.Node.create();

	/**
	 * initialize
	 */

	card.id = id;
	// sprite which used to display front
	card.front = cc.Sprite.create(frontImage);
	
	// console.debug("front height:" + card.front.getContentSize().height);

	card.front.setScale(192 / card.front.getContentSize().height)

	// sprite which used to display back
	card.back = cc.Sprite.create(backImage);
	// console.debug("back height:" + card.back.getContentSize().height);
	card.back.setScale(192 / card.front.getContentSize().height)

	// indicate card face up
	card.isFaceUp = true;
	
	// indicate whether card is selected
	card.isSelected=false;

	/***************************************************************************
	 * public functions
	 */

	/**
	 * turn card face up
	 */
	card.faceUp = function() {
		if (card.isFaceUp == true) {
			// do nothing
		} else {
			card.toggle();
		}
	}

	/**
	 * turn card face down
	 */
	card.faceDown = function() {
		if (card.isFaceUp == false) {
			// do nothing
		} else {
			card.toggle();
		}
	}

	/**
	 * turn card face up/down
	 */
	card.toggle = function() {
		card.isFaceUp = !card.isFaceUp;

		// update display
		card.updateDisplay();
	}

	/***************************************************************************
	 * private supported functions
	 */

	card.updateDisplay = function() {
		if (card.isFaceUp == true) {
			// display front of card

			// clean display
			card.removeAllChildren(false);

			card.front.setAnchorPoint(new cc.Point(0, 0));
			card.addChild(card.front);
			if(card.isSelected){
				card.front.setPosition(new cc.Point(0, 192*0.2));
			}else{
				card.front.setPosition(new cc.Point(0, 0));
			}
		} else {
			// display back of card
			// clean display
			card.removeAllChildren(false);

			card.back.setAnchorPoint(new cc.Point(0, 0));
			card.addChild(card.back);
			if(card.isSelected){
				card.back.setPosition(new cc.Point(0, 192*0.2));
			}else{
				card.back.setPosition(new cc.Point(0, 0));
			}
		}
	}
	
	/************************************************
	 * override functions
	 */
	/**
	 * event hander uses content size to determine whether event is occurred on certain node. 
	 * For example, touch event will be sent to all registered touchEventListener, 
	 * event listener need to determine whether user touch on certain node on touch position (relative to node) and node content area.
	 */
	card.getContentSize=function(){
		return new cc.Size(137,192);
	}
	
	/****************************************************************
	 * UI event handlers
	 */
	
	
	
	/**************************************
	 * initialized update display
	 */
	
	

	card.updateDisplay();

	//card.setMouseEnabled(true);
	return card;
}

var PokerPack;

/**
 * section which used to display cards.
 * 
 * @param size{cc.Size}
 * @param config{Object} {
 *            align:'left', left-padding:10, right-padding:10, top-padding:54,
 *            bottom-padding:10 }
 * @param cardPakc{Object}
 *            in API level, it communicates by card model. it gets sprites of
 *            card from cardPack
 */
var CardSection = function(size, config, cardPack) {
	var cardSection = cc.Node.create();
	cardSection.size = size;
	cardSection.config = config;// 'left' or 'right'
	cardSection.cardPack = cardPack;

	cardSection.cards = new Array();

	/***************************************************************************
	 * public functions
	 */

	/**
	 * add cards to this cardSection.
	 * 
	 * @param card{Object
	 *            or Array}
	 */
	cardSection.putCard = function(cards) {
		if (!(cards instanceof Array)) {
			cards = new Array(cards);
		}
		for (var i = 0; i < cards.length; i++) {
			cardSection.cards.push(cards[i]);
		}

		// update display
		cardSection.updateDisplay();
	}

	/**
	 * remove cards from this section.
	 * 
	 * @param cards
	 *            {object or Array}
	 */
	cardSection.removeCard = function(cards) {
		if (!(cards instanceof Array)) {
			cards = new Array(cards);
		}

		var tmp = new Array();
		for (var i = 0; i < cardSection.cards.length; i++) {
			var matched = false;
			for (var j = 0; j < cards.length; j++) {
				if (cardSection.cards[i].id === cards[j].id) {
					matched = true;
					break;
				}
			}

			// matched card should be remove, others are left
			if (!matched) {
				tmp.push(cardSection.cards[i]);
			}
		}

		cardSection.cards = tmp;

		// update display

		cardSection.updateDisplay();

	}

	/**
	 * clean all cards.
	 */
	cardSection.cleanAll = function() {
		cardSection.cards = new Array();

		// update display

		cardSection.updateDisplay();
	}
	
	
	/**
	 * get all selected cards
	 */
	cardSection.getSelected=function(){
		var selected = new Array();
		
		for(var i=0;i<cardSection.cards.length;i++){
			if(cardSection.cards[i].isSelected===true){
				selected.push(cardSection.cards[i]);
			}
		}
		
		return selected;
	}
	
	/**************************************
	 * protected functions
	 */
	/**
	 * report card selected event, only invoked by card.
	 * @param cardId {string} the id of card which is selected
	 */
	cardSection._reportSelected=function(cardId){
		for(var i=0;i<cardSection.cards.length;i++){
			if(cardSection.cards[i].id === cardId){
				cardSection.cards[i].isSelected=true;
				break;
			}
		}
	}
	
	/**
	 * report card unselected event, only invoked by card.
	 * @param cardId {string} the id of card which is unselected
	 */
	cardSection._reportUnselected=function(cardId){
		for(var i=0;i<cardSection.cards.length;i++){
			if(cardSection.cards[i].id === cardId){
				cardSection.cards[i].isSelected=false;
				break;
			}
		}
	}

	/***************************************************************************
	 * private supported functions
	 */
	cardSection.updateDisplay = function() {
		// clear all cards
		cardSection.removeAllChildren(false);

		var touchEventListener = cc.EventListener.create({
		      event: cc.EventListener.TOUCH_ONE_BY_ONE,
		      swallowTouches: true,
		      onTouchBegan: function (touch, event) { 
		            // event.getCurrentTarget() returns the *listener's* sceneGraphPriority node.   
		    	  var target = event.getCurrentTarget();
		    	  //console.debug(target);
		    	  //Get the position of the current point relative to the button
		            var locationInNode = target.convertToNodeSpace(touch.getLocation());    
		            var s = target.getContentSize();
		            var rect = cc.rect(0, 0, s.width, s.height);

		            //Check the click area
		            if (cc.rectContainsPoint(rect, locationInNode)) {       
		                
		                target.isSelected=!target.isSelected;
		                if(target.isSelected){
		                	target.getParent()._reportSelected(target.id);
		                	console.debug(target.getParent().getSelected());
		                }else{
		                	target.getParent()._reportUnselected(target.id);
		                	console.debug(target.getParent().getSelected());
		                }
		                target.updateDisplay();
		                return true;
		            }
		        },
		        //Trigger when moving touch
		        onTouchMoved: function (touch, event) {         
		            //Move the position of current button sprite
		            
		        },
		        //Process the touch end event
		        onTouchEnded: function (touch, event) {         
		            
		            
		        }
		   });
		
		
		//
		if (cardSection.config.align === 'left') {
			// all cards align to left
			var offset = 28;
			var leftPadding = cardSection.config["left-padding"];
			var bottomPadding = cardSection.config["bottom-padding"];
			var index = 0;
			for (var i = 0; i < cardSection.cards.length; i++) {
				// get sprite for card
				var sprite = cardPack.cards[cardSection.cards[i].id];

				// TODO scale card sprite to fix size of card section

				sprite.setAnchorPoint(new cc.Point(0, 0));
				sprite.setPosition(new cc.Point(leftPadding + offset * i,
						bottomPadding));
				// card section is selectable, all card should add event listener
				if(cardSection.config.selectable == true){
					 cc.eventManager.addListener(touchEventListener.clone(), sprite);
				}
				cardSection.addChild(sprite);
			}
		} else {
			// align to right
			var offset = 28;
			var leftPadding = cardSection.config["left-padding"];
			var bottomPadding = cardSection.config["bottom-padding"];
			var rightPadding = cardSection.config["right-padding"];
			var index = 0;

			// calculate the left point
			leftPadding = cardSection.size.width
					- ((cardSection.cards.length - 1) * offset + rightPadding + 138/*
																					 * add
																					 * card's
																					 * width
																					 */);

			for (var i = 0; i < cardSection.cards.length; i++) {
				// get sprite for card
				var sprite = cardPack.cards[cardSection.cards[i].id];

				// TODO scale card sprite to fix size of card section

				sprite.setAnchorPoint(new cc.Point(0, 0));
				sprite.setPosition(new cc.Point(leftPadding + offset * i,
						bottomPadding));

				// card section is selectable, all card should add event listener
				if(cardSection.config.selectable == true){
					 cc.eventManager.addListener(touchEventListener.clone(), sprite);
				}
				
				cardSection.addChild(sprite);
			}
		}
	}

	cardSection.updateDisplay();

	return cardSection;
}

var SelfSeat = function(size) {
	var seat = cc.Node.create();
	seat.size = size;

	// set user information section
	var userSection = cc.Sprite.create(RES.image.farmer);
	seat.addChild(userSection);

	userSection.setScale(128 / userSection.getContentSize().height);
	userSection.setAnchorPoint(new cc.Point(0, 1));
	userSection.setPosition(new cc.Point(0.0, size.height));

	// hand cards section

	seat.handCardSection = new CardSection(new cc.Size(seat.size.width,
			seat.size.height * 2 / 3), {
		"align" : "left",
		"left-padding" : 10,
		"right-padding" : 10,
		"top-padding" : 54,
		"bottom-padding" : 10,
		selectable:true
	}, PokerPack);
	seat.handCardSection.setAnchorPoint(new cc.Point(0, 0));
	seat.handCardSection.setPosition(new cc.Point(0, 0));

	seat.addChild(seat.handCardSection);

	// put card section. used to display cards when you put cards on table

	seat.putCardSection = new CardSection(new cc.Size(704, 192), {
		"align" : "left",
		"left-padding" : 0,
		"right-padding" : 0,
		"top-padding" : 0,
		"bottom-padding" : 0
	}, PokerPack);

	seat.putCardSection.setAnchorPoint(new cc.Point(0, 0));
	seat.putCardSection.setPosition(new cc.Point(128, 256));

	seat.addChild(seat.putCardSection);
	/***************************************************************************
	 * public functions
	 */

	/**
	 * put cards to certain section.
	 * 
	 * @param target
	 *            card section, currently only support on "handCardSection" and
	 *            "putCardSection"
	 * @param cards
	 *            models
	 */
	seat.putCard = function(targetSection, cards) {
		if (targetSection == undefined) {
			throw "doesn't specify target card section";
		}

		switch (targetSection) {
		case "handCardSection":
			seat.handCardSection.putCard(cards);
			break;
		case "putCardSection":
			seat.putCardSection.putCard(cards);
			break;
		default:
			throw "unsupported target card section: " + targetSection;
		}
	}

	/**
	 * remove card from certain section.
	 * 
	 * @param target
	 *            card section, currently only support on "handCardSection" and
	 *            "putCardSection".
	 * @param cards
	 *            models.
	 */
	seat.removeCard = function(targetSection, cards) {
		if (targetSection == undefined) {
			throw "doesn't specify target card section";
		}

		switch (targetSection) {
		case "handCardSection":
			seat.handCardSection.removeCard(cards);
			break;
		case "putCardSection":
			seat.putCardSection.removeCard(cards);
			break;
		default:
			throw "unsupported target card section: " + targetSection;
		}
	}

	/**
	 * clean all card from certain section.
	 * 
	 * @param target
	 *            card section, currently only support on "handCardSection" and
	 *            "putCardSection".
	 * @param cards
	 *            models.
	 */
	seat.cleanCard = function(targetSection) {
		if (targetSection == undefined) {
			throw "doesn't specify target card section";
		}

		switch (targetSection) {
		case "handCardSection":
			seat.handCardSection.cleanAll();
			break;
		case "putCardSection":
			seat.putCardSection.cleanAll();
			break;
		default:
			throw "unsupported target card section: " + targetSection;
		}
	}

	return seat;
}

var LeftSeat = function(size) {
	var seat = cc.Node.create();

	seat.size = size;

	// set user information section
	var userSection = cc.Sprite.create(RES.image.landlord);
	seat.addChild(userSection);

	userSection.setScale(128 / userSection.getContentSize().height);
	userSection.setAnchorPoint(new cc.Point(0, 1));
	userSection.setPosition(new cc.Point(0.0, 256));

	// information section

	seat.remainHandCardNum = 0;
	seat.remainHandCardNumView = cc.LabelTTF.create(
			seat.remainHandCardNum + "", "Arial", 60);
	seat.remainHandCardNumView.setAnchorPoint(new cc.Point(0, 0));
	seat.remainHandCardNumView.setPosition(new cc.Point(32, 32));
	//seat.remainHandCardNumView.setColor(new cc.Color3B(256, 256, 256));

	seat.addChild(seat.remainHandCardNumView, 1);

	// card sections

	// put card section

	seat.putCardSection = new CardSection(new cc.Size(512, 192), {
		"align" : "left",
		"left-padding" : 0,
		"right-padding" : 0,
		"top-padding" : 0,
		"bottom-padding" : 0
	}, PokerPack);
	seat.putCardSection.setAnchorPoint(new cc.Point(0, 0));
	seat.putCardSection.setPosition(new cc.Point(192, 0));

	seat.addChild(seat.putCardSection);

	/***************************************************************************
	 * public functions
	 */

	/**
	 * put cards to certain section.
	 * 
	 * @param target
	 *            card section, currently only support on "handCardSection" and
	 *            "putCardSection"
	 * @param cards
	 *            models
	 */
	seat.putCard = function(targetSection, cards) {
		if (targetSection == undefined) {
			throw "doesn't specify target card section";
		}

		switch (targetSection) {
		case "handCardSection":
			if (cards instanceof Array) {
				seat.remainHandCardNum += cards.length;

			} else {
				seat.remainHandCardNum++;
			}

			// update view

			seat.remainHandCardNumView.setString(seat.remainHandCardNum + "");
			break;
		case "putCardSection":
			seat.putCardSection.putCard(cards);
			break;
		default:
			throw "unsupported target card section: " + targetSection;
		}
	}

	/**
	 * remove card from certain section.
	 * 
	 * @param target
	 *            card section, currently only support on "handCardSection" and
	 *            "putCardSection".
	 * @param cards
	 *            models.
	 */
	seat.removeCard = function(targetSection, cards) {
		if (targetSection == undefined) {
			throw "doesn't specify target card section";
		}

		switch (targetSection) {
		case "handCardSection":
			if (cards instanceof Array) {
				seat.remainHandCardNum -= cards.length;

			} else {
				seat.remainHandCardNum--;
			}

			// update view

			seat.remainHandCardNumView.setString(seat.remainHandCardNum + "");
			break;
		case "putCardSection":
			seat.putCardSection.removeCard(cards);
			break;
		default:
			throw "unsupported target card section: " + targetSection;
		}
	}

	/**
	 * clean all card from certain section.
	 * 
	 * @param target
	 *            card section, currently only support on "handCardSection" and
	 *            "putCardSection".
	 * @param cards
	 *            models.
	 */
	seat.cleanCard = function(targetSection) {
		if (targetSection == undefined) {
			throw "doesn't specify target card section";
		}

		switch (targetSection) {
		case "handCardSection":
			seat.remainHandCardNum = 0;
			// update view

			seat.remainHandCardNumView.setString(seat.remainHandCardNum + "");
			break;
		case "putCardSection":
			seat.putCardSection.cleanAll();
			break;
		default:
			throw "unsupported target card section: " + targetSection;
		}
	}
	/***************************************************************************
	 * private supported functions
	 */

	return seat;
}

/**
 * 704x256
 */
var RightSeat = function(size) {
	var seat = cc.Node.create();
	seat.size = size;

	// set user information section
	var userSection = cc.Sprite.create(RES.image.landlord);
	seat.addChild(userSection);

	userSection.setScale(128 / userSection.getContentSize().height);
	userSection.setAnchorPoint(new cc.Point(0, 0));
	userSection.setPosition(new cc.Point(704 - 128, 128));

	// information section

	seat.remainHandCardNum = 0;
	seat.remainHandCardNumView = cc.LabelTTF.create(
			seat.remainHandCardNum + "", "Arial", 60);
	seat.remainHandCardNumView.setAnchorPoint(new cc.Point(0, 0));
	seat.remainHandCardNumView.setPosition(new cc.Point(576 + 32, 32));
	//seat.remainHandCardNumView.setColor(new cc.Color3B(256, 256, 256));

	seat.addChild(seat.remainHandCardNumView, 1);

	// card sections

	// put card section

	seat.putCardSection = new CardSection(new cc.Size(512, 192), {
		"align" : "right",
		"left-padding" : 0,
		"right-padding" : 0,
		"top-padding" : 0,
		"bottom-padding" : 0
	}, PokerPack);
	seat.putCardSection.setAnchorPoint(new cc.Point(0, 0));
	seat.putCardSection.setPosition(new cc.Point(0, 0));

	seat.addChild(seat.putCardSection);

	/***************************************************************************
	 * public functions
	 */

	/**
	 * put cards to certain section.
	 * 
	 * @param target
	 *            card section, currently only support on "handCardSection" and
	 *            "putCardSection"
	 * @param cards
	 *            models
	 */
	seat.putCard = function(targetSection, cards) {
		if (targetSection == undefined) {
			throw "doesn't specify target card section";
		}

		switch (targetSection) {
		case "handCardSection":
			if (cards instanceof Array) {
				seat.remainHandCardNum += cards.length;

			} else {
				seat.remainHandCardNum++;
			}

			// update view

			seat.remainHandCardNumView.setString(seat.remainHandCardNum + "");
			break;
		case "putCardSection":
			seat.putCardSection.putCard(cards);
			break;
		default:
			throw "unsupported target card section: " + targetSection;
		}
	}
	/**
	 * remove card from certain section.
	 * 
	 * @param target
	 *            card section, currently only support on "handCardSection" and
	 *            "putCardSection".
	 * @param cards
	 *            models.
	 */
	seat.removeCard = function(targetSection, cards) {
		if (targetSection == undefined) {
			throw "doesn't specify target card section";
		}

		switch (targetSection) {
		case "handCardSection":
			if (cards instanceof Array) {
				seat.remainHandCardNum -= cards.length;

			} else {
				seat.remainHandCardNum--;
			}

			// update view

			seat.remainHandCardNumView.setString(seat.remainHandCardNum + "");
			break;
		case "putCardSection":
			seat.putCardSection.removeCard(cards);
			break;
		default:
			throw "unsupported target card section: " + targetSection;
		}
	}

	/**
	 * clean all card from certain section.
	 * 
	 * @param target
	 *            card section, currently only support on "handCardSection" and
	 *            "putCardSection".
	 * @param cards
	 *            models.
	 */
	seat.cleanCard = function(targetSection) {
		if (targetSection == undefined) {
			throw "doesn't specify target card section";
		}

		switch (targetSection) {
		case "handCardSection":
			seat.remainHandCardNum = 0;
			// update view

			seat.remainHandCardNumView.setString(seat.remainHandCardNum + "");
			break;
		case "putCardSection":
			seat.putCardSection.cleanAll();
			break;
		default:
			throw "unsupported target card section: " + targetSection;
		}
	}
	/***************************************************************************
	 * private supported functions
	 */

	return seat;
}

var MyLayer = cc.Layer
		.extend({
			isMouseDown : false,
			helloImg : null,
			helloLabel : null,
			circle : null,
			sprite : null,

			init : function() {

				// ////////////////////////////
				// 1. super init first
				this._super();

				// ///////////////////////////
				// 2. add a menu item with "X" image, which is clicked to quit
				// the program
				// you may modify it.
				// ask director the window size
				var size = cc.Director.getInstance().getWinSize();

				// add a "close" icon to exit the progress. it's an autorelease
				// object
				var closeItem = cc.MenuItemImage.create(
						RES.image.s_CloseNormal, RES.image.s_CloseSelected,
						function() {
							cc.log("close");
						}, this);
				closeItem.setAnchorPoint(0.5, 0.5);

				var menu = cc.Menu.create(closeItem);
				menu.setPosition(0, 0);
				this.addChild(menu, 1);
				closeItem.setPosition(size.width - 20, 20);

				// ///////////////////////////
				// 3. add your codes below...
				// add a label shows "Hello World"
				// create and initialize a label
				this.helloLabel = cc.LabelTTF.create("Hello World", "Impact",
						38);
				// position the label on the center of the screen
				this.helloLabel.setPosition(size.width / 2, size.height - 40);
				// add the label as a child to this layer
				this.addChild(this.helloLabel, 5);

				// add "Helloworld" splash screen"
				this.sprite = cc.Sprite.create(RES.image.s_HelloWorld);
				this.sprite.setAnchorPoint(0.5, 0.5);
				this.sprite.setPosition(size.width / 2, size.height / 2);
				this.sprite.setScale(size.height
						/ this.sprite.getContentSize().height);
				this.addChild(this.sprite, 0);
			}
		});

var MainLayer = cc.Layer
		.extend({
			init : function() {

				// ////////////////////////////
				// 1. super init first
				this._super();
				
				//this.setTouchEnabled(true);
		        //this.setKeyboardEnabled(true);

				PokerPack = {
					information : {},
					cards : {
						"spades-ace" : new Card("spades-ace",
								RES.image.poker.spades_ace,
								RES.image.poker.back),
						"spades-2" : new Card("spades-2",
								RES.image.poker.spades_2, RES.image.poker.back),
						"spades-3" : new Card("spades-3",
								RES.image.poker.spades_3, RES.image.poker.back),
						"spades-4" : new Card("spades-4",
								RES.image.poker.spades_4, RES.image.poker.back),
						"spades-5" : new Card("spades-5",
								RES.image.poker.spades_5, RES.image.poker.back),
						"spades-6" : new Card("spades-6",
								RES.image.poker.spades_6, RES.image.poker.back),
						"spades-7" : new Card("spades-7",
								RES.image.poker.spades_7, RES.image.poker.back),
						"spades-8" : new Card("spades-8",
								RES.image.poker.spades_8, RES.image.poker.back),
						"spades-9" : new Card("spades-9",
								RES.image.poker.spades_9, RES.image.poker.back),
						"spades-10" : new Card("spades-10",
								RES.image.poker.spades_10, RES.image.poker.back),
						"spades-jack" : new Card("spades-jack",
								RES.image.poker.spades_jack,
								RES.image.poker.back),
						"spades-queen" : new Card("spades-queen",
								RES.image.poker.spades_queen,
								RES.image.poker.back),
						"spades-king" : new Card("spades-king",
								RES.image.poker.spades_king,
								RES.image.poker.back)
					}
				}

				// ///////////////////////////
				// 2. add a menu item with "X" image, which is clicked to quit
				// the program
				// you may modify it.
				// ask director the window size
				var size = cc.director.getWinSize();

				// add a "close" icon to exit the progress. it's an autorelease
				// object
				this.selfSeat = new SelfSeat(new cc.Size(size.width,
						size.height * 0.6));
				this.selfSeat.setAnchorPoint(new cc.Point(0, 0));
				this.selfSeat.setPosition(new cc.Point(0, 0));

				this.addChild(this.selfSeat, 0);

				// add left seat

				this.leftSeat = new LeftSeat(new cc.Size(192, 256));
				this.leftSeat.setAnchorPoint(new cc.Point(0, 0));
				this.leftSeat.setPosition(new cc.Point(0, 384));

				this.addChild(this.leftSeat);

				// add right seat

				this.rightSeat = new RightSeat(new cc.Size(192, 256));
				this.rightSeat.setAnchorPoint(new cc.Point(0, 0));
				this.rightSeat.setPosition(new cc.Point(256, 384));

				this.addChild(this.rightSeat);

				// test add card

				// var spades_ace = PokerPack.cards["spades-ace"];
				// spades_ace.faceDown();

				// this.addChild(spades_ace);

				// test card section

				// var cardSection = new CardSection(new cc.Size(size.width,
				// size.height * 0.4), 'left', PokerPack);
				// cardSection.setAnchorPoint(new cc.Point(0, 0));
				// cardSection.setPosition(new cc.Point(0, 0));

				// this.addChild(cardSection);

				var cards = [ {
					id : "spades-ace"
				}, {
					id : "spades-2"
				}, {
					id : "spades-3"
				} ];

				var cards2 = [ {
					id : "spades-jack"
				}, {
					id : "spades-queen"
				}, {
					id : "spades-king"
				} ];

				var cards3 = [ {
					id : "spades-4"
				}, {
					id : "spades-5"
				}, {
					id : "spades-6"
				} ];

				var cards4 = [ {
					id : "spades-7"
				}, {
					id : "spades-8"
				}, {
					id : "spades-9"
				} ];

				this.selfSeat.putCard("handCardSection",cards);
				
				this.leftSeat.putCard("handCardSection", cards2);
				// selfSeat.putCard("putCardSection",cards2);

				this.leftSeat.putCard("putCardSection", cards3);

				//this.rightSeat.putCard("handCardSection", cards3);

				this.rightSeat.putCard("putCardSection", cards4);

				/*
				this.rightSeat.removeCard("handCardSection", {
					id : "spades-4"
				});
				this.rightSeat.removeCard("putCardSection", {
					id : "spades-8"
				});*/
				
				//this.leftSeat.cleanCard("putCardSection");
				
				
				
			},
			onTouchesEnded:function (pTouch,pEvent){
		        console.debug(pTouch);
		        console.debug(pEvent);
		    }
		});

var MainScene = cc.Scene.extend({
	onEnter : function() {
		this._super();
		var layer = new MainLayer();
		this.addChild(layer);
		layer.init();
	}
});
