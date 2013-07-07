/**
 *
 */
package me.firecloud.card.fightlandlord

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jul 7, 2013
 *
 */
import org.junit._
import Assert._
import akka.testkit.TestFSMRef
import akka.testkit.TestActorRef
import akka.actor.FSM
import scala.concurrent.duration._
import akka.actor.Actor
import akka.actor.ActorSystem

class EngineTest {

    @Test
    def testOK() {
        implicit val system = ActorSystem()
        val fsm = TestFSMRef(new Engine)
        assertEquals(Initialized, fsm.stateName)
        fsm ! new Start
        assertEquals(CompeteForLord, fsm.stateName)
        fsm ! new Yield(new Player("1", "1"), 1)
        
    }
}