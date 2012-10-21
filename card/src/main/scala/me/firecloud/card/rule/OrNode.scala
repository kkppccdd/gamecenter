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
class OrNode(val nodes: List[Node]) extends Node {

  override def handle(gameContext: GameContext, event: Event): Node = {
    for (node <- nodes) yield {
      var result = node.handle(gameContext, event)
      if (result != null) {
        return result
      }
    }

    return null

  }

}