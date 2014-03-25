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
import me.firecloud.gamecenter.model.JoinRoom
import me.firecloud.gamecenter.model.StartGame
import me.firecloud.gamecenter.model.EndGame
import me.firecloud.gamecenter.card.model.Pass
import me.firecloud.gamecenter.card.model.DealCard
import me.firecloud.gamecenter.model.Notification
import me.firecloud.gamecenter.model.Ask
import me.firecloud.gamecenter.card.model.AppendCard
import me.firecloud.utils.logging.Logging

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 4, 2014
 *
 */
class CardMessageCodec extends MessageCodec with Logging {

    override def supportedMessageCodes = Set(DealCard.key, JoinRoom.key, StartGame.key, EndGame.key, Notification.key, Ask.key, PutCard.key, Pass.key, AppendCard.key)

    override def encode(message: Message): String = {
        mapper.writeValueAsString(message)
    }

    override def decode(json: String): Message = {
        try {
            val key = (mapper.readTree(json).findValue("cla").asLong(), mapper.readTree(json).findValue("ins").asLong())
            key match {
                case (1L, 1L) => mapper.readValue(json, typeReference[JoinRoom])
                case (1L, 2L) => mapper.readValue(json, typeReference[StartGame])
                case (1L, 3L) => mapper.readValue(json, typeReference[EndGame])
                case (1L, 4L) => mapper.readValue(json, typeReference[Notification])
                case (1L, 5L) => mapper.readValue(json, typeReference[Ask])
                case (2L, 1L) => mapper.readValue(json, typeReference[PutCard])
                case (2L, 2L) => mapper.readValue(json, typeReference[Pass])
                case (2L, 3L) => mapper.readValue(json, typeReference[DealCard])
                case (2L, 4L) => mapper.readValue(json, typeReference[AppendCard])
                case _ =>
                    warn("unsupported message type")
                    null
            }
        } catch {
            case t => null
        }
    }

}