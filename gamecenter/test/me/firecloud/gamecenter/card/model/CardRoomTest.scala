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

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 9, 2014
 *
 */
class CardEngineTest extends TestKit(ActorSystem("unittest")) with ImplicitSender{
    
    val roomFactory = new CardRoomFactory
    
    @Test
    def testJoinRoom(){
        val (description,roomProps) = roomFactory.build(new CardRoomDescription("card","test-room",3))
        val roomActorRef = TestActorRef(roomProps,name=description.id)
        
        // construct mock player
        
        val player1 = TestProbe()
        
        val player2= TestProbe()
        
        val player3= TestProbe()
        
        // construct join room message
        val joinRoom1 = new JoinRoom("1",description.id)
        
        val joinRoom2 = new JoinRoom("2",description.id)
        
        val joinRoom3 = new JoinRoom("3",description.id)
        
        player1.send(roomActorRef, joinRoom1)
        
        
        
        assertEquals("player1 joint",joinRoom1.userId, player1.expectMsg(joinRoom1).userId)
        
        
        player2.send(roomActorRef, joinRoom2)
        
        assertEquals("player2 joint",joinRoom2.userId, player1.expectMsg(joinRoom2).userId)
        assertEquals("player2 joint",joinRoom2.userId, player2.expectMsg(joinRoom2).userId)
        
        player3.send(roomActorRef,joinRoom3)
        
        assertEquals("player3 joint",joinRoom3.userId, player1.expectMsg(joinRoom3).userId)
        assertEquals("player3 joint",joinRoom3.userId, player2.expectMsg(joinRoom3).userId)
        assertEquals("player3 joint",joinRoom3.userId, player3.expectMsg(joinRoom3).userId)
        
    }
    
    @Test
    def testStartGame(){
        val (description,roomProps) = roomFactory.build(new CardRoomDescription("card","test-room",3))
        val roomActorRef = TestActorRef(roomProps,name=description.id)
        
        // construct mock player
        
        val player1 = TestProbe()
        
        val player2= TestProbe()
        
        val player3= TestProbe()
        
        
         // construct join room message
        val joinRoom1 = new JoinRoom("1",description.id)
        
        val joinRoom2 = new JoinRoom("2",description.id)
        
        val joinRoom3 = new JoinRoom("3",description.id)
        
        player1.send(roomActorRef, joinRoom1)
        
        
        
        assertEquals("player1 joint",joinRoom1.userId, player1.expectMsg(joinRoom1).userId)
        
        
        player2.send(roomActorRef, joinRoom2)
        
        assertEquals("player2 joint",joinRoom2.userId, player1.expectMsg(joinRoom2).userId)
        assertEquals("player2 joint",joinRoom2.userId, player2.expectMsg(joinRoom2).userId)
        
        player3.send(roomActorRef,joinRoom3)
        
        assertEquals("player3 joint",joinRoom3.userId, player1.expectMsg(joinRoom3).userId)
        assertEquals("player3 joint",joinRoom3.userId, player2.expectMsg(joinRoom3).userId)
        assertEquals("player3 joint",joinRoom3.userId, player3.expectMsg(joinRoom3).userId)
        
        
        // start game
        
        val startGameMsg = new StartGame(Dealer.id)
        
        roomActorRef ! startGameMsg
        
        val msgs1 = player1.receiveN(3)
        assertEquals(3,msgs1.size)
        msgs1.foreach(msg=>{
            assertTrue(msg.isInstanceOf[DealCard])
            assertEquals(11,msg.asInstanceOf[DealCard].cards.size)
        })
        
        val msgs2 = player2.receiveN(3)
        assertEquals(3,msgs2.size)
        msgs2.foreach(msg=>{
            assertTrue(msg.isInstanceOf[DealCard])
            assertEquals(11,msg.asInstanceOf[DealCard].cards.size)
        })
        
        val msgs3 = player3.receiveN(3)
        assertEquals(3,msgs3.size)
        msgs3.foreach(msg=>{
            assertTrue(msg.isInstanceOf[DealCard])
            assertEquals(11,msg.asInstanceOf[DealCard].cards.size)
        })
        
    }
}