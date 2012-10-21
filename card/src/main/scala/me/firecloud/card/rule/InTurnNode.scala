/**
 *
 */
package me.firecloud.card.rule

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Oct 21, 2012
 *
 */
class InTurnNode(nextNode: Node, circleName: String) extends ActorNode(nextNode: Node) {

    override def checkActor(gameContext: GameContext, event: Event): Boolean = {
        if (event.actor.equals(gameContext.getCircle(circleName).next)) {
            return true
        } else {
            return false
        }
    }

    override def handle(gameContext: GameContext, event: Event): Node = {
        val node: Node = super.handle(gameContext, event)
        // turn the current to next player
        gameContext.getCircle(circleName).turn

        return node

    }

}