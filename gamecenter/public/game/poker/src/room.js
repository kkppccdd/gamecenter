/************************************
 *
 *
 **/

/****************************************
 * messages functions
 */

/*******************************************************************************
 * message constructors
 */
var MESSAGE = {
	JOIN_ROOM : {
		key : "1-1",
		cla : 1,
		ins : 1
	},
	START_GAME : {
		key : "1-2",
		cla : 1,
		ins : 2
	},
	END_GAME : {
		key : "1-3",
		cla : 1,
		ins : 3
	},
	NOTIFICATION : {
		key : "1-4",
		cla : 1,
		ins : 4
	},
	ASK : {
		key : "1-5",
		cla : 1,
		ins : 5
	},
	READY : {
		key : "1-6",
		cla : 1,
		ins : 6
	},

	// POKER
	PUT_CARD : {
		key : "2-1",
		cla : 2,
		ins : 1
	},
	PASS : {
		key : "2-2",
		cla : 2,
		ins : 2
	},
	DEAL_CARD : {
		key : "2-3",
		cla : 2,
		ins : 3
	},
	APPEND_CARD : {
		key : "2-4",
		cla : 2,
		ins : 4
	},
	BET : {
		key : "2-5",
		cla : 2,
		ins : 5
	}
};
var Message = function(userId, cla, ins) {
	this.userId = userId;
	this.cla = cla;
	this.ins = ins;
}
var JoinRoom = function(userId, roomId, position) {
	var msg = new Message(userId, 0x01, 0x01);

	msg.roomId = roomId;
	if (position == undefined) {
		position = -1;
	}
	msg.position = position;

	return msg;
}

var Ready = function(userId) {
	var msg = new Message(userId, 0x01, 0x06);

	return msg;
}

var PutCard = function(userId, cards) {
	var msg = new Message(userId, 0x02, 0x01);
	msg.cards = cards;

	return msg;
}

var AppendCard = function(userId, cards) {
	var msg = new Message(userId, 0x02, 0x04);
	msg.cards = cards;

	return msg;
}

var Pass = function(userId) {
	var msg = new Message(userId, 0x02, 0x02);

	return msg;
}

var Bet = function(userId, amount) {
	var msg = new Message(userId, MESSAGE.BET.cla, MESSAGE.BET.ins);
	msg.amount = amount;

	return msg;
}

/**
 * Card
 */
/**
 * Object card, used to represent card
 */
var Card = cc.Node.extend({
	isFaceUp : true,
	isSelected : false,
	front : null,
	back : null,
	ctor : function(id, frontImage, backImage) {
		this._super();

		/**
		 * initialize
		 */

		this.id = id;
		// sprite which used to display front
		this.front = cc.Sprite.create(frontImage);

		// sprite which used to display back
		this.back = cc.Sprite.create(backImage);

		this.updateDisplay();
	},

	/***************************************************************************
	 * public functions
	 */

	/**
	 * turn card face up
	 */
	faceUp : function() {
		if (this.isFaceUp == true) {
			// do nothing
		} else {
			this.toggle();
		}
	},

	/**
	 * turn card face down
	 */
	faceDown : function() {
		if (this.isFaceUp == false) {
			// do nothing
		} else {
			this.toggle();
		}
	},

	/**
	 * turn card face up/down
	 */
	toggle : function() {
		this.isFaceUp = !this.isFaceUp;

		// update display
		this.updateDisplay();
	},

	/***************************************************************************
	 * private supported functions
	 */

	updateDisplay : function() {
		var height =this.getContentSize().height;
		if (this.isFaceUp == true) {
			// display front of card

			// clean display
			this.removeAllChildren(false);

			this.front.setAnchorPoint(new cc.Point(0, 0));
			this.addChild(this.front);
			if (this.isSelected) {
				this.front.setPosition(new cc.Point(0, height * 0.2));
			} else {
				this.front.setPosition(new cc.Point(0, 0));
			}
		} else {
			// display back of card
			// clean display
			this.removeAllChildren(false);

			this.back.setAnchorPoint(new cc.Point(0, 0));
			this.addChild(card.back);
			if (this.isSelected) {
				this.back.setPosition(new cc.Point(0, height * 0.2));
			} else {
				this.back.setPosition(new cc.Point(0, 0));
			}
		}
	},
	getContentSize:function(){
		return this.front.getContentSize();
	}

});

/**
 * abstract class
 */
