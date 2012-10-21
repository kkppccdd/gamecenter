/**
 *
 */
package me.firecloud.card.rule
import java.util.List
import java.util.LinkedList

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Oct 21, 2012
 *
 */
class ActorCircle {
  val actors: List[Player] = new LinkedList[Player]
  var currentPos: Int
  def next: Player = {
    //currentPos = (currentPos + 1) % actors.size()
    return actors.get(currentPos + 1)
  }

  def current: Player = {
    return actors.get(currentPos)
  }

  def turn: Int = {
    currentPos = (currentPos + 1) % actors.size()
    return currentPos
  }
}