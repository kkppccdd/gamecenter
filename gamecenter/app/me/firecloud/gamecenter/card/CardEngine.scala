/**
 *
 */
package me.firecloud.gamecenter.card

import akka.actor.{ Actor, ActorRef, FSM }
import scala.concurrent.duration._
import me.firecloud.gamecenter.model.StartGame
import me.firecloud.gamecenter.card.model.CardRoom
import me.firecloud.gamecenter.model.Player
import me.firecloud.gamecenter.card.model.DealCard
import me.firecloud.gamecenter.model.Dealer
import me.firecloud.gamecenter.model.JoinRoom
import me.firecloud.gamecenter.card.model.Card

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 9, 2014
 *
 */

