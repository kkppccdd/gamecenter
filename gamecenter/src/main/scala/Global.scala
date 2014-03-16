/**
 *
 */
import play.api._
import me.firecloud.gamecenter.model.RoomFactoryManager
import me.firecloud.gamecenter.card.model.CardRoomFactory

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Mar 16, 2014
 *
 */
object Global extends GlobalSettings {
	override def onStart(app: Application) {
    Logger.info("Application has started")
    RoomFactoryManager.registerFactory(new CardRoomFactory)
  }
}