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
import me.firecloud.gamecenter.model.RoomFactoryManager
import play.libs.Akka
import me.firecloud.utils.logging.Logging

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 8, 2014
 *
 */
object Hall extends Controller with Logging{
	val mapper = new ObjectMapper()
    mapper.registerModule(DefaultScalaModule)
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
    
    
    def post =Action{request=>{
        // create room model
        val payload = request.body.asJson
        
        val roomConfig = mapper.readValue(payload.get.toString, typeReference[RoomDescription]).asInstanceOf[RoomDescription]
        
        
        // create room actor
        debug("lookup factory for "+roomConfig.kind)
        val factory =RoomFactoryManager.getFactory(roomConfig.kind).get
        val (roomDescription,props) = factory.build(roomConfig)
        
        Akka.system().actorOf(props, roomDescription.id)
        // return room
        Ok(mapper.writeValueAsString(roomDescription))
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