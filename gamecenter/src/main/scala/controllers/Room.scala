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
import com.fasterxml.jackson.module.scala.experimental.ScalaObjectMapper
import com.fasterxml.jackson.module.scala.OptionModule
import com.fasterxml.jackson.module.scala.TupleModule
import com.fasterxml.jackson.databind.MapperFeature

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 8, 2014
 *
 */
object Hall extends Controller with Logging{
	val mapper = new ObjectMapper() with ScalaObjectMapper
    
    val module = new OptionModule with TupleModule {}
    
    mapper.registerModule(DefaultScalaModule)
    mapper.registerModule(module)
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
    mapper.configure(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY, true)
    
    
    def post =Action{request=>{
        // create room model
        val payload = request.body.asJson
        
        val roomConfig = mapper.readValue[RoomDescription](payload.get.toString)
        
        
        // create room actor
        debug("lookup factory for "+roomConfig.kind)
        val factory =RoomFactoryManager.getFactory(roomConfig.kind).get
        val (roomDescription,props) = factory.build(roomConfig)
        
        Akka.system().actorOf(props, roomDescription.id)
        // return room
        Ok(mapper.writeValueAsString(roomDescription))
    }
    }
	
	def enterRoom(roomId:String)=Action{
	    request=>{
	        val selfId = request.getQueryString("userId").get
	        Ok(views.html.room(roomId, selfId))//.withHeaders("Access-Control-Allow-Origin"->"*")
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