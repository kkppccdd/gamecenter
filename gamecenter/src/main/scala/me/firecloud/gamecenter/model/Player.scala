/**
 *
 */
package me.firecloud.gamecenter.model

import akka.actor.{ Actor, ActorRef, FSM }
import play.libs.Akka
import org.apache.commons.logging.LogFactory
import play.api.libs.iteratee.Concurrent.Channel
import me.firecloud.utils.logging.Logging

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 9, 2014
 *
 */
class Player(val id:String,val name:String) {

}


object Dealer extends Player("0","Dealer") 


class PlayerActor(player:Player) extends Actor with Logging{
    private val log =LogFactory.getLog(this.getClass());
    
    var roomActorRef:ActorRef=null;
    var wsChannel:Channel[String]=null
    
    def receive={
        case msg:JoinRoom=>
            // lookup room actor
            roomActorRef =sender
            
            if(log.isDebugEnabled()){
                log.debug("look up roomActorRef:"+roomActorRef)
            }
        case channel:Channel[String]=>
            wsChannel=channel
        case Communication(msg)=>
            debug("'received msg:"+msg)
    }
}