var CardDock = cc.Node.extend({
	cards : null,
	size : null,
	ctor : function(size) {
		this._super();
		this.size = size;
		this.cards = new Array();
	},
	/***************************************************************************
	 * public functions
	 */
	putCard : function(cards) {
	},
	removeCard : function(cards) {
	},
	removeAll : function() {
	}
});

var HandCardDock = CardDock.extend({
	config : null,
	ctor : function(size, config) {
		this._super(size);
		this.config = config;

		this.updateDisplay();
	},
	/***************************************************************************
	 * public functions
	 */
	putCard : function(cards) {
		if (!(cards instanceof Array)) {
			cards = new Array(cards);
		}
		for (var i = 0; i < cards.length; i++) {
			this.cards.push(cards[i]);
		}

		// update display
		this.updateDisplay();
	},
	removeCard : function(cards) {
		if (!(cards instanceof Array)) {
			cards = new Array(cards);
		}

		var tmp = new Array();
		for (var i = 0; i < this.cards.length; i++) {
			var matched = false;
			for (var j = 0; j < cards.length; j++) {
				if (this.cards[i].id === cards[j].id) {
					matched = true;
					break;
				}
			}

			// matched card should be remove, others are left
			if (!matched) {
				tmp.push(this.cards[i]);
			}
		}

		this.cards = tmp;

		// update display

		this.updateDisplay();
	},
	removeAll : function() {
		this.cards = new Array();
		this.updateDisplay();
	},
	getSelected : function() {
		var selected = new Array();

		for (var i = 0; i < this.cards.length; i++) {
			if (this.cards[i].isSelected === true) {
				selected.push(this.cards[i]);
			}
		}

		return selected;
	},
	/***************************************************************************
	 * protected functions
	 */
	/**
	 * report card selected event, only invoked by card.
	 * 
	 * @param cardId
	 *            {string} the id of card which is selected
	 */
	_reportSelected : function(cardId) {
		for (var i = 0; i < this.cards.length; i++) {
			if (this.cards[i].id === cardId) {
				this.cards[i].isSelected = true;
				break;
			}
		}
	},

	/**
	 * report card unselected event, only invoked by card.
	 * 
	 * @param cardId
	 *            {string} the id of card which is unselected
	 */
	_reportUnselected : function(cardId) {
		for (var i = 0; i < this.cards.length; i++) {
			if (this.cards[i].id === cardId) {
				this.cards[i].isSelected = false;
				break;
			}
		}
	},
	/***************************************************************************
	 * private functions
	 */
	updateDisplay : function() {
		// clear all cards
		this.removeAllChildren(false);

		var touchEventListener = cc.EventListener.create({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches : true,
			onTouchBegan : function(touch, event) {
				// event.getCurrentTarget() returns the *listener's*
				// sceneGraphPriority node.
				var target = event.getCurrentTarget();
				// console.debug(target);
				// Get the position of the current point relative to the
				// button
				var locationInNode = target.convertToNodeSpace(touch
						.getLocation());
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);

				// Check the click area
				if (cc.rectContainsPoint(rect, locationInNode)) {

					target.isSelected = !target.isSelected;
					if (target.isSelected) {
						target.getParent()._reportSelected(target.id);
						console.debug(target.getParent().getSelected());
					} else {
						target.getParent()._reportUnselected(target.id);
						console.debug(target.getParent().getSelected());
					}
					target.updateDisplay();
					return true;
				}
			},
			// Trigger when moving touch
			onTouchMoved : function(touch, event) {
				// Move the position of current button sprite

			},
			// Process the touch end event
			onTouchEnded : function(touch, event) {

			}
		});

		//
		var leftPadding = this.config["left-padding"];
		var rightPadding = this.config["right-padding"];
		var topPadding = this.config["top-padding"];
		var bottomPadding = this.config["bottom-padding"];
		
		if (this.config.align === 'left') {
			// all cards align to left
			var offset = 28;
			
			var index = 0;
			for (var i = 0; i < this.cards.length; i++) {
				// get sprite for card
				var sprite = CardPack.cards[this.cards[i].id];

				// scale card sprite to fix size of card section
				
				sprite.setScale((this.size.height-topPadding-bottomPadding)/sprite.getContentSize().height);

				sprite.setAnchorPoint(new cc.Point(0, 0));
				sprite.setPosition(new cc.Point(leftPadding + offset * i,
						bottomPadding));
				// card section is selectable, all card should add event
				// listener
				if (this.config.selectable == true) {
					cc.eventManager.addListener(touchEventListener.clone(),
							sprite);
				}
				this.addChild(sprite);
			}
		} else {
			// align to right
			var offset = 28;
			var index = 0;

			// calculate the left point
			leftPadding = this.size.width
					- ((this.cards.length - 1) * offset + rightPadding + 138/*
																			 * add
																			 * card's
																			 * width
																			 */);

			for (var i = 0; i < this.cards.length; i++) {
				// get sprite for card
				var sprite = CardPack.cards[this.cards[i].id];

				// scale card sprite to fix size of card section
				
				sprite.setScale((this.size.height-topPadding-bottomPadding)/sprite.getContentSize().height);

				sprite.setAnchorPoint(new cc.Point(0, 0));
				sprite.setPosition(new cc.Point(leftPadding + offset * i,
						bottomPadding));

				// card section is selectable, all card should add event
				// listener
				if (this.config.selectable == true) {
					cc.eventManager.addListener(touchEventListener.clone(),
							sprite);
				}

				this.addChild(sprite);
			}
		}
	}
});

