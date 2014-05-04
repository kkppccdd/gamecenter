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
import me.firecloud.gamecenter.model.Notification
import me.firecloud.gamecenter.model.Ask
import me.firecloud.gamecenter.model.Ready
import me.firecloud.gamecenter.model.PlayerPropertyChange

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 8, 2014
 *
 */
class CardRoomDescription(kind: String, name: String, val playerNum: Int) extends RoomDescription(kind, name) {

}

class CardRoomFactory extends RoomFactory {
    override def kind: String = "card"
    override def build(description: RoomDescription): Tuple2[RoomDescription, Props] = {
        val id = UUID.randomUUID().toString()
        description.id = id
        (description, Props(new CardRoom(id, 3)))
    }
}

class SeatCycle(seats: List[Seat]) {
    private var currentPos: Int = 0;
    // move to next seat
    def move: Seat = {
        currentPos = (currentPos + 1) % seats.size

        return seats(currentPos)
    }

    // next seat on this cycle
    def next: Seat = seats((currentPos + 1) % seats.size)

    // previous seat on this cycle
    def previous: Seat = seats((currentPos + seats.size - 1) % seats.size)

    // get current seat
    def current: Seat = seats(currentPos)
    // check if on turn
    def onturn(playerId: String) = current.player._1 == playerId
    
    def head:Seat=seats(0)

}

// states
sealed trait State
case object Idle extends State
case object Startting extends State
case object BetPhase extends State
case object StartPutCard extends State
case object AppendPutCard extends State

sealed trait Data
case object Uninitialized extends Data

class CardRoom(id: String, seatNum: Int) extends Room(id, seatNum) with FSM[State, Data] with Logging {
    startWith(Idle, Uninitialized)

    when(Idle) {
        case Event(JoinRoom(userId, roomId, position), Uninitialized) =>

            // 1. perform action and notify state changes
            info("received join room message")
            join(userId, sender)

            // 2. perform check

            // 3. calculate acceptable subsequent actions
            // check whether it's able to start
            if (!seats.exists(_.state=="FREE")) {
                // ask start game
                ask(seats(0), List(StartGame.key))
            }
            // 4. transform FSM state
            stay
        case Event(StartGame(userId), Uninitialized) => {

            // send startGame message to all players
            val startGameMsg = new StartGame(userId);

            notifyAll(startGameMsg);
            // 
            goto(Startting) // for waiting ready messages from all players
        }
    }

    when(Startting) {
        case Event(Ready(userId), Uninitialized) => {
            // lookup seat

            val seat = seats.find(seat => seat.player._1 == userId).get
            seat.ready

            // check whether all players are ready

            if (seats.exists(seat => seat.state != "READY") == false) {
                // all players are ready
                // 
                init
                dealCard
                // send ask

                ask(seats(0), List(Bet.key))

                //

                goto(BetPhase)
            } else {
                stay
            }

        }
    }
    
    when(BetPhase){
        case Event(Bet(userId,amount),Uninitialized) if defaultCycle.onturn(userId)=>{
            seats.find(seat => seat.player._1 == userId).get.bet=amount
            
            // notify all
            val betMsg = new Bet(userId,amount);
            
            defaultCycle.move
            
            notifyAll(betMsg)
            
            // check whether all players have bet
            
            if(defaultCycle.current.player._1 == defaultCycle.head.player._1){
                // all players have bet
                
                
                // decide who is the landlord
                
                val maxBetSeat = seats.maxBy(_.bet)
                maxBetSeat.role="LANDLORD"

                notifyAll(new PlayerPropertyChange(maxBetSeat.player._1,List(("role","LANDLORD"))))
                
                // ask landlord put card
                
                ask(maxBetSeat,List(PutCard.key))
                
                goto(StartPutCard)
            }else{
                stay
            }
        }
    }

