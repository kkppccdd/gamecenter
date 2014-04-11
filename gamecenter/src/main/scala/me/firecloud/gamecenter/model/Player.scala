/**
 *
 */
package me.firecloud.gamecenter.model

import akka.actor.{ Actor, ActorRef, FSM }
import play.libs.Akka
import org.apache.commons.logging.LogFactory
import play.api.libs.iteratee.Concurrent.Channel
import me.firecloud.utils.logging.Logging
import akka.actor.Props
import akka.actor.InvalidActorNameException
import akka.actor.InvalidActorNameException
import akka.actor.ActorPath
import akka.actor.ActorSelection
import me.firecloud.gamecenter.web.MessageCodecFilter

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 9, 2014
 *
 */
class Player(val id: String, val name: String) {

}

object Dealer extends Player("0", "Dealer")

case class ClientConnectted(userId:String,channel:Channel[String])

class PlayerActor(player: Player) extends Actor with Logging {
    val messageCodecFilter = new MessageCodecFilter()

    var roomActorRef: ActorSelection = null;
    var wsChannel: Channel[String] = null

    def receive = {
        case notification:Notification=>
            notification.msg match{
                case msg:JoinRoom=>
                    roomActorRef=context.actorSelection("/user/"+msg.roomId)
            }
            
            wsChannel push messageCodecFilter.encode(notification).get
        case msg: JoinRoom =>
            // lookup room actor
        	val roomActor = context.actorSelection("/user/"+msg.roomId)

            info("look up roomActorRef:" + roomActor)
            
            roomActor!msg
        case msg:Message=>
            // pass to room actor
            if(roomActorRef!=null){
                roomActorRef ! msg
            }else{
                warn("room actor ref is null")
            }

        case ClientConnectted(userId,channel) =>
            wsChannel = channel
        
    }
}

class PlayerSupervisor extends Actor with Logging {
    def receive = {
        case ClientConnectted(userId,channel) =>
            info("player client connectted. Player id:" + userId)
            val props = Props(new PlayerActor(new Player(userId,userId)))
            try {
                val playerActorRef = context.actorOf(props, name = userId)
                info("create player actor: "+playerActorRef)
                playerActorRef ! new ClientConnectted(userId,channel)
            } catch {
                case ex: InvalidActorNameException =>
                    info(ex.message)
                    val playerActorRef = context.actorSelection(userId)
                    info("found player actor: "+playerActorRef)
                    playerActorRef ! new ClientConnectted(userId,channel)
                case ex: Throwable =>
                    error(ex.getMessage())
            }
            
            
    }
}