var NotifyCardDock = HandCardDock.extend({
	ctor : function(size, config) {
		config.selectable=false;
		this._super(size,config);
		
	},
	/******************
	 * override functions
	 */
	putCard:function(cards){
		this.cards = new Array();
		this._super(cards);
	}
});

/**
 * don't show actual cards information, only show the card amount
 */
var HiddenCardDock = HandCardDock.extend({
	ctor:function(size,config){
		this._super(size,config);
	},
	updateDisplay : function() {
		/**
		 * sprite order and tag: card icon, 1,1 card amount 2,2
		 */
		// remove all sprite
		this.removeChildByTag(1);
		this.removeChildByTag(2);

		// create card icon
		var cardIcon = new cc.Sprite(cc.SpriteFrame.create(RES.image.cards,
				new cc.Rect(124 * 2, 168 * 4, 124, 168)));
		cardIcon.setScale(44 / 168);

		cardIcon.setAnchorPoint(new cc.Point(0, 0));

		if (this.config["align"] != undefined
				& this.config["align"] === "right") {
			cardIcon.setPosition(new cc.Point(this.size.width - 36, 4));

		} else {
			// default left
			cardIcon.setPosition(new cc.Point(4, 4));
		}

		this.addChild(cardIcon, 1, 1);
		// create card amount

		var cardAmount = new cc.LabelTTF.create(this.cards.length + "",
				"Arial", 44);
		cardAmount.setFontFillColor(new cc.Color(253, 173, 3, 255));

		cardAmount.setAnchorPoint(new cc.Point(0, 0));

		if (this.config["align"] != undefined
				& this.config["align"] === "right") {
			cardAmount.setPosition(new cc.Point(4, 4));

		} else {
			// default left
			cardAmount.setPosition(new cc.Point(40, 4));
		}

		this.addChild(cardAmount, 2, 2);
	}
});

var Tip = cc.Node.extend({
	ctor : function(text, align) {
		this._super();
		// construct border
		if (align == undefined | align === "left") {
			var backgroud = new cc.Sprite(RES.image.tip_left);
		} else {
			var backgroud = new cc.Sprite(RES.image.tip_right);
		}
		backgroud.setAnchorPoint(new cc.Point(0, 0));
		backgroud.setPosition(new cc.Point(0, 0));

		this.addChild(backgroud, 0, 0);
		// show text
		var text = new cc.LabelTTF.create(text + "", "Arial", 60);
		text.setFontFillColor(new cc.Color(253, 173, 3, 255));
		text.setAnchorPoint(new cc.Point(0.5, 0.5));
		if (align == undefined | align === "left") {
			text.setPosition(new cc.Point(96, 42));
		} else {
			text.setPosition(new cc.Point(64, 42));
		}

		this.addChild(text, 1, 1);
	}

});

/**
 * exclusive show section. in which only one child is visible
 */
var ShowSection = cc.Node.extend({
	ctor : function() {
		this._super();
	},
	/**
	 * protected functions
	 */
	// show only this node, hide all other children
	_show : function(node) {
		var allChildren = this.getChildren();
		for (var i = 0; i < allChildren.length; i++) {
			allChildren[i].setVisible(false);
		}

		node.setVisible(true);
	}
});

/**
 * the avatar section
 */
