/**
 *
 */

package me.firecloud.card.fightlandlord

import akka.actor.Actor;
import akka.actor.LoggingFSM
import akka.actor.FSM
/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jul 7, 2013
 *
 */

// States
sealed trait State;

case object Initialized extends State;

case object CompeteForLord extends State;
case object FirstPut extends State;
case object Append extends State;
case object PassCheck extends State;
case object Put extends State;

// Events
sealed class Action(player: Player, command: String);

case class Yield(player: Player, price: Int) extends Action(player: Player, command = "YIELD");
case class PutCard(player: Player, cards: List[Card]) extends Action(player: Player, command = "PUTCARD");
case class Follow(player: Player, cards: List[Card]) extends Action(player: Player, command = "FOLLOW");
case class Pass(player: Player) extends Action(player: Player, command = "PASS");
case class Start() extends Action(player=new Player("Dealer","Dealer"),command="START")

// Data
sealed trait Data;
case object Nothing extends Data;

// functions for checking players



class Engine extends Actor with LoggingFSM[State, Data] {
    def firstPerson(player:Player):Boolean={
        true;
    }
    startWith(Initialized, Nothing)

    when(Initialized) {
        case Event(Start(), _) =>
        log.info("initialized")
        goto(CompeteForLord)
    }
    when(CompeteForLord) {
        case Event(Yield(player,cards), Nothing) =>
            // say something
            log.info("accept event")
            stay
    }

    initialize
}

