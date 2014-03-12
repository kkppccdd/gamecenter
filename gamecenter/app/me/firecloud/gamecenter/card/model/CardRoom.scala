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
    override def build(description:RoomDescription): Tuple2[RoomDescription,Props] ={
		val id =UUID.randomUUID().toString()
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

class CardRoom(id:String) extends Room(id) with FSM[State, Data] {
    startWith(Idle, Uninitialized)

    when(Idle) {
        case Event(JoinRoom(userId,roomId), Uninitialized) =>
            //playerActors = (userId, sender) :: playerActors
            join(userId,sender)
            stay
        case Event(StartGame(userId), Uninitialized) => {
            // init 
            init
            // dealing cards
        	dealCard
            goto(PuttingCard)
        }
    }

    initialize

    /**
     * *************************
     * functional members
     */
    
    var reservedCards:List[Card]=List()
    /**
     * **************************
     * functional methods
     */
    
    protected def init:Unit={
        for (i <- 1 to 33){
            reservedCards=new Card(i)::reservedCards
        }
    }

    protected def dealCard: Unit = {
        val cardBatchSize = reservedCards.size / seats.size
        val messages = seats.map(seat => {
            // construct deal card message
            val dealCard = new DealCard(Dealer.id, seat.player._1, reservedCards.take(cardBatchSize))
            reservedCards = reservedCards.drop(cardBatchSize)

            dealCard
        })

        seats.foreach(seat => {
            messages.foreach(msg => {
                seat.player._2 ! msg
            })
        })

    }

    protected def join(playerId:String,playerActorRef:ActorRef):Unit={
        seats = new Seat((playerId,playerActorRef))::seats
        
        // construct join room message
        val joinRoom = new JoinRoom(playerId,id)
        
        seats.foreach(seat=>{
            seat.player._2 ! joinRoom
        })
    }
}