    when(StartPutCard) {
        case Event(PutCard(userId, cards), Uninitialized) if defaultCycle.onturn(userId) =>
            // 1. perform action and notify state changes
            debug(userId + "put cards " + cards.size)
            cards.foreach(card => {
                defaultCycle.current.hand = defaultCycle.current.hand - card
            })

            lastAppendSeat = defaultCycle.current

            defaultCycle.move
            // notify
            val putCardMsg = new PutCard(userId, cards)
            notifyAll(putCardMsg)

            // 2. perform check

            // check if finish
            if (anyoneWin) {
                //
                end
            }

            // 3. calculate acceptable subsequent actions
            ask(defaultCycle.current, List(AppendCard.key, Pass.key))

            // 4. transform FSM state
            goto(AppendPutCard)
    }

    when(AppendPutCard) {
        case Event(AppendCard(userId, cards), Uninitialized) if defaultCycle.onturn(userId) => {
            cards.foreach(card => {
                defaultCycle.current.hand = defaultCycle.current.hand - card
            })

            lastAppendSeat = defaultCycle.current

            defaultCycle.move
            // notify
            val appendCardMsg = new AppendCard(userId, cards)
            notifyAll(appendCardMsg)

            // 2. perform check

            // check if finish
            if (anyoneWin) {
                //
                end
            }

            // 3. calculate acceptable subsequent actions
            ask(defaultCycle.current, List(AppendCard.key, Pass.key))

            stay
        }
        case Event(Pass(userId), Uninitialized) if defaultCycle.onturn(userId) => {
            // 1. perform action and notify state changes
            defaultCycle.move
            // notify
            val passMsg = new Pass(userId)
            notifyAll(passMsg)

            // 2. perform check
            // check if no one append
            if (lastAppendSeat.equals(defaultCycle.current)) {
                ask(defaultCycle.current, List(PutCard.key))
                goto(StartPutCard)
            } else {
                // 3. calculate acceptable subsequent actions
                ask(defaultCycle.current, List(AppendCard.key, Pass.key))
                // 4. transform FSM state
                stay
            }
        }
    }

    initialize

    var defaultCycle: SeatCycle = null;

    var lastAppendSeat: Seat = null;

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

    protected def init: Unit = {
        // init cycles
        defaultCycle = new SeatCycle(seats)

        reservedCards = PokerPack.cards

    }

    protected def dealCard: Unit = {
        val cardBatchSize = 17
        val messages = seats.map(seat => {
            // construct deal card message
            val cards = reservedCards.take(cardBatchSize)
            val dealCard = new DealCard(Dealer.id, seat.player._1, cards)
            reservedCards = reservedCards.drop(cardBatchSize)
            seat.hand = seat.hand ++ cards.toSet[Card]

            debug("seat " + seat.player._1 + " hand:" + seat.hand.size)
            dealCard
        })

        messages.foreach(msg => {
            notifyAll(msg)
        })

    }

    protected def join(playerId: String, playerActorRef: ActorRef): Unit = {
        
        val (seat, index) = seats.zipWithIndex.find(_._1.state == "FREE").get
        seat.player=(playerId, playerActorRef)
        seat.occupy
        

        // construct join room message
        val joinRoom = new JoinRoom(playerId, id, index)

        notifyAll(joinRoom)
    }

    protected def end: Unit = {
        val endMsg = new EndGame(Dealer.id)
        notifyAll(endMsg)
    }

    /**
     * notify all players state changes of game include state changes of involved players
     */
    protected def notifyAll(msg: Message): Unit = {
        seats.foreach(seat => {
            if(seat.state != "FREE"){
            	seat.player._2 ! new Notification(msg)
            }
        })
    }
    
    protected def notify(seat:Seat,msg:Message):Unit={
        seat.player._2 ! new Notification(msg)
    }

    /**
     * send ask message to specific player for asking he to do acceptable actions
     */
    protected def ask(seat: Seat, actions: List[Tuple2[Long, Long]]): Unit = {
        seat.player._2 ! new Ask(seat.player._1, actions)
    }

    /**
     * check if there is any one player run out his hand card
     */
    protected def anyoneWin: Boolean = {
        seats.exists(seat => {
            seat.hand.size == 0
        })
    }
}