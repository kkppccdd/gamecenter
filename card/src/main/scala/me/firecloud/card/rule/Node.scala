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
trait Node {
  def handle(gameContext: GameContext, event: Event):Node
}