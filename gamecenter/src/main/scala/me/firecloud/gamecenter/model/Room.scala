/**
 *
 */
package me.firecloud.gamecenter.model

import scala.collection.mutable.Map
import akka.actor.ActorRef
import akka.actor.Actor
import akka.actor.Props
import me.firecloud.gamecenter.card.model.Card

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 8, 2014
 *
 */
class RoomDescription(val kind: String, val name: String) {
    var id: String = null

}

class Seat{
    /**
     * FREE,OCCUPIED,READY,ACTIVE,MISSED,TERMINATED
     */
    private var _state: String = "FREE"
    var player: Tuple2[String, ActorRef] = ("",null)
    var bet:Int=0
    var role:String="FARMER"
    var hand: Set[Card] = Set()

    
    /*******************************************
     * properties accessors
     */
    def state:String=_state
    /**
     * *******************************
     * state change functions
     */
    def occupy: String = {
        // check precondition
        if (_state.equals("FREE")) {
            _state = "OCCUPIED"
            return _state
        } else {
            return _state
        }
    }

    def ready: String = {
        // check precondition
        if (_state.equals("OCCUPIED")) {
            _state = "READY"
            return _state
        } else {
            return _state
        }
    }

    def activate: String = {
        // check precondition
        if (_state.equals("READY")) {
            _state = "ACTIVE"
            return _state
        } else {
            return _state
        }
    }

    def miss: String = {
        // check precondition
        if (_state.equals("ACTIVE")) {
            _state = "MISSED"
            return _state
        } else {
            return _state
        }
    }

    def comeBack: String = {
        // check precondition
        if (_state.equals("MISSED")) {
            _state = "ACTIVE"
            return _state
        } else {
            return _state
        }
    }

    override def equals(obj: Any): Boolean = {
        return obj.isInstanceOf[Seat] && obj.asInstanceOf[Seat].player._1 == this.player._1
    }
}

abstract class Room(val id: String, val seatNum: Int) extends Actor {
	var timeout:Long=45 // seconds
	val seats: List[Seat] = (for(i <- (1 to seatNum)) yield new Seat).toList
}

trait RoomFactory {
    def kind: String
    def build(description: RoomDescription): Tuple2[RoomDescription, Props]
}

object RoomFactoryManager {
    private val _registeredFactories = Map[String, RoomFactory]()

    def registerFactory(factory: RoomFactory) = _registeredFactories.put(factory.kind, factory);

    def unregisterFactory(kind: String): Option[RoomFactory] = _registeredFactories.remove(kind)

    def unregisterFactory(factory: RoomFactory): Option[RoomFactory] = unregisterFactory(factory.kind);

    def getFactory(kind: String): Option[RoomFactory] = _registeredFactories.get(kind)

}