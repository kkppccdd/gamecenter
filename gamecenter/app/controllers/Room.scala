/**
 *
 */
package controllers

import play.api._
import play.api.mvc._
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.core.`type`.TypeReference
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type
import me.firecloud.gamecenter.model.RoomDescription

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 8, 2014
 *
 */
object Hall extends Controller {
	val mapper = new ObjectMapper()
    mapper.registerModule(DefaultScalaModule)
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
    
    
    def post =Action{request=>{
        // create room model
        val payload = request.body.asText
        
        val roomConfig = mapper.readValue(payload.get, typeReference[RoomDescription])
        
        
        // create room actor
        
        // return room
        Ok("xx")
    }
    }
	
	
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