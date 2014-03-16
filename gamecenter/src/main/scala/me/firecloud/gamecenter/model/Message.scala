/**
 *
 */
package me.firecloud.gamecenter.model

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 4, 2014
 *
 */
abstract class Message(userId:String){
    @JsonProperty("cla")
    def cla:Long
    @JsonProperty("ins")
    def ins:Long
    val id=java.util.UUID.randomUUID().toString();
}

case class JoinRoom(userId:String,roomId:String) extends Message(userId){
    def cla:Long=0x01
    def ins:Long=0x01
}

case class StartGame(userId:String) extends Message(userId){
    def cla:Long=0x01
    def ins:Long=0x02
}

case class EndGame(userId:String) extends Message(userId){
    def cla:Long=0x01
    def ins:Long=0x03
}
