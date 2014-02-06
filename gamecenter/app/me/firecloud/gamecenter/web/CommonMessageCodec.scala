/**
 *
 */
package me.firecloud.gamecenter.web

import scala.collection.immutable.Set
import me.firecloud.gamecenter.model.Message
import me.firecloud.gamecenter.model.ErrorNotice

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 5, 2014
 *
 */
class CommonMessageCodec extends MessageCodec {
	override def supportedMessageCodes=Set(ErrorNotice.code)
	
	override def encode(message:Message):String={
	    mapper.writeValueAsString(message)
	}
	
	override def decode(json:String):Message={
	    try {
            mapper.readTree(json).findValue("code").asText() match {
                case ErrorNotice.code => mapper.readValue(json, typeReference[ErrorNotice])
                case _ => null
            }
        } catch {
            case t => null
        }
	}
}