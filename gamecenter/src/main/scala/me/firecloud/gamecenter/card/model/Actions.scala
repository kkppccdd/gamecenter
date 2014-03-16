/**
 *
 */
package me.firecloud.gamecenter.card.model

import me.firecloud.gamecenter.model.Message


/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 4, 2014
 * requests
 */



case class PutCard(userId:String,cards:List[Card]) extends Message(userId){
    def cla:Long=0x02;//1
    def ins:Long=0x01;//1
}

case class Pass(userId:String) extends Message(userId){
    def cla:Long=0x02;//1
    def ins:Long=0x02;//1
}

case class DealCard(userId:String,toUserId:String,cards:List[Card]) extends Message(userId){
    def cla:Long=0x02;//1
    def ins:Long=0x03;//1
}