/**
 * 
 */
package me.firecloud.game.rule;

/**
 * @date 2012-10-12
 * 
 */
public abstract class ActionNode
    extends SingleNode
    implements Node {

  /*
   * (non-Javadoc)
   * 
   * @see me.firecloud.game.rule.Node#handle(me.firecloud.game.rule.Event)
   */
  public
      Node handle(Event event,GameContext gameContext) throws RuleException {
    if (event.isHandled()) {
      return this;
    } else {
      if (perform(event,gameContext)) {
        //
        return nextNode.handle(event,gameContext);
      } else {
        return null;
      }
    }
  }

  /**
   * 
   * @param event
   * @return
   * @throws RuleException
   */
  protected abstract
      boolean perform(Event event,GameContext gameContext) throws RuleException;

}
