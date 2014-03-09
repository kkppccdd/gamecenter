/**
 * 
 */

var Spirit =function(scene,width,height){
	var spirit = scene.createElement();
	spirit.width=width;
	spirit.height=height;
	
	return spirit;
}

// card

var Card =function(scene,image){
	var card = new Spirit(scene,100,140);
	card.image=image;
	card.showUp =true;
	card.selected=false;
	card.drawImage(card.image,0,0,card.width,card.height);
	card.forceEvent();
	card.click(function(e,mouse){
		card.selected=!card.selected;
		// draw image
		if(card.selected){
			card.y=card.y-20;
		}else{
			card.y=card.y+20;
		}
	});
	
	return card;
}

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
 * seat consists of three section
 */
var Seat = function(scene){
	var seat=new Spirit(scene,100,80);
	seat._cards=new Array();
	seat.addCard=function(cards){
		if(!(cards instanceof Array)){
			cards=new Array(cards);
		}
		for(var i=0;i<cards.length;i++){
			if(seat._cards.length==0){
				cards[i].x=0;
				cards[i].y=90;
				
			}else{
				cards[i].x=seat._cards[seat._cards.length-1].x+20;
				cards[i].y=90;
			}
			seat._cards.push(cards[i]);
			seat.append(cards[i]);
		}
	}
	
	seat.setPlayer=function(player){
		if(seat._player){
			seat.parent.remove(seat._player);
		}
		
		seat.append(player);
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
	 * message handler
	 */
	this.receive = function(message){
		console.debug("received message:"+message);
	}
	
	/**
	 * send message
	 */
	this.send = function(message){
		// check state
		if(this._websocket.readyState!=WebSocket.OPEN){
			throw "WebSocket is not opened.";
		}
		this._websocket.send(message);
	}
	
	/**
	 * init
	 * 
	 */
	
	this._stage.drawImage("backgroud",0,0,this._scene.getCanvas().width,this._scene.getCanvas().height);
	
	
	this._websocket = new WebSocket(this._configuration.webservice.url);
	this._websocket.onopen=function(event){
		console.debug(event);
	};
	this._websocket.onclose=function(event){
		console.debug(event);
	};
	this._websocket.onmessage=function(event){
		console.debug(event);
		room.receive(event.data);
	};
	this._websocket.onerror=function(event){
		console.error(event);
	};
	
	return room;
	
	
}

var g_room;

var canvas = CE.defines("canvas_id").
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
            
        }
    },
    preload: function() {
    
    },
    ready: function(stage) {
    	/**
		 * construct objects
		 */
    	// construct cards
    	
    	// construct players
    	
    	// construct seats
    	
        var seat1 = new Seat(this);
        // seat1.x=2;
        var card1 = new Card(this,"poker_spades_ace");
        
        seat1.addCard(card1);
        
        seat1.addCard(new Card(this,"poker_spades_2"));
        
        seat1.setPlayer(new Player(this,"landlord"));
        
        g_room = new Room(this,stage);
        g_room.addSeat(seat1);
        
    },
    render: function(stage) {
        // this.element.x += 1;
        stage.refresh();
    },
    exit: function(stage) {
    
    }
});
