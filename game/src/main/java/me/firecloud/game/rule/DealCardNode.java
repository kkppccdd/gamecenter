/**
 * 
 */
package me.firecloud.game.rule;

import java.util.List;
import java.util.Map;

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Oct 14, 2012
 * 
 */
public class DealCardNode extends ActionNode {

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * me.firecloud.game.rule.ActionNode#perform(me.firecloud.game.rule.Event,
	 * me.firecloud.game.rule.GameContext)
	 */
	@Override
	protected boolean perform(Event event, GameContext gameContext)
			throws RuleException {
		List<Map<String, Object>> holdCards = (List<Map<String, Object>>) gameContext
				.get("desktop.holdCards");
		while (holdCards.size() > 5) {
			// deal each one a card

		}
	}

}
