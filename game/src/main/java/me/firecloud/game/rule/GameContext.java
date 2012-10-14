/**
 * 
 */
package me.firecloud.game.rule;

import java.util.List;

/**
 * @date 2012-10-12
 * 
 */
public interface GameContext {
	public Object get(String epxression);

	public List<Object> getList(String expression);

	public GameContext set(String expression, Object value);
}
