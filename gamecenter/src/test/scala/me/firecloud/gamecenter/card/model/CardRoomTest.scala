/**
 *
 */
package me.firecloud.gamecenter.card.model

import org.junit._
import org.junit.Assert._
import akka.testkit.TestActorRef
import akka.actor.ActorSystem
import me.firecloud.gamecenter.model.JoinRoom
import akka.testkit.TestKit
import akka.testkit.ImplicitSender
import akka.testkit.TestProbe
import me.firecloud.gamecenter.model.StartGame
import me.firecloud.gamecenter.model.Dealer
import me.firecloud.gamecenter.model.RoomFactory
import me.firecloud.gamecenter.model.RoomDescription
import akka.actor.Props
import akka.actor.Actor
import me.firecloud.gamecenter.model.EndGame
import me.firecloud.gamecenter.model.Message
import me.firecloud.gamecenter.model.PlayerActor
import me.firecloud.gamecenter.model.Notification
import me.firecloud.gamecenter.model.Ask

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 9, 2014
 *
 */
class CardEngineTest extends TestKit(ActorSystem("unittest")) with ImplicitSender {

    var roomFactory: RoomFactory = null
    var description: RoomDescription = null
    var roomProps: Props = null
    var roomActorRef: TestActorRef[CardRoom] = null

    // construct mock player

    var player1: TestProbe = null

    var player2: TestProbe = null

    var player3: TestProbe = null

    var hand1: List[Card] = null;
    var hand2: List[Card] = null;
    var hand3: List[Card] = null;

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
    def tearDown() {
        roomActorRef.stop
    }

    @Test
    def testJoinRoom() {

        // construct join room message
        val joinRoom1 = new JoinRoom("1", description.id)

        val joinRoom2 = new JoinRoom("2", description.id)

        val joinRoom3 = new JoinRoom("3", description.id)

        player1.send(roomActorRef, joinRoom1)

        var resp1 = player1.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]
        assertEquals("player1 joint", joinRoom1.userId, resp1.userId)

