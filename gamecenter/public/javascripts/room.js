var Spirit =function(scene,width,height,model){
	var spirit = scene.createElement(width,height);
	//spirit.width=width;
	//spirit.height=height;
	spirit.model=model;
	return spirit;
}

// card

var Card =function(scene,width,height,model){
	var card = new Spirit(scene,width,height,model);
	
	/**
	 * status
	 */
	// face up or down
	card._isFaceUp=true;
	
	// is selected
	card._isSelected=false;
	
	// orientation portrait or landscape
	card._orientation="portrait";
	
	/***************************************************************************
	 * public functions
	 */
	// face up
	card.faceUp=function(){
		// change status
		card._isFaceUp=true;
		// redraw image
		card.redraw();
	}
	
	// face down
	card.faceDown=function(){
		// change status
		card._isFaceUp=false;
		// redraw image
		card.redraw();
	}
	
	// orient
	card.orient=function(orientation){
		if(orientation == undefined){
			throw "parameter orientation is undefined";
		}else if(orientation!=="portrait" & orientation!=="landscape"){
			throw "invalid orientation. Required portrait or landscape, but given "+orientation;
		}else{
			if(card._orientation != orientation){
				card._orientation=orientation;
				if(card._orientation==="portrait"){
					card.setOriginPoint(card.x,card.y);
					card.rotateTo("0deg");
					
				}else{
					card.setOriginPoint(card.x,card.y);
					card.rotateTo("90deg");
				}
			}
		}
	}
	
	/***************************************************************************
	 * private support functions
	 */
	card.redraw=function(){
		// determine face up or down
		if(card._isFaceUp == true){
			var image = model.frontImage;
		}else{
			var image = model.backImage;
		}
		// determine orientation
		if(card._orientation==="portrait"){
			var h=card.height;
			var w=card.width;
		}else{
			var h=card.width;
			var w=card.height;
		}
		
		card.drawImage(image,0,0,w,h);
	}
	
	
	
	
	
	/***************************************************************************
	 * initialization
	 */
	card.redraw();
	card.forceEvent();
	card.click(function(e,mouse){
		card._isSelected=!card._isSelected;
		// draw image
		if(card._isSelected){
			card.y=card.y-20;
		}else{
			card.y=card.y+20;
		}
	});
	
	return card;
}


var g_cardPack;


// player

var Player = function(scene,role){
	var player = new Spirit(scene,80,80);
	player.role=role;
	if(player.role === "farmer"){
		player.drawImage("farmer_portait",0,0,player.width,player.height);
	}else{
		player.drawImage("landlord_portait",0,0,player.width,player.height);
	}
	
	
	return player;
}

/**
 * card section
 */

var CardSection=function(scence,width,height){
	var cardSection=new Spirit(scence,width,height);
	
	cardSection._cards = new Array();
	
	/**
	 * add cards
	 */
	cardSection.addCard=function(cards){
		// determine parameter
		if(!(cards instanceof Array)){
			cards =new Array(cards);
		}
		for(var i=0;i<cards.length;i++){
			cardSection._cards.push(cards[i]);
		}
		
		cardSection.updateView();
	}
	/**
	 * remove cards
	 */
	cardSection.removeCard=function(cards){
		// determine parameter
		if(!(cards instanceof Array)){
			cards =new Array(cards);
		}
		var result = new Array();
		for(var i=0;i<cardSection._cards.length;i++){
			var flag=false;
			for(var j=0;j<cards.length;j++){
				if(cardSection._cards[i].model.id === cards[j].model.id){
					flag=true;
					break;
				}
			}
			if(flag==true){
				// remove this
			}else{
				result.push(cardSection._cards[i]);
			}
		}
		
		cardSection._cards=result;
		
		cardSection.updateView();
	}
	
	/**
	 * get selected cards
	 */
	cardSection.getSelectedCards=function(){
		var selected = new Array();
		for(var i=0;i<cardSection._cards.length;i++){
			if(cardSection._cards[i]._isSelected == true){
				selected.push(cardSection._cards[i]);
			}
		}
		
		return selected;
	}
	
	// cardSection.fillStyle = '#8ED6FF';
	// cardSection.fill();
	
	/***************************************************************************
	 * private functions
	 */
	
	cardSection.updateView=function(){
		// refresh view
		// remove all children
		cardSection.empty();
		// the redraw
		// calculate size of card
		var height=cardSection.height*0.9;


		
		for(var i=0;i<cardSection._cards.length;i++){
			var offset = cardSection._cards[i].width*height/cardSection._cards[i].height*0.3
			//console.debug("scale card to:"+height/cardSection._cards[i].height);
			cardSection._cards[i].scaleTo(height/cardSection._cards[i].height);
			cardSection._cards[i].x=cardSection.width*0.05+i*offset;
			cardSection._cards[i].y=cardSection.height*0.05;
			
			console.debug("card.x:"+cardSection._cards[i].x+",card.y:"+cardSection._cards[i].y);
			
			cardSection.append(cardSection._cards[i]);
		}
	}
	
	
	return cardSection;
}

