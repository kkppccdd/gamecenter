/**
 *
 */
package me.firecloud.card.rule

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Oct 19, 2012
 *
 */
abstract class ActorNode extends SingleNode {

  def handle(gameContext: GameContext, event: Event): Node = {
    if (checkActor(gameContext, event)) {
      return nextNode.handle(gameContext, event)
    } else {
      return null
    }
  }

  protected def checkActor(gameContext: GameContext, event: Event): Boolean
}