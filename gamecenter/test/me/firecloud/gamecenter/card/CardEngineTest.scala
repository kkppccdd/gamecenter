/**
 *
 */
package me.firecloud.gamecenter.card

import org.junit._
import Assert._
import akka.testkit.TestActorRef
import me.firecloud.gamecenter.card.model.CardRoom
import me.firecloud.gamecenter.card.model.CardRoomFactory
import akka.actor.ActorSystem

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 9, 2014
 *
 */
class CardEngineTest {
    implicit val system=ActorSystem("unittest")
    val roomFactory = new CardRoomFactory
    
    @Test
    def testJoinRoom(){
        val room = roomFactory.build
        val roomActorRef = TestActorRef(new CardEngine(room),name=room.id)
        
        
    }
}