var AvatarSection = cc.Node.extend({
	ctor : function() {
		this._super();

		/**
		 * the z order top to bottom
		 * 
		 * hightlight {order:20,tag:20} border{order:10,tag:10}
		 * avatar{order:0:tag:0}
		 */

		var border = new cc.DrawNode();
		border.drawRect(new cc.Point(0, 0), new cc.Point(100, 5), new cc.Color(
				255, 255, 255, 255), 0, new cc.Color(255, 255, 255, 255));
		border.drawRect(new cc.Point(0, 0), new cc.Point(5, 100), new cc.Color(
				255, 255, 255, 255), 0, new cc.Color(255, 255, 255, 255));
		border.drawRect(new cc.Point(0, 95), new cc.Point(100, 100),
				new cc.Color(255, 255, 255, 255), 0, new cc.Color(255, 255,
						255, 255));
		border.drawRect(new cc.Point(95, 0), new cc.Point(100, 100),
				new cc.Color(255, 255, 255, 255), 0, new cc.Color(255, 255,
						255, 255));

		border.setAnchorPoint(new cc.Point(0, 0));
		border.setPosition(new cc.Point(0, 0));

		this.addChild(border, 10, 10);

	},
	setAvatar : function(image) {
		// remove existed avatar sprite
		this.removeChildByTag(0);

		// 
		var avatarSprite = new cc.Sprite(image);
		avatarSprite.setAnchorPoint(new cc.Point(0, 0));
		avatarSprite.setPosition(new cc.Point(0, 0));

		this.addChild(avatarSprite, 0, 0);

	}
});

/**
 * abstract class,
 */
var Seat = cc.Node.extend({
	player : null,
	cardDocks : {},
	ctor : function(player) {
		this._super();
		this.player = player;
	},
	/***************************************************************************
	 * public functions
	 */
	putCard : function(cardDockName, cards) {
		var cardDock = this.findCardDock(cardDockName);
		if(cardDock !=undefined & cardDock!=null){
			cardDock.putCard(cards);
		}else{
			console.log("no card dock found by name:"+cardDockName);
		}
	},
	removeCard : function(cardDockName, cards) {
		var cardDock = this.findCardDock(cardDockName);
		if(cardDock !=undefined & cardDock!=null){
			cardDock.removeCard(cards);
		}else{
			console.log("no card dock found by name:"+cardDockName);
		}
	},
	cleanCard : function(cardDockName) {
		var cardDock = this.findCardDock(cardDockName);
		if(cardDock !=undefined & cardDock!=null){
			cardDock.cleanCard();
		}else{
			console.log("no card dock found by name:"+cardDockName);
		}
	},
	/***************************
	 * protected functions
	 */
	findCardDock:function(cardDockName){}
});

