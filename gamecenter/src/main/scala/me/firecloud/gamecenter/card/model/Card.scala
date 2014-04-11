/**
 *
 */
package me.firecloud.gamecenter.card.model

import java.util.UUID


import com.fasterxml.jackson.annotation.JsonProperty

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 4, 2014
 *
 */
object Suit extends Enumeration{
    type Suit = Value
    val spades,hearts,clubs,diamonds=Value
}

object Point extends Enumeration{
    type Point=Value
    val ace,two,three,four,five,six,seven,eight,nine,ten,jack,queen,king=Value
}
import Suit._
import Point._

class Card(suit:Suit,point:Point) {
	val id:String =suit+"-"+point
	
}

object PokerPack{
    def cards:List[Card]={
        (Suit.values zip Point.values).map({case (suit,point)=> new Card(suit,point)}).toList
    }
}