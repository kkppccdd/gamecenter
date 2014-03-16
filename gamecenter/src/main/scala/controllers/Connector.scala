/**
 *
 */
package controllers

import play.api._
import play.api.mvc._
import play.api.libs.iteratee._
import play.api.libs.concurrent.Execution.Implicits._
import play.libs.Akka
import akka.actor.ActorRef
import me.firecloud.gamecenter.web.MessageCodecFilter
import me.firecloud.gamecenter.model.Communication

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 1, 2014
 *
 */

object Connector extends Controller {
    val messageCodecFilter = new MessageCodecFilter()

    def communicate(userId: String) = WebSocket.using[String] {
        request => //Concurernt.broadcast returns (Enumerator, Concurrent.Channel)
            val (out, channel) = Concurrent.broadcast[String]
            
            // construct player actor
            val playerActorRef =Akka.system().actorSelection(userId)
            playerActorRef!channel
            
            //log the message to stdout and send response back to client
            val in = Iteratee.foreach[String] {
                msg =>
                    println(msg)
                    val decodedMesg = messageCodecFilter.decode(msg)
                    if (decodedMesg.isDefined) {
                        //the Enumerator returned by Concurrent.broadcast subscribes to the channel and will 
                        //receive the pushed messages
                        
                        playerActorRef!new Communication(decodedMesg.get)
                        
                        channel push ("RESPONSE: " + decodedMesg.get.cla)
                    } else {
                        channel push ("RESPONSE: ERROR MESSAGE")
                    }
            }
            (in, out)
    }

}