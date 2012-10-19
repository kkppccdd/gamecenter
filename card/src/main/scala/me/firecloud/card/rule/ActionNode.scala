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
abstract class ActionNode extends SingleNode {

  def handle(gameContext: GameContext, event: Event): Node = {
    if (event.isHandled) {
      return null;
    } else {
      if(perform(gameContext, event)){
        return nextNode.handle(gameContext,event)
      }else{
        return null
      }
    }
  }

  protected def perform(gameContext: GameContext, event: Event):Boolean

}