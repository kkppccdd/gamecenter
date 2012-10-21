/**
 *
 */
package me.firecloud.card.rule
import scala.collection.immutable.List
import java.util.Map
import java.util.HashMap

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Oct 19, 2012
 *
 */
class GameContext {
  val players: List[Player]
  val dealer: Dealer

  val circles: Map[String, ActorCircle] = new HashMap[String, ActorCircle]

  def getCircle(name: String): ActorCircle = {
    return circles.get(name)
  }
}