/**
 * seat consists of three section
 */
var Seat = function(scene,width,height,model){
	var seat=new Spirit(scene,width,height,model);
	seat.getScene().getCanvas().strokeStyle = 'red';
	seat.stroke();
	
	
	/**
	 * private members
	 */ 
	// card sections
	
	// hand cards section
	seat._handCardSecction=new CardSection(scene,seat.width,seat.height*0.7);
	
	seat._handCardSecction.x=0;
	seat._handCardSecction.y=seat.height/2;
	//seat._handCardSection.fillStyle = '#8ED6FF';
	//seat._handCardSection.fill();
	
	console.debug("seat.width:"+seat.width+",seat.height:"+seat.height);
	console.debug("handCardSection position:"+seat._handCardSecction.x+","+seat._handCardSecction.y);
	seat.append(seat._handCardSecction);
	
	
	seat.addCard=function(cards){
		seat._handCardSecction.addCard(cards);
	}
	
	// put card section
	seat._putCardSection = new CardSection(scene,seat.width*0.5,seat.height*0.5);
	seat._putCardSection.x=seat.width*0.5;
	seat._putCardSection.y=seat.height/2;
	seat.append(seat._putCardSection);
	// player
	seat.setPlayer=function(player){
		var avantar = scene.createElement();
		avantar.drawImage(model.avatar,0,0,seat.height*0.3,seat.height*0.3);
		avantar.x=0;
		avantar.y=0;
		seat.append(avantar);
	}
	
	// action buttons over over put card section
	
	var putCardBt = scene.createElement();
	putCardBt.drawImage("button",0,0,66,33);
	putCardBt.x=100;
	putCardBt.y=seat.height/2;
	seat.append(putCardBt);
	
	putCardBt.forceEvent();
	putCardBt.click(function(event){
		console.debug(event);
		var cards =seat._handCardSecction.getSelectedCards();
		for(var i=0;i<cards.length;i++){
			console.debug(cards[i].model);
		}
		seat._handCardSecction.removeCard(cards);
		seat._putCardSection.addCard(cards);
		
		g_seat2.putCard(cards);
	});

	return seat;
}

/**
 * left seat,
 */

var LeftSeat=function(scene,width,height){
	var seat = new Spirit(scene,width,height);
	
	seat._handCardNum=0;
	seat._handCardNumView = scene.createElement(20,20);
	seat._handCardNumView.x=0;
	seat._handCardNumView.y=seat.height*3/4;
	
	seat.append(seat._handCardNumView);
	
	var text =canvas.Text.new(scene, seat._handCardNum);
	text.style({
        size: "18px",
        lineWidth: 300,
        color: "orange"
    }).draw(seat._handCardNumView, seat.width*0.2/4, 0);
	
	// put card section
	seat._putCardSection = new CardSection(scene,seat.width*0.6,seat.height*0.5);
	seat._putCardSection.x=seat.width*0.4;
	seat._putCardSection.y=seat.height*0.34;
	seat.append(seat._putCardSection);
	/**
	 * add card
	 */
	seat.addCard=function(num){
		seat._handCardNum=seat._handCardNum+num;
		seat._handCardNumView.remove();
		seat._handCardNumView =scene.createElement(20,20);
		seat._handCardNumView.x=0;
		seat._handCardNumView.y=seat.height*3/4;
		seat.append(seat._handCardNumView);
		
		var text =canvas.Text.new(scene, seat._handCardNum);
		text.style({
	        size: "18px",
	        lineWidth: 300,
	        color: "orange"
	    }).draw(seat._handCardNumView, seat.width*0.2/4, 0);
	}
	
	seat.removeCard =function(num){
		seat._handCardNum=seat._handCardNum-num;
		seat._handCardNumView.remove();
		seat._handCardNumView =scene.createElement(20,20);
		seat._handCardNumView.x=0;
		seat._handCardNumView.y=seat.height*3/4;
		seat.append(seat._handCardNumView);
		
		var text =canvas.Text.new(scene, seat._handCardNum);
		text.style({
	        size: "18px",
	        lineWidth: 300,
	        color: "orange"
	    }).draw(seat._handCardNumView, seat.width*0.2/4, 0);
	}
	// player
	seat.setPlayer=function(player){
		if(seat._player){
			seat._player.remove();
		}
		seat._player=player;
		seat._player.x=0;
		seat._player.y=0;
		
		seat.append(seat._player);
	}
	
	
	/**********************************************************************
	 * public functions
	 */
	/**
	 * dealer deal cards to this seat. Because the seat is other guy seat, 
	 * therefore content of these cards are unknown.
	 * 
	 * @param {int} the amount of deal cards
	 */
	seat.dealCard=function(cardNum){
		seat.addCard(cardNum);
	}
	/**
	 *  player put cards. It should show put cards on table and then decrease the number of hand cards.
	 *  
	 *  @param {Element[] or Element}
	 */
	seat.putCard=function(cards){
		if(!(cards instanceof Array)){
			cards = new Array(cards);
		}
		
		seat._putCardSection.addCard(cards);
		seat.removeCard(cards.length);
	}
	
	
	
	return seat;
}

