/**
 * 
 */
package me.firecloud.game.rule;

/**
 * @date 2012-10-12
 * 
 */
public interface Node {

  public
      Node handle(Event event) throws RuleException;

}
