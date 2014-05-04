/**
 *
 */
package me.firecloud.gamecenter.card.model

import java.util.UUID
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.module.scala.JsonScalaEnumeration

import com.fasterxml.jackson.core.`type`.TypeReference

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 4, 2014
 *
 */
object Suit extends Enumeration {
    type Suit = Value
    val spades, hearts, clubs, diamonds = Value
}

import Suit._

class SuitType extends TypeReference[Suit.type]

case class Card(@JsonProperty id: String, @JsonScalaEnumeration(classOf[SuitType]) suit: Suit, point: Int) {

}

object PokerPack {
    def cards: List[Card] = {
        (for (suit <- Suit.values; point <- (1 to 13)) yield new Card(suit.toString() + "-" + point, suit, point)).toList ::: List(new Card("senior-joker", null, 0), new Card("junior-joker", null, 0))
    }
}