/**
 *
 */
package me.firecloud.gamecenter.card.model

import org.junit._
import org.junit.Assert._
import akka.testkit.TestActorRef
import me.firecloud.gamecenter.card.model.CardRoomFactory
import akka.actor.ActorSystem
import me.firecloud.gamecenter.model.JoinRoom
import akka.testkit.TestKit
import akka.testkit.ImplicitSender
import akka.testkit.TestProbe
import me.firecloud.gamecenter.model.StartGame
import me.firecloud.gamecenter.model.Dealer
import me.firecloud.gamecenter.card.model.DealCard
import me.firecloud.gamecenter.card.model.DealCard
import me.firecloud.gamecenter.card.model.CardRoomDescription
import me.firecloud.gamecenter.card.model.CardRoomDescription
import me.firecloud.gamecenter.model.RoomFactory
import me.firecloud.gamecenter.model.RoomDescription
import akka.actor.Props
import akka.actor.Actor

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 9, 2014
 *
 */
class CardEngineTest extends TestKit(ActorSystem("unittest")) with ImplicitSender {

    var roomFactory: RoomFactory=null
    var description: RoomDescription=null
    var roomProps: Props=null
    var roomActorRef: TestActorRef[CardRoom]=null

    // construct mock player

    var player1: TestProbe = null

    var player2: TestProbe = null

    var player3: TestProbe = null
    
    var hand1:List[Card]=null;
    var hand2:List[Card]=null;
    var hand3:List[Card]=null;

    @Before
    def setUp() {
        roomFactory = new CardRoomFactory()
        val tuple = roomFactory.build(new CardRoomDescription("card", "test-room", 3))
        description = tuple._1
        roomProps = tuple._2
        roomActorRef = TestActorRef(roomProps, name = description.id)

        // construct mock player

        player1 = TestProbe()

        player2 = TestProbe()

        player3 = TestProbe()
    }
    
    @After
    def tearDown(){
        roomActorRef.stop
    }

    @Test
    def testJoinRoom() {

        // construct join room message
        val joinRoom1 = new JoinRoom("1", description.id)

        val joinRoom2 = new JoinRoom("2", description.id)

        val joinRoom3 = new JoinRoom("3", description.id)

        player1.send(roomActorRef, joinRoom1)

        assertEquals("player1 joint", joinRoom1.userId, player1.expectMsg(joinRoom1).userId)

        player2.send(roomActorRef, joinRoom2)

        assertEquals("player2 joint", joinRoom2.userId, player1.expectMsg(joinRoom2).userId)
        assertEquals("player2 joint", joinRoom2.userId, player2.expectMsg(joinRoom2).userId)

        player3.send(roomActorRef, joinRoom3)

        assertEquals("player3 joint", joinRoom3.userId, player1.expectMsg(joinRoom3).userId)
        assertEquals("player3 joint", joinRoom3.userId, player2.expectMsg(joinRoom3).userId)
        assertEquals("player3 joint", joinRoom3.userId, player3.expectMsg(joinRoom3).userId)

    }

    @Test
    def testStartGame() {

        // construct join room message
        val joinRoom1 = new JoinRoom("1", description.id)

        val joinRoom2 = new JoinRoom("2", description.id)

        val joinRoom3 = new JoinRoom("3", description.id)

        player1.send(roomActorRef, joinRoom1)

        assertEquals("player1 joint", joinRoom1.userId, player1.expectMsg(joinRoom1).userId)

        player2.send(roomActorRef, joinRoom2)

        assertEquals("player2 joint", joinRoom2.userId, player1.expectMsg(joinRoom2).userId)
        assertEquals("player2 joint", joinRoom2.userId, player2.expectMsg(joinRoom2).userId)

        player3.send(roomActorRef, joinRoom3)

        assertEquals("player3 joint", joinRoom3.userId, player1.expectMsg(joinRoom3).userId)
        assertEquals("player3 joint", joinRoom3.userId, player2.expectMsg(joinRoom3).userId)
        assertEquals("player3 joint", joinRoom3.userId, player3.expectMsg(joinRoom3).userId)

        // start game

        val startGameMsg = new StartGame(Dealer.id)

        roomActorRef ! startGameMsg

        val msgs1 = player1.receiveN(3)
        assertEquals(3, msgs1.size)
        msgs1.foreach(msg => {
            assertTrue(msg.isInstanceOf[DealCard])
            assertEquals(11, msg.asInstanceOf[DealCard].cards.size)
            if(msg.asInstanceOf[DealCard].toUserId=="1"){
                hand1=msg.asInstanceOf[DealCard].cards
            }
        })
        

        val msgs2 = player2.receiveN(3)
        assertEquals(3, msgs2.size)
        msgs2.foreach(msg => {
            assertTrue(msg.isInstanceOf[DealCard])
            assertEquals(11, msg.asInstanceOf[DealCard].cards.size)
            if(msg.asInstanceOf[DealCard].toUserId=="2"){
                hand2=msg.asInstanceOf[DealCard].cards
            }
        })

        val msgs3 = player3.receiveN(3)
        assertEquals(3, msgs3.size)
        msgs3.foreach(msg => {
            assertTrue(msg.isInstanceOf[DealCard])
            assertEquals(11, msg.asInstanceOf[DealCard].cards.size)
            if(msg.asInstanceOf[DealCard].toUserId=="3"){
                hand3=msg.asInstanceOf[DealCard].cards
            }
        })

    }

    @Test
    def testPutCard() {
        //
    	testStartGame()
    	
    	// check hands
    	assertEquals(11, hand1.size)
    	assertEquals(11, hand2.size)
    	assertEquals(11, hand3.size)
    	
    	
    	// put card start by player1
    	
    	// player1 put 5 cards
    	var card1=hand1.take(5)
    	hand1=hand1.drop(5)
    	var putCard1 = new PutCard("1",card1)
    	
    	
    	player1.send(roomActorRef,putCard1)
    	var msg1 = player1.expectMsg(putCard1)
    	assertEquals(card1, msg1.asInstanceOf[PutCard].cards)
    	
    	var msg2 = player2.expectMsg(putCard1)
    	assertEquals(card1, msg2.asInstanceOf[PutCard].cards)
    	
    	var msg3 = player3.expectMsg(putCard1)
    	assertEquals(card1, msg3.asInstanceOf[PutCard].cards)
    	
    	// other players put card on turn
    	
    	// player2 put 4 cards
    	var card2 =hand2.take(4)
    	hand2=hand2.drop(4)
    	var putCard2 = new PutCard("2",card2)
    	
    	player2.send(roomActorRef,putCard2)
    	
    	msg1=player1.expectMsg(putCard2)
    	assertEquals(card2, msg1.asInstanceOf[PutCard].cards)
    	
    	msg2 = player2.expectMsg(putCard2)
    	assertEquals(card2, msg2.asInstanceOf[PutCard].cards)
    	
    	msg3 = player3.expectMsg(putCard2)
    	assertEquals(card2, msg3.asInstanceOf[PutCard].cards)
    }
}