var SelfSeat = Seat.extend({
	tags : {
		avatarSection : 1,
		putCardButton : 11,
		appendCardButton : 12,
		passButton : 13,
		handCardDock : 21,
		putCardDock : 22
	},
	ctor : function(player) {
		this._super(player);

		// construct child UI

		// construct avatar section

		var avatarSection = new AvatarSection();
		avatarSection.setAvatar(this.player.avatar);

		avatarSection.setAnchorPoint(new cc.Point(0, 0));
		avatarSection.setPosition(new cc.Point(14, 228));

		this.addChild(avatarSection, 0, this.tags.avatarSection);

		// construct buttons
		var theSelfSeat = this;
		// construct put card button
		var putCardBn = ccui.Button.create();
		putCardBn.loadTextures(RES.image.button, RES.image.button_highlight, "");
		putCardBn.setTitleText("出牌");
		putCardBn.setTitleFontSize(60);
		putCardBn.addTouchEventListener(function(sender, type) {
			switch (type) {
			case ccui.Widget.TOUCH_BEGAN:
				console.debug("Touch Down");
				break;

			case ccui.Widget.TOUCH_MOVED:
				console.debug("Touch Move");
				break;

			case ccui.Widget.TOUCH_ENDED:
				// construct put card message and send

				var handCardDock = theSelfSeat
						.getChildByTag(theSelfSeat.tags.handCardDock);
				var selectedCards = handCardDock.getSelected();

				var putCardMsg = new PutCard(fc.self.id, selectedCards);

				fc.room.send(putCardMsg);

				break;

			case ccui.Widget.TOUCH_CANCELED:
				console.debug("Touch Cancelled");
				break;

			default:
				break;
			}
		}, putCardBn);

		putCardBn.setAnchorPoint(new cc.Point(0, 0));
		putCardBn.setPosition(new cc.Point(128, 240));

		this.addChild(putCardBn, 0, this.tags.putCardButton);

		// construct append card button

		var appendCardBn = ccui.Button.create();
		appendCardBn.loadTextures(RES.image.button, RES.image.button_highlight, "");
		appendCardBn.setTitleText("出牌");
		appendCardBn.setTitleFontSize(60);
		appendCardBn.addTouchEventListener(function(sender, type) {
			switch (type) {
			case ccui.Widget.TOUCH_BEGAN:
				console.debug("Touch Down");
				break;

			case ccui.Widget.TOUCH_MOVED:
				console.debug("Touch Move");
				break;

			case ccui.Widget.TOUCH_ENDED:
				// construct put card message and send

				var handCardDock = theSelfSeat
						.getChildByTag(theSelfSeat.tags.handCardDock);
				var selectedCards = handCardDock.getSelected();

				var appendCardMsg = new AppendCard(fc.self.id, selectedCards);

				fc.room.send(appendCardMsg);

				break;

			case ccui.Widget.TOUCH_CANCELED:
				console.debug("Touch Cancelled");
				break;

			default:
				break;
			}
		}, appendCardBn);

		appendCardBn.setAnchorPoint(new cc.Point(0, 0));
		appendCardBn.setPosition(new cc.Point(128, 240));

		this.addChild(appendCardBn, 0, this.tags.appendCardButton);

		// construct pass button

		var passBn = ccui.Button.create();
		passBn.loadTextures(RES.image.button, RES.image.button_highlight, "");
		passBn.setTitleText("不出");
		passBn.setTitleFontSize(60);
		passBn.addTouchEventListener(function(sender, type) {
			switch (type) {
			case ccui.Widget.TOUCH_BEGAN:
				console.debug("Touch Down");
				break;

			case ccui.Widget.TOUCH_MOVED:
				console.debug("Touch Move");
				break;

			case ccui.Widget.TOUCH_ENDED:
				// construct pass message and send

				var passMsg = new Pass(fc.self.id);

				fc.room.send(passMsg);

				break;

			case ccui.Widget.TOUCH_CANCELED:
				console.debug("Touch Cancelled");
				break;

			default:
				break;
			}
		}, passBn);

		passBn.setAnchorPoint(new cc.Point(0, 0));
		passBn.setPosition(new cc.Point(296, 240));

		this.addChild(passBn, 0, this.tags.passButton);

		// construct card docks

		// construct hand card dock

		var handCardDock = new HandCardDock(new cc.Size(960, 228), {
			"align" : "left",
			"left-padding" : 10,
			"right-padding" : 10,
			"top-padding" : 54,
			"bottom-padding" : 10,
			selectable : true
		});
		
		handCardDock.setAnchorPoint(new cc.Point(0,0));
		handCardDock.setPosition(new cc.Point(0,0));
		
		this.addChild(handCardDock,0,this.tags.handCardDock);
		
		
		// construct put card dock
		
		var putCardDock = new NotifyCardDock(new cc.Size(392,126/*3/4 of card size*/),{
			"align" : "right",
			"left-padding" : 0,
			"right-padding" : 0,
			"top-padding" : 0,
			"bottom-padding" : 0,
			selectable : false
		});
		
		putCardDock.setAnchorPoint(new cc.Point(0,0));
		putCardDock.setPosition(new cc.Point(440,246));
		
		this.addChild(putCardDock,0,this.tags.putCardDock);
		
	},
	/*******************
	 * override methods
	 */
	findCardDock:function(cardDockName){
		if(cardDockName != undefined & cardDockName !=null){
			if(cardDockName === "handCardDock"){
				return this.getChildByTag(this.tags.handCardDock);
			}else if(cardDockName === "putCardDock"){
				return this.getChildByTag(this.tags.putCardDock);
			}
		}
	}
});


