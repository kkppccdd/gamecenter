/**
 *
 */
package me.firecloud.gamecenter.card.web

import me.firecloud.gamecenter.web.MessageCodec
import me.firecloud.gamecenter.model.Message
import scala.util.parsing.json.JSON
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.fasterxml.jackson.core.`type`.TypeReference
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type
import com.fasterxml.jackson.databind.DeserializationFeature
import me.firecloud.gamecenter.card.model.PutCard

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 4, 2014
 *
 */
class CardMessageCodec extends MessageCodec {

    override def supportedMessageCodes = Set((1,1))

    override def encode(message: Message): String = {
        mapper.writeValueAsString(message)
    }

    override def decode(json: String): Message = {
        try {
            val key =(mapper.readTree(json).findValue("CLA").asLong(),mapper.readTree(json).findValue("INS").asLong())
            key match {
                case (1,1) => mapper.readValue(json, typeReference[PutCard])
                case _ => null
            }
        } catch {
            case t => null
        }
    }

}