/**
 *
 */
package me.firecloud.gamecenter.card

import akka.actor.{ Actor, ActorRef, FSM }
import scala.concurrent.duration._
import me.firecloud.gamecenter.model.StartGame
import me.firecloud.gamecenter.card.model.CardRoom
import me.firecloud.gamecenter.model.Player
import me.firecloud.gamecenter.card.model.DealCard
import me.firecloud.gamecenter.model.Dealer
import me.firecloud.gamecenter.model.JoinRoom

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 9, 2014
 *
 */

// states
sealed trait State
case object Idle extends State
case object PuttingCard extends State

sealed trait Data
case object Uninitialized extends Data

class CardEngine(val room: CardRoom) extends Actor with FSM[State, Data] {
    startWith(Idle, Uninitialized)

    when(Idle) {
        case Event(JoinRoom(userId,roomId), Uninitialized) =>
            playerActors = (userId, sender) :: playerActors
            stay
        case Event(StartGame, Uninitialized) => {
            // dealing cards
        	dealCard
            goto(PuttingCard)
        }
    }

    initialize()

    /**
     * *************************
     * functional members
     */
    protected var playerActors: List[(String, ActorRef)]=List()
    /**
     * **************************
     * functional methods
     */

    protected def dealCard: Unit = {
        val cardBatchSize = room.reservedCards.size / room.players.size
        val messages = playerActors.map(playerActor => {
            // construct deal card message
            val dealCard = new DealCard(Dealer.id, playerActor._1, room.reservedCards.take(cardBatchSize))
            room.reservedCards = room.reservedCards.drop(cardBatchSize)

            dealCard
        })

        playerActors.foreach(playerActor => {
            messages.foreach(msg => {
                playerActor._2 ! msg
            })
        })

    }

    protected def join(playerId:String,playerActorRef:ActorRef):Unit={
        
    }
}