var LeftSeat = Seat.extend({
	tags:{
		avatarSection:1,
		nameBar:11,
		titleBar:12,
		handCardDock:21,
		putCardDock:22
	},
	ctor:function(player){
		this._super(player);
		
		// construct UI
		
		// construct avatar section
		
		var avatarSection = new AvatarSection();
		avatarSection.setAvatar(this.player.avatar);

		avatarSection.setAnchorPoint(new cc.Point(0, 0));
		avatarSection.setPosition(new cc.Point(14,112));
		
		this.addChild(avatarSection,0,this.tags.avatarSection);
		
		// construct name bar
		var nameBar = cc.LabelTTF.create(this.player.name, "Arial", 24,new cc.Size(0,0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		nameBar.setAnchorPoint(new cc.Point(0,0));
		nameBar.setPosition(new cc.Point(14,80));
		
		this.addChild(nameBar,0,this.tags.nameBar);
		// construct title bar
		var titleBar = cc.LabelTTF.create("Mock title", "Arial", 24,new cc.Size(0,0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		titleBar.setAnchorPoint(new cc.Point(0,0));
		titleBar.setPosition(new cc.Point(14,48));
		
		this.addChild(titleBar,0,this.tags.titleBar);
		// construct card docks
		
		// construct hand card dock
		
		var handCardDock = new HiddenCardDock(new cc.Size(100,48),{align:"left"});
		handCardDock.setAnchorPoint(new cc.Point(0,0));
		handCardDock.setPosition(new cc.Point(14,0));
		
		this.addChild(handCardDock,0,this.tags.handCardDock);
		
		// construct put card dock
		
		var putCardDock = new NotifyCardDock(new cc.Size(334,126),{
			"align" : "left",
			"left-padding" : 0,
			"right-padding" : 0,
			"top-padding" : 0,
			"bottom-padding" : 0,
			selectable : false
		});
		
		putCardDock.setAnchorPoint(new cc.Point(0,0));
		putCardDock.setPosition(new cc.Point(132,-25));
		
		this.addChild(putCardDock,0,this.tags.putCardDock);
	},
	/*******************
	 * override methods
	 */
	findCardDock:function(cardDockName){
		if(cardDockName != undefined & cardDockName !=null){
			if(cardDockName === "handCardDock"){
				return this.getChildByTag(this.tags.handCardDock);
			}else if(cardDockName === "putCardDock"){
				return this.getChildByTag(this.tags.putCardDock);
			}
		}
	}
});


var RightSeat = Seat.extend({
	tags:{
		avatarSection:1,
		nameBar:11,
		titleBar:12,
		handCardDock:21,
		putCardDock:22
	},
	ctor:function(player){
		this._super(player);
		
		// construct UI
		
		// construct avatar section
		
		var avatarSection = new AvatarSection();
		avatarSection.setAvatar(this.player.avatar);

		avatarSection.setAnchorPoint(new cc.Point(0, 0));
		avatarSection.setPosition(new cc.Point(14,112));
		
		this.addChild(avatarSection,0,this.tags.avatarSection);
		
		// construct name bar
		var nameBar = cc.LabelTTF.create(this.player.name, "Arial", 24,new cc.Size(0,0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		nameBar.setAnchorPoint(new cc.Point(0,0));
		nameBar.setPosition(new cc.Point(14,80));
		
		this.addChild(nameBar,0,this.tags.nameBar);
		// construct title bar
		var titleBar = cc.LabelTTF.create("Mock title", "Arial", 24,new cc.Size(0,0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		titleBar.setAnchorPoint(new cc.Point(0,0));
		titleBar.setPosition(new cc.Point(14,48));
		
		this.addChild(titleBar,0,this.tags.titleBar);
		// construct card docks
		
		// construct hand card dock
		
		var handCardDock = new HiddenCardDock(new cc.Size(100,48),{align:"right"});
		handCardDock.setAnchorPoint(new cc.Point(0,0));
		handCardDock.setPosition(new cc.Point(14,0));
		
		this.addChild(handCardDock,0,this.tags.handCardDock);
		
		// construct put card dock
		
		var putCardDock = new NotifyCardDock(new cc.Size(334,126),{
			"align" : "right",
			"left-padding" : 0,
			"right-padding" : 0,
			"top-padding" : 0,
			"bottom-padding" : 0,
			selectable : false
		});
		
		putCardDock.setAnchorPoint(new cc.Point(0,0));
		putCardDock.setPosition(new cc.Point(-334,-25));
		
		this.addChild(putCardDock,0,this.tags.putCardDock);
	},
	/*******************
	 * override methods
	 */
	findCardDock:function(cardDockName){
		if(cardDockName != undefined & cardDockName !=null){
			if(cardDockName === "handCardDock"){
				return this.getChildByTag(this.tags.handCardDock);
			}else if(cardDockName === "putCardDock"){
				return this.getChildByTag(this.tags.putCardDock);
			}
		}
	}
});

/*******************************************************************************
 * scenes
 */

/*******************************************************************************
 * waiting player scene
 */

var WaitSeatLayer = cc.LayerGradient.extend({
	ctor : function(seatSize) {
		this._super(new cc.Color(4, 48, 87, 255), new cc.Color(31, 106, 161,
				255));

		for (var i = 0; i < seatSize; i++) {
			var avatarSection1 = new AvatarSection();

			avatarSection1.setAnchorPoint(new cc.Point(0, 0));
			avatarSection1.setPosition(new cc.Point(50 + 128 * i, 50));

			this.addChild(avatarSection1, 0, i);
		}
	}
});

var WaitScene = cc.Scene.extend({
	onEnter : function() {
		this._super();
		var seatLayer = new WaitSeatLayer(fc.roomInfo.seatSize);
		this.addChild(seatLayer, 1, 1);
	}
});

/*******************************************************************************
 * play scene
 */

var PlayLayer = cc.LayerGradient.extend({
	ctor : function(self, seats) {
		this._super(new cc.Color(4, 48, 87, 255), new cc.Color(31, 106, 161,
				255));

		// find the position of self
		var selfPos = -1;
		for (var i = 0; i < seats.length; i++) {
			if (seat[i].id == self.id) {
				selfPos = i;
				break;
			}
		}

		for (var i = 0; i < seats.length; i++) {
			if (i == (selfPos + seats.length - 1) % seats.length) {
				// players who on the left of self should use selfSeat
				// add left seat

				var leftSeat = new LeftSeat(new cc.Size(192, 256));
				leftSeat.setAnchorPoint(new cc.Point(0, 0));
				leftSeat.setPosition(new cc.Point(0, 384));
				leftSeat.setPlayer(room.players[i]);
				room.seats.push(leftSeat);
				this.addChild(leftSeat);
			} else if (i == selfPos) {
				var selfSeat = new SelfSeat(new cc.Size(size.width,
						size.height * 0.6));
				selfSeat.setPlayer(room.players[i]);
				selfSeat.setAnchorPoint(new cc.Point(0, 0));
				selfSeat.setPosition(new cc.Point(0, 0));
				room.seats.push(selfSeat);
				this.addChild(selfSeat, 0);
			} else if (i == (selfPos + 1) % seats.length) {
				// add right seat

				var rightSeat = new RightSeat(new cc.Size(192, 256));

				rightSeat.setAnchorPoint(new cc.Point(0, 0));
				rightSeat.setPosition(new cc.Point(256, 384));
				rightSeat.setPlayer(room.players[i]);

				room.seats.push(rightSeat);
				this.addChild(rightSeat);
			}
		}
	}
});

var PlayScene = cc.Scene.extend()

/*******************************************************************************
 * room
 */
fc.room = {
	scenes : {
		waitScene : null
	},
	seats : new Array(),

	init : function() {
		this.scenes.waitScene = new WaitScene();

		cc.director.runScene(this.scenes.waitScene);
	}
};

/*******************************************************************************
 * Poker
 */
var CardPack = {
	information : {
		suits : [ "spades", "hearts", "diamonds", "clubs" ]
	},
	cards : {},
	init : function() {
		/***
		 * the ordinate of rect start from left-top corner to right-bottom corner
		 */
		var backImage = cc.SpriteFrame.create(RES.image.cards, new cc.Rect(
				124 * 2, 168 * 4, 124, 168));

		for (var s = 0 ; s <this.information.suits.length; s++) {
			for (var p = 1; p <= 13; p++) {
				var frontImage = cc.SpriteFrame.create(RES.image.cards,
						new cc.Rect(124 * (p - 1), 168 * (this.information.suits.length-s-1), 124, 168));

				this.cards[this.information.suits[s] + "-" + p] = new Card(
						this.information.suits[s] + "-" + p, frontImage,
						backImage);
			}
		}

		// senior-joker
		this.cards["senior-joker"] = new Card("senior-joker", cc.SpriteFrame
				.create(RES.image.cards,
						new cc.Rect(124 * 0, 168 * 4, 124, 168)), backImage)
		// junior-joker
		this.cards["junior-joker"] = new Card("junior-joker", cc.SpriteFrame
				.create(RES.image.cards,
						new cc.Rect(124 * 1, 168 * 4, 124, 168)), backImage)
	}
}
