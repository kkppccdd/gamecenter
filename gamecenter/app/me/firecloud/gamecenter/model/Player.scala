/**
 *
 */
package me.firecloud.gamecenter.model

import akka.actor.{ Actor, ActorRef, FSM }
import play.libs.Akka
import org.apache.commons.logging.LogFactory

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 9, 2014
 *
 */
class Player(val id:String,val name:String) {

}


object Dealer extends Player("0","Dealer") 


class PlayerActor(player:Player) extends Actor{
    private val log =LogFactory.getLog(this.getClass());
    def receive={
        case msg:JoinRoom=>
            // lookup room actor
            val roomActorRef = Akka.system().actorSelection(msg.roomId)
            
            if(log.isDebugEnabled()){
                log.debug("look up roomActorRef:"+roomActorRef)
            }
            
            roomActorRef ! msg
    }
}