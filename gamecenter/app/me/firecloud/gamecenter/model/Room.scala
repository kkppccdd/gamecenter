/**
 *
 */
package me.firecloud.gamecenter.model

import scala.collection.mutable.Map

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 8, 2014
 *
 */
class RoomConfiguration(kind:String,name:String) {

}

class Room(val id:String){
    var players:List[Player]=List()
}

trait RoomFactory{
    def kind:String
    def build:Room
}

object RoomFactoryManager{
    private val _registeredFactories =Map[String,RoomFactory]()
    
    
    def registerFactory(factory:RoomFactory)=_registeredFactories.put(factory.kind, factory);
    
    def unregisterFactory(kind:String):Option[RoomFactory]=_registeredFactories.remove(kind)
    
    def unregisterFactory(factory:RoomFactory):Option[RoomFactory]=unregisterFactory(factory.kind);
    
}