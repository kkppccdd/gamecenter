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
class RoomDescription(val kind:String,val name:String) {
	var id:String=null

}

class Seat(val player:Tuple2[String,ActorRef]){
    var hand:Set[Card]=Set()
    
    override def equals(obj:Any):Boolean={
        return obj.isInstanceOf[Seat] && obj.asInstanceOf[Seat].player._1 == this.player._1
    }
}

abstract class Room(val id:String,val seatNum:Int) extends Actor{
    var seats:List[Seat]=List()
}

trait RoomFactory{
    def kind:String
    def build(description:RoomDescription):Tuple2[RoomDescription,Props]
}

object RoomFactoryManager{
    private val _registeredFactories =Map[String,RoomFactory]()
    
    
    def registerFactory(factory:RoomFactory)=_registeredFactories.put(factory.kind, factory);
    
    def unregisterFactory(kind:String):Option[RoomFactory]=_registeredFactories.remove(kind)
    
    def unregisterFactory(factory:RoomFactory):Option[RoomFactory]=unregisterFactory(factory.kind);
    
    def getFactory(kind:String):Option[RoomFactory]=_registeredFactories.get(kind)
    
}