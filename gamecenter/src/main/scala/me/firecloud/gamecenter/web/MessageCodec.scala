/**
 *
 */
package me.firecloud.gamecenter.web

import me.firecloud.gamecenter.model.Message
import com.fasterxml.jackson.core.`type`.TypeReference
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type

import scala.util.parsing.json.JSON
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.fasterxml.jackson.databind.DeserializationFeature

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 4, 2014
 *
 */
abstract class MessageCodec {
    val mapper = new ObjectMapper()
    mapper.registerModule(DefaultScalaModule)
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

    def encode(message: Message): String
    def decode(json: String): Message
    def supportedMessageCodes: Set[Tuple2[Long,Long]]

    protected[this] def typeReference[T: Manifest] = new TypeReference[T] {
        override def getType = typeFromManifest(manifest[T])

    }

    protected[this] def typeFromManifest(m: Manifest[_]): Type = {
        if (m.typeArguments.isEmpty) { m.runtimeClass }
        else new ParameterizedType {
            def getRawType = m.runtimeClass
            def getActualTypeArguments = m.typeArguments.map(typeFromManifest).toArray
            def getOwnerType = null
        }
    }
}