var Room = function(scene,stage){
	var room = this;
	/**
	 * positions of three seats
	 */
	this._configuration={
			seatPositions:[{
				x:0,y:0
			},{
				x:600,y:0
			},{
				x:300,y:500
			}],
			webservice:{
				url:"ws://localhost:9000/connect/room/xxx"
			}
	}
	
	
	this._scene=scene;
	this._stage=stage;
	
	this._seats=new Array();
	
	this.addSeat=function(seat){
		var size = this._seats.push(seat);
		
		// append to stage
		var position = this._configuration.seatPositions[size-1];
		seat.x=position.x;
		seat.y=position.y;
		this._stage.append(seat);
	}
	
	/**
	 * init
	 * 
	 */
	
	this._stage.drawImage("backgroud",0,0,this._scene.getCanvas().width,this._scene.getCanvas().height);
	
	
	
	return room;
	
	
}

/*******************************************************************************
 * message codes
 */
var messageCodes={
		Notification:{cla:1,ins:4,key:"1-4"},
		JoinRoom:{cla:1,ins:1,key:"1-1"}
}

/**
 * 
 */
var Service = function(endPoint,userId){
	var service =this;
	
	this._endPoint=endPoint;
	this._userId=userId;
	
	/**
	 * connect to server
	 */
	this.connect= function(){
		service._websocket= new WebSocket(service._endPoint+"/"+service._userId);
		service._websocket.onopen=service.onopen;
		service._websocket.onclose=service.onclose;
		service._websocket.onmessage=service.onmessage;
		service._websocket.onerror=service.onerror;
	}
	
	this.onopen=function(event){
		console.debug(event);
	}
	this.onclose=function(event){
		console.debug(event);
	}
	this.onerror=function(event){
		console.debug(event);
	}
	this.onmessage=function(event){
		console.debug(event);
		var message=JSON.parse(event.data);
		var handler = service._messageHandlers[message.cla+"-"+message.ins];
		handler(message);
	}
	
	this.send=function(message){
		// check state
		if(this._websocket.readyState!=WebSocket.OPEN){
			throw "WebSocket is not opened.";
		}
		this._websocket.send(message);
	}
	
	this._messageHandlers=new Array();
	
	/**
	 * add common message handlers
	 */
	
	// notification message handler
	this._messageHandlers[messageCodes.Notification.key]=function(message){
		console.debug("receive notification");
		// lookup handler
		service._messageHandlers[message.msg.cla+"-"+message.msg.ins](message.msg);
		
	}
	
	// join room message handler
	this._messageHandlers[messageCodes.JoinRoom.key]=function(message){
		console.debug("user: "+message.userId+" join room: "+message.roomId);
	}
	
}

var g_room;
var g_card;
var g_seat2;

var CANVAS_WIDTH=800;
var CANVAS_HEIGHT=600;

var canvas = CE.defines("canvas_id").
extend(Animation).
extend(Text).
    ready(function() {
        canvas.Scene.call("MyScene");
    });
            
