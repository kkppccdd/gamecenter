/**
 *
 */
package me.firecloud.gamecenter.card.model

import me.firecloud.gamecenter.model.Action


/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 4, 2014
 * requests
 */

/******************
 * constants
 */
object PutCardAction{
    val code="CARD_ACTION_PUT_CARD"
}

object PassAction{
    val code="CARD_ACTION_PASS"
}

case class PutCardAction(userId:String,cards:List[Card]) extends Action(code=PutCardAction.code,userId)

case class PassAction(userId:String) extends Action(code=PassAction.code,userId)