/**
 * 
 */
package me.firecloud.game.rule;

/**
 * @date 2012-10-12
 * 
 */
public abstract class ActorNode
    extends SingleNode
    implements Node {

  /*
   * (non-Javadoc)
   * 
   * @see me.firecloud.game.rule.Node#handle(me.firecloud.game.rule.Event)
   */
  public
      Node handle(Event event) throws RuleException {
    if (checkActor(event)) {
      // invoke next node
      return nextNode.handle(event);
    } else {
      return null;
    }
  }

  protected abstract
      boolean checkActor(Event event);

}