canvas.Scene.new({
    name: "MyScene",
    materials: {
        images: {
        	backgroud: "images/mainbg.jpg",
        	
        	farmer_portait: "images/farmer.png",
        	landlord_portait: "images/landlord.png",
        	
        	poker_back: "images/poker/back.jpg",
        	
            poker_spades_ace: "images/poker/spades-ace.png",
            poker_spades_2: "images/poker/spades-2.png",
            poker_spades_3: "images/poker/spades-3.png",
            poker_spades_4: "images/poker/spades-4.png",
            poker_spades_5: "images/poker/spades-5.png",
            poker_spades_6: "images/poker/spades-6.png",
            poker_spades_7: "images/poker/spades-7.png",
            poker_spades_8: "images/poker/spades-8.png",
            poker_spades_9: "images/poker/spades-9.png",
            poker_spades_10: "images/poker/spades-10.png",
            poker_spades_jack: "images/poker/spades-jack.png",
            poker_spades_queen: "images/poker/spades-queen.png",
            poker_spades_king: "images/poker/spades-king.png",
            button:"images/poker/button.png"
            
        }
    },
    preload: function() {
    
    },
    ready: function(stage) {
    	/**
		 * construct objects
		 */
    	// construct cards
    	g_cardPack={
    			information:{
    				name:"poker",
    				width:100,
    				height:140
    			},cards:{
    			"spades-ace":{
    				model:{id:"spades-ace",suit:"spades",point:"ace",frontImage:"poker_spades_ace",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-ace",suit:"spades",point:"ace",frontImage:"poker_spades_ace",backImage:"poker_back"})
    			},
    			"spades-two":{
    				model:{id:"spades-ace",suit:"spades",point:"ace",frontImage:"poker_spades_ace",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-two",suit:"spades",point:"two",frontImage:"poker_spades_2",backImage:"poker_back"})
    			},
    			"spades-three":{
    				model:{id:"spades-three",suit:"spades",point:"three",frontImage:"poker_spades_3",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-three",suit:"spades",point:"three",frontImage:"poker_spades_3",backImage:"poker_back"})
    			},
    			"spades-four":{
    				model:{id:"spades-four",suit:"spades",point:"four",frontImage:"poker_spades_4",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-four",suit:"spades",point:"four",frontImage:"poker_spades_4",backImage:"poker_back"})
    			},
    			"spades-five":{
    				model:{id:"spades-five",suit:"spades",point:"five",frontImage:"poker_spades_5",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-five",suit:"spades",point:"five",frontImage:"poker_spades_5",backImage:"poker_back"})
    			},
    			"spades-six":{
    				model:{id:"spades-six",suit:"spades",point:"six",frontImage:"poker_spades_6",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-six",suit:"spades",point:"six",frontImage:"poker_spades_6",backImage:"poker_back"})
    			},
    			"spades-seven":{
    				model:{id:"spades-seven",suit:"spades",point:"seven",frontImage:"poker_spades_7",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-seven",suit:"spades",point:"seven",frontImage:"poker_spades_7",backImage:"poker_back"})
    			},
    			"spades-eight":{
    				model:{id:"spades-eight",suit:"spades",point:"eight",frontImage:"poker_spades_8",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-eight",suit:"spades",point:"eight",frontImage:"poker_spades_8",backImage:"poker_back"})
    			},
    			"spades-nine":{
    				model:{id:"spades-nine",suit:"spades",point:"nine",frontImage:"poker_spades_9",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-nine",suit:"spades",point:"nine",frontImage:"poker_spades_9",backImage:"poker_back"})
    			},
    			"spades-ten":{
    				model:{id:"spades-ten",suit:"spades",point:"ten",frontImage:"poker_spades_10",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-ten",suit:"spades",point:"ten",frontImage:"poker_spades_10",backImage:"poker_back"})
    			},
    			"spades-jack":{
    				model:{id:"spades-jack",suit:"spades",point:"jack",frontImage:"poker_spades_jack",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-jack",suit:"spades",point:"jack",frontImage:"poker_spades_jack",backImage:"poker_back"})
    			},
    			"spades-queen":{
    				model:{id:"spades-queen",suit:"spades",point:"queen",frontImage:"poker_spades_queen",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-queen",suit:"spades",point:"queen",frontImage:"poker_spades_queen",backImage:"poker_back"})
    			},
    			"spades-king":{
    				model:{id:"spades-king",suit:"spades",point:"king",frontImage:"poker_spades_king",backImage:"poker_back"},
    				element:new Card(this,200,280,{id:"spades-king",suit:"spades",point:"king",frontImage:"poker_spades_king",backImage:"poker_back"})
    			}
    			}
    	}
    	
    	// construct players
    	
    	// construct seats
    	console.debug("canvas width:"+this.getCanvas().width+",height:"+this.getCanvas().height);
    	
        var seat1 = new Seat(this,this.getCanvas().width,this.getCanvas().height*5/9,{userId:"xx",name:"name",avatar:"landlord_portait"});
        
        console.debug("seat1.height:"+seat1.height);
        // seat1.x=2;
        
        // card1.orient("landscape");
        // seat1.addCard(card1);
        // seat1.addCard(card2);
        
        // seat1.addCard(new Card(this,"poker_spades_2"));
        
        seat1.setPlayer(new Player(this,"landlord"));
        
        g_room = new Room(this,stage);
        seat1.x=0;
        seat1.y=this.getCanvas().height/2;
        
        for(key in g_cardPack.cards){
        	seat1.addCard(g_cardPack.cards[key].element);
        }
        
        
        g_room._stage.append(seat1);
        
        // seat2
        g_seat2 = new LeftSeat(this,this.getCanvas().width*0.7,this.getCanvas().height/2);
        g_seat2.setPlayer(new Player(this,"farmer"));
        g_seat2.x=0;
        g_seat2.y=50;
        g_room._stage.append(g_seat2);
        
        
        
        
        
    },
    render: function(stage) {
        // this.element.x += 1;
        stage.refresh();
    },
    exit: function(stage) {
    
    }
});
