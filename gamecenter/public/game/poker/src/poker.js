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

/*******************************************************************************
 * messages
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
	card.isSelected = false;

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
			if (card.isSelected) {
				card.front.setPosition(new cc.Point(0, 192 * 0.2));
			} else {
				card.front.setPosition(new cc.Point(0, 0));
			}
		} else {
			// display back of card
			// clean display
			card.removeAllChildren(false);

			card.back.setAnchorPoint(new cc.Point(0, 0));
			card.addChild(card.back);
			if (card.isSelected) {
				card.back.setPosition(new cc.Point(0, 192 * 0.2));
			} else {
				card.back.setPosition(new cc.Point(0, 0));
			}
		}
	}

	/***************************************************************************
	 * override functions
	 */
	/**
	 * event hander uses content size to determine whether event is occurred on
	 * certain node. For example, touch event will be sent to all registered
	 * touchEventListener, event listener need to determine whether user touch
	 * on certain node on touch position (relative to node) and node content
	 * area.
	 */
	card.getContentSize = function() {
		return new cc.Size(137, 192);
	}

	/***************************************************************************
	 * UI event handlers
	 */

	/***************************************************************************
	 * initialized update display
	 */

	card.updateDisplay();

	// card.setMouseEnabled(true);
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
	cardSection.getSelected = function() {
		var selected = new Array();

		for (var i = 0; i < cardSection.cards.length; i++) {
			if (cardSection.cards[i].isSelected === true) {
				selected.push(cardSection.cards[i]);
			}
		}

		return selected;
	}

	/***************************************************************************
	 * protected functions
	 */
	/**
	 * report card selected event, only invoked by card.
	 * 
	 * @param cardId
	 *            {string} the id of card which is selected
	 */
	cardSection._reportSelected = function(cardId) {
		for (var i = 0; i < cardSection.cards.length; i++) {
			if (cardSection.cards[i].id === cardId) {
				cardSection.cards[i].isSelected = true;
				break;
			}
		}
	}

	/**
	 * report card unselected event, only invoked by card.
	 * 
	 * @param cardId
	 *            {string} the id of card which is unselected
	 */
	cardSection._reportUnselected = function(cardId) {
		for (var i = 0; i < cardSection.cards.length; i++) {
			if (cardSection.cards[i].id === cardId) {
				cardSection.cards[i].isSelected = false;
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
				// card section is selectable, all card should add event
				// listener
				if (cardSection.config.selectable == true) {
					cc.eventManager.addListener(touchEventListener.clone(),
							sprite);
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

				// card section is selectable, all card should add event
				// listener
				if (cardSection.config.selectable == true) {
					cc.eventManager.addListener(touchEventListener.clone(),
							sprite);
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

	// hand cards section

	seat.handCardSection = new CardSection(new cc.Size(seat.size.width,
			seat.size.height * 2 / 3), {
		"align" : "left",
		"left-padding" : 10,
		"right-padding" : 10,
		"top-padding" : 54,
		"bottom-padding" : 10,
		selectable : true
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

	/**
	 * buttons
	 */
	// all buttons should be put on button bar, in order to manage conveniently.
	seat.buttonBar = cc.Node.create();

	seat.buttonPutCard = cc.Sprite.create(RES.image.button);
	var labelPutCard = cc.LabelTTF.create("出牌", "FreeMono Bold", 32);
	labelPutCard.setFontFillColor(new cc.Color(0, 0, 0));
	var bnPutCardSize = seat.buttonPutCard.getContentSize();

	labelPutCard.setPosition(new cc.Point(bnPutCardSize.width / 2,
			bnPutCardSize.height / 2));
	seat.buttonPutCard.addChild(labelPutCard);

	seat.buttonPutCard.setAnchorPoint(new cc.Point(0, 0));
	seat.buttonPutCard.setPosition(new cc.Point(64, 32));
	
	// it is invisible when started
	seat.buttonPutCard.setVisible(false);

	seat.buttonBar.addChild(seat.buttonPutCard, 0, 0);

	seat.buttonPass = cc.Sprite.create(RES.image.button);

	var labelPass = cc.LabelTTF.create("不出", "FreeMono Bold", 32);
	labelPass.setFontFillColor(new cc.Color(0, 0, 0));
	var bnPassSize = seat.buttonPass.getContentSize();

	labelPass.setPosition(new cc.Point(seat.buttonPass.width / 2,
			bnPutCardSize.height / 2));
	seat.buttonPass.addChild(labelPass);
	// it is invisible when started
	seat.buttonPass.setVisible(false)


	seat.buttonPass.setAnchorPoint(new cc.Point(0, 0));
	seat.buttonPass.setPosition(new cc.Point(256, 32));

	seat.buttonBar.addChild(seat.buttonPass, 0, 1);

	// add button bar to seat
	seat.buttonBar.setAnchorPoint(new cc.Point(0, 0));
	seat.buttonBar.setPosition(new cc.Point(128, 256));
	seat.addChild(seat.buttonBar, 0, 11);

	/***************************************************************************
	 * public functions
	 */

	/**
	 * set player.
	 * 
	 * @param player
	 *            {Object}
	 */
	seat.setPlayer = function(player) {
		seat.player = player;
		// set user information section
		if (seat.userSection != undefined) {
			// remove old
			seat.removeChild(seat.userSection, false);
		}

		seat.userSection = cc.Sprite.create(player.avatar);
		seat.addChild(seat.userSection);

		seat.userSection
				.setScale(128 / seat.userSection.getContentSize().height);
		seat.userSection.setAnchorPoint(new cc.Point(0, 1));
		seat.userSection.setPosition(new cc.Point(0.0, size.height));
	}
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

	/**
	 * show message in tip box.
	 */
	seat.showMessage = function(text) {
		var messageBox = cc.LabelTTF.create(text, "Arial", 60);
		messageBox.setAnchorPoint(new cc.Point(0, 0));
		messageBox.setPosition(new cc.Point(160, seat.size.height * 2 / 3));
		seat.addChild(messageBox, 0, 11);
	}
	/**
	 * clean tip box
	 */
	seat.cleanMessage = function() {
		seat.removeChildByTag(11);
	}

	return seat;
}

var LeftSeat = function(size) {
	var seat = cc.Node.create();

	seat.size = size;

	// information section

	seat.remainHandCardNum = 0;
	seat.remainHandCardNumView = cc.LabelTTF.create(
			seat.remainHandCardNum + "", "Arial", 60);
	seat.remainHandCardNumView.setAnchorPoint(new cc.Point(0, 0));
	seat.remainHandCardNumView.setPosition(new cc.Point(32, 32));
	// seat.remainHandCardNumView.setColor(new cc.Color3B(256, 256, 256));

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
	 * set player.
	 * 
	 * @param player
	 *            {Object}
	 */
	seat.setPlayer = function(player) {
		seat.player = player;
		// set user information section
		if (seat.userSection != undefined) {
			// remove old
			seat.removeChild(seat.userSection, false);
		}
		seat.userSection = cc.Sprite.create(player.avatar);
		seat.addChild(seat.userSection);

		seat.userSection
				.setScale(128 / seat.userSection.getContentSize().height);
		seat.userSection.setAnchorPoint(new cc.Point(0, 1));
		seat.userSection.setPosition(new cc.Point(0.0, size.height));
	}
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

	/**
	 * show message in tip box.
	 */
	seat.showMessage = function(text) {
		var messageBox = cc.LabelTTF.create(text, "Arial", 60);
		messageBox.setAnchorPoint(new cc.Point(0, 0));
		messageBox.setPosition(new cc.Point(160, 0));
		seat.addChild(messageBox, 0, 11);
	}
	/**
	 * clean tip box
	 */
	seat.cleanMessage = function() {
		seat.removeChildByTag(11);
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

	// information section

	seat.remainHandCardNum = 0;
	seat.remainHandCardNumView = cc.LabelTTF.create(
			seat.remainHandCardNum + "", "Arial", 60);
	seat.remainHandCardNumView.setAnchorPoint(new cc.Point(0, 0));
	seat.remainHandCardNumView.setPosition(new cc.Point(576 + 32, 32));
	// seat.remainHandCardNumView.setColor(new cc.Color3B(256, 256, 256));

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
	 * set player.
	 * 
	 * @param player
	 *            {Object}
	 */
	seat.setPlayer = function(player) {
		seat.player = player;
		// set user information section
		if (seat.userSection != undefined) {
			// remove old
			seat.removeChild(seat.userSection, false);
		}
		seat.userSection = cc.Sprite.create(player.avatar);
		seat.addChild(seat.userSection);

		seat.userSection
				.setScale(128 / seat.userSection.getContentSize().height);
		seat.userSection.setAnchorPoint(new cc.Point(0, 1));
		seat.userSection.setPosition(new cc.Point(576, size.height));
	}
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

	/**
	 * show message in tip box.
	 */
	seat.showMessage = function(text) {
		var messageBox = cc.LabelTTF.create(text, "Arial", 60);
		messageBox.setAnchorPoint(new cc.Point(0, 0));
		messageBox.setPosition(new cc.Point(416, 0));
		seat.addChild(messageBox, 0, 11);
	}
	/**
	 * clean tip box
	 */
	seat.cleanMessage = function() {
		seat.removeChildByTag(11);
	}
	/***************************************************************************
	 * private supported functions
	 */

	return seat;
}

/*******************************************************************************
 * card pack
 */

/*******************************************************************************
 * card images
 */

var PokerPack = {
	information : {
		suits : [ "spades", "hearts", "diamonds", "clubs" ]
	},
	cards : {}
}
// var cardSpriteFrames=new Array();

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

var PlayerBoardLayer = cc.LayerGradient.extend({
	userSections : new Array(),
	playerNum : 0,
	init : function() {

		// ////////////////////////////
		// 1. super init first
		this._super(cc.color(110, 208, 240, 255), cc.color(1, 166, 232, 255),
				cc.p(0.5, 0.5));

		// //////////////////////////////////
		// 2. draw background
		var size = cc.director.getWinSize();

		// ////////////
		// draw empty userSection

		// userSection size 128x160

		for (var i = 0; i < fc.roomInfo.seatSize; i++) {
			var userSection = cc.LayerColor.create(cc.color(255, 255, 0, 255),
					128, 128);
			this.userSections.push(userSection);
			userSection.setAnchorPoint(new cc.Point(0, 0));
			userSection.setPosition(new cc.Point(i * 128 + 32, 32));

			this.addChild(userSection, i);
		}

		// init room
		room.init();

		// var test =cc.LabelTTF.create("xxxx", "Arial", 60);
		// test.setAnchorPoint(new cc.Point(0, 0));
		// test.setPosition(new cc.Point(576 + 32, 32));

		// this.addChild(test);
	},
	/***************************************************************************
	 * public functions
	 */
	addPlayer : function(player) {
		// create sprite for player
		var avatar = cc.Sprite.create(player.avatar);

		// scale
		avatar.setScale(128 / avatar.getContentSize().width);

		// add to userSection
		avatar.setAnchorPoint(new cc.Point(0, 0));
		avatar.setPosition(new cc.Point(0, 0));

		this.userSections[this.playerNum].addChild(avatar);
		this.playerNum++;
	}

});

var MainLayer = cc.LayerGradient
		.extend({
			init : function() {

				// ////////////////////////////
				// 1. super init first
				this._super(cc.color(110, 208, 240, 255), cc.color(1, 166, 232,
						255), cc.p(0.5, 0.5));

				// this.setTouchEnabled(true);
				// this.setKeyboardEnabled(true);

				var backImage = cc.SpriteFrame.create(RES.image.cards,
						new cc.Rect(160 * 2, 192 * 0, 160, 192));

				for (var s = 0; s < PokerPack.information.suits.length; s++) {
					for (var p = 1; p <= 13; p++) {
						var frontImage = cc.SpriteFrame.create(RES.image.cards,
								new cc.Rect(160 * (p - 1), 192 * (s + 1), 160,
										192));

						PokerPack.cards[PokerPack.information.suits[s] + "-"
								+ p] = new Card(PokerPack.information.suits[s]
								+ "-" + p, frontImage, backImage);
					}
				}

				// ///////////////////////////
				// 2. add a menu item with "X" image, which is clicked to quit
				// the program
				// you may modify it.
				// ask director the window size
				var size = cc.director.getWinSize();

				// find the position of self
				var selfPos = -1;
				for (var i = 0; i < room.players.length; i++) {
					if (room.players[i].id == fc.self.id) {
						selfPos = i;
						break;
					}
				}

				for (var i = 0; i < room.players.length; i++) {
					if (i == (selfPos + room.seatSize - 1) % room.seatSize) {
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
					} else if (i == (selfPos + 1) % room.seatSize) {
						// add right seat

						var rightSeat = new RightSeat(new cc.Size(192, 256));

						rightSeat.setAnchorPoint(new cc.Point(0, 0));
						rightSeat.setPosition(new cc.Point(256, 384));
						rightSeat.setPlayer(room.players[i]);

						room.seats.push(rightSeat);
						this.addChild(rightSeat);
					}
				}

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

				// //this.selfSeat.putCard("handCardSection", cards);

				// this.leftSeat.putCard("handCardSection", cards2);
				// selfSeat.putCard("putCardSection",cards2);

				// this.leftSeat.putCard("putCardSection", cards3);

				// this.rightSeat.putCard("handCardSection", cards3);

				// this.rightSeat.putCard("putCardSection", cards4);

				/*
				 * this.rightSeat.removeCard("handCardSection", { id :
				 * "spades-4" }); this.rightSeat.removeCard("putCardSection", {
				 * id : "spades-8" });
				 */

				// this.leftSeat.cleanCard("putCardSection");
			}
		});

var AskBetDialog = cc.Layer.extend({
	ctor : function(callback) {

		// ////////////////////////////
		// 1. super init first
		this._super();

		var size = cc.director.getWinSize();

		// this.init(cc.color(255,0,0,128), size.width/2,size.height/2);

		// add dialog background

		var bgNode = cc.DrawNode.create();
		bgNode.drawRect(new cc.Point((size.width - 384) / 2,
				(size.height - 279) / 2), new cc.Point(
				(size.width - 384) / 2 + 384, (size.height - 279) / 2 + 279),
				new cc.Color(255, 0, 0, 255), 1, new cc.Color(255, 0, 0, 255));

		// bgNode.setAnchorPoint(new cc.Point(0.5,0.5));
		// bgNode.setPosition(new cc.Point(size.width/2,size.height/2));

		this.addChild(bgNode);

		var textField = ccui.TextField.create();
		textField.setTouchEnabled(true);
		textField.fontName = "Marker Felt";
		textField.fontSize = 30;
		textField.placeHolder = "input words here";
		textField.x = size.width / 2.0;
		textField.y = size.height / 2.0;

		textField.addEventListenerTextField(function(sender, type) {
			var textField = sender;
			console.debug(type);
		}, this);
		this.addChild(textField, 1, 1);

		// add button
		var confirmBn = cc.Sprite.create(RES.image.button);
		var confirmLabel = cc.LabelTTF.create("OK", "FreeMono Bold", 32);
		confirmLabel.setFontFillColor(new cc.Color(0, 0, 0));
		confirmLabel.setPosition(new cc.Point(
				confirmBn.getContentSize().width / 2, confirmBn
						.getContentSize().height / 2));
		confirmBn.addChild(confirmLabel);
		confirmBn.setPosition(new cc.Point(size.width / 2, size.height / 2
				- (279 / 2 - 50)));
		this.addChild(confirmBn);

		var theDialog = this;
		var confirmBtEventListener = cc.EventListener.create({
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

					console.debug("get input:" + textField.getStringValue());

					if (callback != undefined) {
						callback(textField.getStringValue());
					}

					// remove self
					theDialog.getParent().removeChild(theDialog, true);
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

		cc.eventManager.addListener(confirmBtEventListener, confirmBn);

	}
});
/**
 * after enough players joint room, then start game and show this scene.
 */
var MainScene = cc.Scene.extend({
	onEnter : function() {
		this._super();
		var layer = new MainLayer();
		this.addChild(layer, 0);
		layer.init();
	}
});

/**
 * when waiting players to join room.
 */
var WaitPlayerScene = cc.Scene.extend({
	onEnter : function() {
		this._super();
		// var ws = cc.director.getWinSize();
		// var layer1 = cc.LayerColor.create(cc.color(168,223,243, 128),
		// ws.width, ws.height);
		// this.addChild(layer1);
		var layer = new PlayerBoardLayer();
		this.addChild(layer, 0, 0);
		layer.init();
	}
});

/*******************************************************************************
 * room
 */

var room = {
	self : {
		id : fc.self.id,
		name : fc.self.name
	},
	webSocket : null,
	wsEndPoint : "ws://" + fc.serviceInfo.host + ":" + fc.serviceInfo.port
			+ "/service/user",

	/***************************************************************************
	 * seats
	 */
	seats : new Array(),
	seatPosOff : 0,
	seatSize : 3,
	players : new Array(),
	/***************************************************************************
	 * runtime flags
	 */
	state : "INITIALIZED",

	/***************************************************************************
	 * UI
	 */
	scenes : {
		waitPlayerScene : null,
		mainScene : null
	},
	/***************************************************************************
	 * message handlers
	 */
	// handle incoming message
	messageHandlers : {},
	// handle ask actions message, enable actions for user performing
	actionEnablers : {},
	init : function() {
		// init room, connect to server
		this.connect();

	},
	findSeatByPlayerId : function(playerId) {
		// find the seat
	},
	send : function(message) {
		this.webSocket.send(JSON.stringify(message));
	},

	/***************************************************************************
	 * private supported functions
	 */
	/**
	 * connect to server
	 */
	connect : function() {
		this.webSocket = new WebSocket(this.wsEndPoint + "/" + this.self.id);
		var thisRoom = this;
		// set web socket message handler
		this.webSocket.onopen = function() {
			thisRoom.onWsOpen();
		};

		this.webSocket.onclose = function() {
			thisRoom.onWsClose();
		};
		this.webSocket.onerror = function(error) {
			thisRoom.onWsError(error);
		};
		this.webSocket.onmessage = function(event) {
			thisRoom.onWsMessage(JSON.parse(event.data));
		};
	},
	/**
	 * handle web socket open event
	 */
	onWsOpen : function() {
		console.debug("ws is connected." + this.webSocket);

		// add message handler
		var theHandlers = this.messageHandlers;

		// notification handler
		this.messageHandlers[MESSAGE.NOTIFICATION.key] = function(msg) {
			// 
			var event = msg.msg;

			var actualHandler = theHandlers[event.cla + "-" + event.ins];
			if (actualHandler != undefined) {
				actualHandler(event);
			} else {
				console.info("unhandled msg:" + JSON.stringify(event));
			}
		}

		var theRoom = this;
		// join room handler
		this.messageHandlers[MESSAGE.JOIN_ROOM.key] = function(msg) {
			// get user information
			var player = {
				id : msg.userId,
				avatar : "farmer.png"
			};
			// store it. seats should be rendered after all players joint room.
			theRoom.players[msg.position] = player;
			var playerBoardLayer = theRoom.scenes.waitPlayerScene
					.getChildByTag(0);
			playerBoardLayer.addPlayer(player);

		};

		// start game handler
		this.messageHandlers[MESSAGE.START_GAME.key] = function(msg) {
			// init
			cc.director.runScene(theRoom.scenes.mainScene);

			// send ready message
			var readyMsg = {
				userId : fc.self.id,
				cla : 1,
				ins : 6
			};
			theRoom.send(readyMsg);
		}
		// end game handler
		this.messageHandlers[MESSAGE.END_GAME.key] = function(msg) {
			// show result
			// TODO
			alert("Game Over");
		}

		// ask handler
		this.messageHandlers[MESSAGE.ASK.key] = function(msg) {
			if (msg.actions != undefined) {
				// disable all actions
				for(var key in theRoom.actionEnablers){
					if(theRoom.actionEnablers.hasOwnProperty(key)){
						theRoom.actionEnablers[key].disable();
					}
				}
				for (var i = 0; i < msg.actions.length; i++) {
					var actionEnabler = theRoom.actionEnablers[msg.actions[i][0]
							+ "-" + msg.actions[i][1]];
					if (actionEnabler != undefined & actionEnabler != null) {
						// perform action enabler
						actionEnabler.enable();
					}
				}
			}

		}

		// deal card handler
		this.messageHandlers[MESSAGE.DEAL_CARD.key] = function(msg) {
			// look up target seat

			for (var i = 0; i < theRoom.seats.length; i++) {
				if (theRoom.seats[i].player.id === msg.toUserId) {
					theRoom.seats[i].putCard("handCardSection", msg.cards);
					break;
				}
			}
		}

		// bet handler
		this.messageHandlers[MESSAGE.BET.key] = function(msg) {
			// look up target seat
			var targetSeat = theRoom.lookupSeat(msg.userId);
			if (targetSeat != undefined) {
				targetSeat.showMessage(msg.amount + "");
			}

		}

		// put card and append card handler
		var putAppendCardHandler = function(msg) {
			// lookup target seat
			var targetSeat = theRoom.lookupSeat(msg.userId);
			if (targetSeat != undefined) {
				targetSeat.removeCard("handCardSection", msg.cards);
				targetSeat.putCard("putCardSection", msg.cards);
			}
		}

		this.messageHandlers[MESSAGE.PUT_CARD.key] = putAppendCardHandler;
		this.messageHandlers[MESSAGE.APPEND_CARD.key] = putAppendCardHandler;

		// pass handler
		this.messageHandlers[MESSAGE.PASS.key] = function(msg) {
			// lookup target seat
			var targetSeat = theRoom.lookupSeat(msg.userId);
			if (targetSeat != undefined) {
				// show message
				targetSeat.showMessage("Pass");
			}

		}

		/***********************************************************************
		 * construct action enablers
		 */
		// bet action
		this.actionEnablers[MESSAGE.BET.key] = {
			enable : function() {
				// show dialog
				var theRoomObj = theRoom;
				var askBetDialog = new AskBetDialog(function(amount) {
					var betMsg = new Bet(amount);

					theRoomObj.send(betMsg);
				});

				cc.director.getRunningScene().addChild(askBetDialog);
			},
			disable : function() {
				// do nothing
			}
		};
		// put card action enabler
		this.actionEnablers[MESSAGE.PUT_CARD.key] = {
			enable : function() {
				// show put card button

				var selfSeat = theRoom.lookupSeat(fc.self.id);
				var putCardBt = selfSeat.getChildByTag(11).getChildByTag(0);

				// add event handler for put card button

				cc.eventManager.addListener(this.eventListener, putCardBt);

				putCardBt.setVisible(true);
			},
			disable : function() {
				var selfSeat = theRoom.lookupSeat(fc.self.id);
				var putCardBt = selfSeat.getChildByTag(11).getChildByTag(0);

				// remove event listener

				cc.eventManager.removeListener(this.eventListener);

				putCardBt.setVisible(false);
			},
			eventListener : cc.EventListener
					.create({
						event : cc.EventListener.TOUCH_ONE_BY_ONE,
						swallowTouches : true,
						onTouchBegan : function(touch, event) {
							// event.getCurrentTarget() returns the *listener's*
							// sceneGraphPriority node.
							var target = event.getCurrentTarget();
							// console.debug(target);
							// Get the position of the current point relative to
							// the
							// button
							var locationInNode = target
									.convertToNodeSpace(touch.getLocation());
							var s = target.getContentSize();
							var rect = cc.rect(0, 0, s.width, s.height);

							// Check the click area
							if (cc.rectContainsPoint(rect, locationInNode)) {

								
								// look up self seat
								var selfSeat = room.lookupSeat(fc.self.id);
								console
										.debug("putCard button is clicked. selected cards are:"
												+ selfSeat.handCardSection
														.getSelected());

								// send put card message
								var putCardMsg = new PutCard(fc.self.id,
										selfSeat.handCardSection.getSelected());

								room.send(putCardMsg);
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
					})
		};

		// append card action enabler
		this.actionEnablers[MESSAGE.APPEND_CARD.key] = {
			enable : function() {
				// show put card button

				var selfSeat = theRoom.lookupSeat(fc.self.id);
				var putCardBt = selfSeat.getChildByTag(11).getChildByTag(0);
				// add event handler for put card button

				cc.eventManager.addListener(this.eventListener, putCardBt);

				putCardBt.setVisible(true);
			},
			disable : function() {
				var selfSeat = theRoom.lookupSeat(fc.self.id);
				var putCardBt = selfSeat.getChildByTag(11).getChildByTag(0);
				// remove event listener

				cc.eventManager.removeListener(this.eventListener);

				putCardBt.setVisible(false);
			},
			eventListener : cc.EventListener
					.create({
						event : cc.EventListener.TOUCH_ONE_BY_ONE,
						swallowTouches : true,
						onTouchBegan : function(touch, event) {
							// event.getCurrentTarget() returns the *listener's*
							// sceneGraphPriority node.
							var target = event.getCurrentTarget();
							// console.debug(target);
							// Get the position of the current point relative to
							// the
							// button
							var locationInNode = target
									.convertToNodeSpace(touch.getLocation());
							var s = target.getContentSize();
							var rect = cc.rect(0, 0, s.width, s.height);

							// Check the click area
							if (cc.rectContainsPoint(rect, locationInNode)) {
								// look up self seat
								var selfSeat = room.lookupSeat(fc.self.id);
								console
										.debug("putCard button is clicked. selected cards are:"
												+ selfSeat.handCardSection
														.getSelected());

								// send put card message
								var appendCardMsg = new AppendCard(fc.self.id,
										selfSeat.handCardSection.getSelected());

								room.send(appendCardMsg);
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
					})
		};

		// pass action enabler
		this.actionEnablers[MESSAGE.PASS.key] = {
			enable : function() {
				// show pass button
				var selfSeat = theRoom.lookupSeat(fc.self.id);
				var passBt = selfSeat.getChildByTag(11).getChildByTag(1);
				// add event listener

				cc.eventManager.addListener(this.eventListener, passBt);

				passBt.setVisible(true);
			},
			disable : function() {
				var selfSeat = theRoom.lookupSeat(fc.self.id);
				var passBt = selfSeat.getChildByTag(11).getChildByTag(1);
				// remove event listener

				cc.eventManager.removeListener(this.eventListener);

				passBt.setVisible(false);
			},
			eventListener : cc.EventListener.create({
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

						// send pass message
						var passMsg = new Pass(fc.self.id);

						room.send(passMsg);
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
			})
		}

	},
	/**
	 * handle web socket close event
	 */
	onWsClose : function() {
		console.debug("ws is close.");
	},
	/**
	 * handle web socket error event
	 */
	onWsError : function(error) {
		console.debug("ws is error." + error);
	},
	/**
	 * handle web socket receive message event
	 */
	onWsMessage : function(msg) {
		console.debug(msg);
		var msgHandler = this.messageHandlers[msg.cla + "-" + msg.ins];
		if (msgHandler != undefined) {
			msgHandler(msg);
		} else {
			console.info("unhandled msg:" + JSON.stringify(msg));
		}
	},

	/***************************************************************************
	 * private supported functions
	 */
	lookupSeat : function(userId) {
		for (var i = 0; i < this.seats.length; i++) {
			if (this.seats[i].player.id === userId) {
				return this.seats[i];
			}
		}
		return undefined;
	}

};
