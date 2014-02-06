/**
 *
 */
package me.firecloud.gamecenter.card.web

import me.firecloud.gamecenter.web.MessageCodec
import me.firecloud.gamecenter.model.Message
import scala.util.parsing.json.JSON
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import me.firecloud.gamecenter.card.model.PutCardAction
import com.fasterxml.jackson.core.`type`.TypeReference
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type
import me.firecloud.gamecenter.card.model.PassAction
import com.fasterxml.jackson.databind.DeserializationFeature

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 4, 2014
 *
 */
class CardMessageCodec extends MessageCodec {

    override def supportedMessageCodes = Set(PutCardAction.code, PassAction.code)

    override def encode(message: Message): String = {
        mapper.writeValueAsString(message)
    }

    override def decode(json: String): Message = {
        try {
            mapper.readTree(json).findValue("code").asText() match {
                case PutCardAction.code => mapper.readValue(json, typeReference[PutCardAction])
                case PassAction.code => mapper.readValue(json, typeReference[PassAction])
                case _ => null
            }
        } catch {
            case t => null
        }
    }

}