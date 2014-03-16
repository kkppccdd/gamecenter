/**
 *
 */
package me.firecloud.gamecenter.card.model

import me.firecloud.gamecenter.model.Room
import me.firecloud.gamecenter.model.RoomFactory
import java.util.UUID
import akka.actor.{ Actor, ActorRef, FSM }
import scala.concurrent.duration._
import me.firecloud.gamecenter.model.StartGame
import me.firecloud.gamecenter.model.Player
import me.firecloud.gamecenter.model.Dealer
import me.firecloud.gamecenter.model.JoinRoom
import me.firecloud.gamecenter.model.Seat
import me.firecloud.gamecenter.model.RoomDescription
import akka.actor.Props
import me.firecloud.gamecenter.model.Message
import me.firecloud.gamecenter.model.EndGame
import me.firecloud.utils.logging.Logging

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 8, 2014
 *
 */
class CardRoomDescription(kind: String, name: String, playerNum: Int) extends RoomDescription(kind, name) {

}

class CardRoomFactory extends RoomFactory {
    override def kind: String = "card"
    override def build(description: RoomDescription): Tuple2[RoomDescription, Props] = {
        val id = UUID.randomUUID().toString()
        description.id(id)
        (description, Props(new CardRoom(id)))
    }
}

// states
sealed trait State
case object Idle extends State
case object PuttingCard extends State

sealed trait Data
case object Uninitialized extends Data

class CardRoom(id: String) extends Room(id) with FSM[State, Data] with Logging {
    startWith(Idle, Uninitialized)

    when(Idle) {
        case Event(JoinRoom(userId, roomId), Uninitialized) =>
            info("received join room message")
            join(userId, sender)
            stay
        case Event(StartGame(userId), Uninitialized) => {
            // init 
            init
            // dealing cards
            dealCard
            goto(PuttingCard)
        }
    }

    when(PuttingCard) {
        case Event(PutCard(userId, cards), Uninitialized) if onturn(userId) =>
            val seat = seats((lastPerformSeatIndex + 1) % seats.length)
            cards.foreach(card => {
                seat.hand = seat.hand - card
            })
            // notify
            val putCardMsg = new PutCard(userId, cards)
            notifyAll(putCardMsg)

            // check if finish
            if (isOneHandRunOut) {
                //
                end

            }

            moveTurn
            stay

    }

    initialize

    /**
     * *************************
     * functional members
     */

    var reservedCards: List[Card] = List()

    var lastPerformSeatIndex: Int = -1
    /**
     * **************************
     * functional methods
     */

    protected def onturn(playerId: String): Boolean = {
        seats((lastPerformSeatIndex + 1) % seats.length).player._1 == playerId
    }

    protected def moveTurn: Unit = {
        lastPerformSeatIndex = (lastPerformSeatIndex + 1) % seats.length
    }

    protected def init: Unit = {
        for (i <- 1 to 33) {
            reservedCards = new Card(i) :: reservedCards
        }
    }

    protected def dealCard: Unit = {
        val cardBatchSize = reservedCards.size / seats.size
        val messages = seats.map(seat => {
            // construct deal card message
            val cards = reservedCards.take(cardBatchSize)
            val dealCard = new DealCard(Dealer.id, seat.player._1, cards)
            reservedCards = reservedCards.drop(cardBatchSize)
            seat.hand = seat.hand ++ cards.toSet[Card]

            info("seat " + seat.player._1 + " hand:" + seat.hand.size)
            dealCard
        })

        messages.foreach(msg => {
            notifyAll(msg)
        })

    }

    protected def join(playerId: String, playerActorRef: ActorRef): Unit = {
        seats = (new Seat((playerId, playerActorRef)) :: seats.reverse).reverse

        // construct join room message
        val joinRoom = new JoinRoom(playerId, id)

        seats.foreach(seat => {
            seat.player._2 ! joinRoom
        })
    }

    protected def end: Unit = {
        val endMsg = new EndGame(Dealer.id)
        notifyAll(endMsg)
    }

    protected def notifyAll(msg: Message): Unit = {
        seats.foreach(seat => {
            seat.player._2 ! msg
        })
    }
    /**
     * check if there is any one player run out his hand card
     */
    protected def isOneHandRunOut: Boolean = {
        seats.exists(seat => {
            seat.hand.size == 0
        })
    }
}