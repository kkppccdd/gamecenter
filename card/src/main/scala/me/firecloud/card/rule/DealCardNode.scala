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
class DealCardNode(nextNode: Node) extends ActionNode(nextNode: Node) {

  override def perform(gameContext: GameContext, event: Event): Boolean = {

    while (gameContext.dealer.hand.size() > 5) {
      // deal all cards to each player until remaining 5 cards
      for (player <- gameContext.players) yield {
        player.hand.add(gameContext.dealer.hand.remove(gameContext.dealer.hand.size() - 1))
      }
    }
    true
  }

}