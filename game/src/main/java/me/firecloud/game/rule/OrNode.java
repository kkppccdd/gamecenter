/**
 * 
 */
package me.firecloud.game.rule;

import java.util.List;

/**
 * @date 2012-10-12
 * 
 */
public class OrNode
    implements Node {

  protected List<Node> nextNodes;

  /*
   * (non-Javadoc)
   * 
   * @see me.firecloud.game.rule.Node#handle(me.firecloud.game.rule.Event)
   */
  public
      Node handle(Event event,GameContext gameContext) throws RuleException {
    for (Node node : nextNodes) {
      try {
        Node nextNode = node.handle(event,gameContext);
        if (node != null) {
          return nextNode;
        }
      } catch (RuleException ex) {

      }
    }

    return null;
  }

}
