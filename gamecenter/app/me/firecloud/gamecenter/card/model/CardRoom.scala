/**
 *
 */
package me.firecloud.gamecenter.card.model

import me.firecloud.gamecenter.model.RoomConfiguration
import me.firecloud.gamecenter.model.Room
import me.firecloud.gamecenter.model.RoomFactory
import java.util.UUID
import me.firecloud.gamecenter.card.CardEngine

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 8, 2014
 *
 */
class CardRoomConfiguration(kind: String, name: String, playerNum: Int) extends RoomConfiguration(kind, name) {

}

class CardRoom(id: String) extends Room(id){
    var reservedCards:List[Card]=List()
}

class CardRoomFactory extends RoomFactory {
    override def kind: String = "card"
    override def build: CardRoom ={
		val room = new CardRoom(UUID.randomUUID().toString())
		room
    }
}