        player2.send(roomActorRef, joinRoom2)
        resp1 = player1.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]
        var resp2 = player2.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]

        assertEquals("player2 joint", joinRoom2.userId, resp1.userId)
        assertEquals("player2 joint", joinRoom2.userId, resp2.userId)

        player3.send(roomActorRef, joinRoom3)
        resp1 = player1.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]
        resp2 = player2.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]
        var resp3 = player3.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]

        assertEquals("player3 joint", joinRoom3.userId, resp1.userId)
        assertEquals("player3 joint", joinRoom3.userId, resp2.userId)
        assertEquals("player3 joint", joinRoom3.userId, resp3.userId)

        val askActions1 = player1.expectMsgClass(classOf[Ask]).actions

        assertEquals(List(StartGame.key), askActions1)

    }

    @Test
    def testStartGame() {

        // construct join room message
        val joinRoom1 = new JoinRoom("1", description.id)

        val joinRoom2 = new JoinRoom("2", description.id)

        val joinRoom3 = new JoinRoom("3", description.id)

        player1.send(roomActorRef, joinRoom1)
        var resp1 = player1.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]

        assertEquals("player1 joint", joinRoom1.userId, resp1.userId)

        player2.send(roomActorRef, joinRoom2)
        resp1 = player1.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]
        var resp2 = player2.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]

        assertEquals("player2 joint", joinRoom2.userId, resp1.userId)
        assertEquals("player2 joint", joinRoom2.userId, resp2.userId)

        player3.send(roomActorRef, joinRoom3)
        resp1 = player1.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]
        resp2 = player2.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]
        var resp3 = player3.expectMsgClass(classOf[Notification]).msg.asInstanceOf[JoinRoom]

        assertEquals("player3 joint", joinRoom3.userId, resp1.userId)
        assertEquals("player3 joint", joinRoom3.userId, resp2.userId)
        assertEquals("player3 joint", joinRoom3.userId, resp3.userId)

        var askActions1 = player1.expectMsgClass(classOf[Ask]).actions

        assertEquals(List(StartGame.key), askActions1)

        // start game

        val startGameMsg = new StartGame(Dealer.id)

        roomActorRef ! startGameMsg

        val msgs1 = player1.receiveN(3)
        assertEquals(3, msgs1.size)
        msgs1.foreach(msg => {
            assertTrue(msg.asInstanceOf[Notification].msg.isInstanceOf[DealCard])
            assertEquals(11, msg.asInstanceOf[Notification].msg.asInstanceOf[DealCard].cards.size)
            if (msg.asInstanceOf[Notification].msg.asInstanceOf[DealCard].toUserId == "1") {
                hand1 = msg.asInstanceOf[Notification].msg.asInstanceOf[DealCard].cards
            }
        })

        val msgs2 = player2.receiveN(3)
        assertEquals(3, msgs2.size)
        msgs2.foreach(msg => {
            assertTrue(msg.asInstanceOf[Notification].msg.isInstanceOf[DealCard])
            assertEquals(11, msg.asInstanceOf[Notification].msg.asInstanceOf[DealCard].cards.size)
            if (msg.asInstanceOf[Notification].msg.asInstanceOf[DealCard].toUserId == "2") {
                hand2 = msg.asInstanceOf[Notification].msg.asInstanceOf[DealCard].cards
            }
        })

        val msgs3 = player3.receiveN(3)
        assertEquals(3, msgs3.size)
        msgs3.foreach(msg => {
            assertTrue(msg.asInstanceOf[Notification].msg.isInstanceOf[DealCard])
            assertEquals(11, msg.asInstanceOf[Notification].msg.asInstanceOf[DealCard].cards.size)
            if (msg.asInstanceOf[Notification].msg.asInstanceOf[DealCard].toUserId == "3") {
                hand3 = msg.asInstanceOf[Notification].msg.asInstanceOf[DealCard].cards
            }
        })

        askActions1 = player1.expectMsgClass(classOf[Ask]).actions

        assertEquals(List(PutCard.key), askActions1)

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
        var card1 = hand1.take(5)
        hand1 = hand1.drop(5)
        var putCard1 = new PutCard("1", card1)

        player1.send(roomActorRef, putCard1)
        var msg1: Message = player1.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg1.asInstanceOf[PutCard].cards)

        var msg2: Message = player2.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg2.asInstanceOf[PutCard].cards)

        var msg3: Message = player3.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg3.asInstanceOf[PutCard].cards)

        // ask player 2 to append or pass

        msg2 = player2.expectMsgClass(classOf[Ask])
        assertEquals(List(AppendCard.key, Pass.key), msg2.asInstanceOf[Ask].actions)

        // other players put card on turn

        // player2 put 4 cards
        var card2 = hand2.take(4)
        hand2 = hand2.drop(4)
        var putCard2 = new AppendCard("2", card2)

        player2.send(roomActorRef, putCard2)

        msg1 = player1.expectMsgClass(classOf[Notification]).msg
        assertEquals(card2, msg1.asInstanceOf[AppendCard].cards)

        msg2 = player2.expectMsgClass(classOf[Notification]).msg
        assertEquals(card2, msg2.asInstanceOf[AppendCard].cards)

        msg3 = player3.expectMsgClass(classOf[Notification]).msg
        assertEquals(card2, msg3.asInstanceOf[AppendCard].cards)

        // ask player3 to append or pass

        msg3 = player3.expectMsgClass(classOf[Ask])
        assertEquals(List(AppendCard.key, Pass.key), msg3.asInstanceOf[Ask].actions)

        // player3 put 3 cards

        var card3 = hand3.take(3)
        hand3 = hand2.drop(3)
        var putCard3 = new AppendCard("3", card3)
        player3.send(roomActorRef, putCard3)

        msg1 = player1.expectMsgClass(classOf[Notification]).msg
        assertEquals(card3, msg1.asInstanceOf[AppendCard].cards)

        msg2 = player2.expectMsgClass(classOf[Notification]).msg
        assertEquals(card3, msg2.asInstanceOf[AppendCard].cards)

        msg3 = player3.expectMsgClass(classOf[Notification]).msg
        assertEquals(card3, msg3.asInstanceOf[AppendCard].cards)

        // ask player1 to append or pass
        msg1 = player1.expectMsgClass(classOf[Ask])
        assertEquals(List(AppendCard.key, Pass.key), msg1.asInstanceOf[Ask].actions)

        // player1 put 5 cards
        card1 = hand1.take(5)
        hand1 = hand1.drop(5)
        var appendCard1 = new AppendCard("1", card1)

        player1.send(roomActorRef, appendCard1)
        msg1 = player1.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg1.asInstanceOf[AppendCard].cards)

        msg2 = player2.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg2.asInstanceOf[AppendCard].cards)

        msg3 = player3.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg3.asInstanceOf[AppendCard].cards)

        // ask player 2 to append or pass
        msg2 = player2.expectMsgClass(classOf[Ask])
        assertEquals(List(AppendCard.key, Pass.key), msg2.asInstanceOf[Ask].actions)

        // player2 put 6 cards
        card2 = hand2.take(6)
        hand2 = hand2.drop(6)
        putCard2 = new AppendCard("2", card2)

        player2.send(roomActorRef, putCard2)

        msg1 = player1.expectMsgClass(classOf[Notification]).msg
        assertEquals(card2, msg1.asInstanceOf[AppendCard].cards)

        msg2 = player2.expectMsgClass(classOf[Notification]).msg
        assertEquals(card2, msg2.asInstanceOf[AppendCard].cards)

        msg3 = player3.expectMsgClass(classOf[Notification]).msg
        assertEquals(card2, msg3.asInstanceOf[AppendCard].cards)

        //ask player3 to append or pass
        msg3 = player3.expectMsgClass(classOf[Ask])
        assertEquals(List(AppendCard.key, Pass.key), msg3.asInstanceOf[Ask].actions)

        // player3 put 7 cards
        card3 = hand3.take(7)
        hand3 = hand2.drop(7)
        putCard3 = new AppendCard("3", card3)
        player3.send(roomActorRef, putCard3)

        msg1 = player1.expectMsgClass(classOf[Notification]).msg
        assertEquals(card3, msg1.asInstanceOf[AppendCard].cards)

        msg2 = player2.expectMsgClass(classOf[Notification]).msg
        assertEquals(card3, msg2.asInstanceOf[AppendCard].cards)

        msg3 = player3.expectMsgClass(classOf[Notification]).msg
        assertEquals(card3, msg3.asInstanceOf[AppendCard].cards)

        //ask player1 to append or pass
        msg1 = player1.expectMsgClass(classOf[Ask])
        assertEquals(List(AppendCard.key, Pass.key), msg1.asInstanceOf[Ask].actions)

        // player1 put last 1 card

        card1 = hand1.take(1)
        hand1 = hand1.drop(1)
        appendCard1 = new AppendCard("1", card1)

        player1.send(roomActorRef, appendCard1)
        msg1 = player1.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg1.asInstanceOf[AppendCard].cards)

        msg2 = player2.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg2.asInstanceOf[AppendCard].cards)

        msg3 = player3.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg3.asInstanceOf[AppendCard].cards)

        // it should be finish

        msg1 = player1.expectMsgClass(classOf[Notification]).msg.asInstanceOf[EndGame]

        msg2 = player2.expectMsgClass(classOf[Notification]).msg.asInstanceOf[EndGame]

        msg3 = player3.expectMsgClass(classOf[Notification]).msg.asInstanceOf[EndGame]

    }

    @Test
    def testPass() {
        //
        testStartGame()

        // check hands
        assertEquals(11, hand1.size)
        assertEquals(11, hand2.size)
        assertEquals(11, hand3.size)

        // put card start by player1

        // player1 put 5 cards
        var card1 = hand1.take(5)
        hand1 = hand1.drop(5)
        var putCard1 = new PutCard("1", card1)

        player1.send(roomActorRef, putCard1)
        var msg1: Message = player1.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg1.asInstanceOf[PutCard].cards)

        var msg2: Message = player2.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg2.asInstanceOf[PutCard].cards)

        var msg3: Message = player3.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg3.asInstanceOf[PutCard].cards)

        // ask player 2 to append or pass

        msg2 = player2.expectMsgClass(classOf[Ask])
        assertEquals(List(AppendCard.key, Pass.key), msg2.asInstanceOf[Ask].actions)

        // other players put card on turn

        // player2 pass
        var pass2 = new Pass("2")
        player2.send(roomActorRef, pass2)

        msg1 = player1.expectMsgClass(classOf[Notification]).msg
        assertEquals("2", msg1.asInstanceOf[Pass].userId)

        msg2 = player2.expectMsgClass(classOf[Notification]).msg
        assertEquals("2", msg2.asInstanceOf[Pass].userId)

        msg3 = player3.expectMsgClass(classOf[Notification]).msg
        assertEquals("2", msg3.asInstanceOf[Pass].userId)

        // ask player 3 to append or pass
        msg3 = player3.expectMsgClass(classOf[Ask])
        assertEquals(List(AppendCard.key, Pass.key), msg3.asInstanceOf[Ask].actions)

        // player3 pass too

        var pass3 = new Pass("3")
        player3.send(roomActorRef, pass3)
        msg1 = player1.expectMsgClass(classOf[Notification]).msg
        assertEquals("3", msg1.asInstanceOf[Pass].userId)

        msg2 = player2.expectMsgClass(classOf[Notification]).msg
        assertEquals("3", msg2.asInstanceOf[Pass].userId)

        msg3 = player3.expectMsgClass(classOf[Notification]).msg
        assertEquals("3", msg3.asInstanceOf[Pass].userId)

        // ask player1 start put card
        msg1 = player1.expectMsgClass(classOf[Ask])
        assertEquals(List(PutCard.key), msg1.asInstanceOf[Ask].actions)

        // player1 put all cards
        card1 = hand1.take(6)
        hand1 = hand1.drop(6)
        putCard1 = new PutCard("1", card1)

        player1.send(roomActorRef, putCard1)
        msg1 = player1.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg1.asInstanceOf[PutCard].cards)

        msg2 = player2.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg2.asInstanceOf[PutCard].cards)

        msg3 = player3.expectMsgClass(classOf[Notification]).msg
        assertEquals(card1, msg3.asInstanceOf[PutCard].cards)

        // it should be finish

        msg1 = player1.expectMsgClass(classOf[Notification]).msg.asInstanceOf[EndGame]

        msg2 = player2.expectMsgClass(classOf[Notification]).msg.asInstanceOf[EndGame]

        msg3 = player3.expectMsgClass(classOf[Notification]).msg.asInstanceOf[EndGame]
    }
}