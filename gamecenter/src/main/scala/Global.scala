/**
 *
 */
import play.api._
import play.api.mvc._
import play.api.Play.current
import play.api.http.HeaderNames._
import me.firecloud.gamecenter.model.RoomFactoryManager
import me.firecloud.gamecenter.card.model.CardRoomFactory
import play.libs.Akka
import me.firecloud.gamecenter.model.PlayerSupervisor
import akka.actor.Props
import play.api.libs.concurrent.Execution.Implicits._

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

        // initialize supervisor actors

        // players supervisor
        val playerSupervisor = Akka.system().actorOf(Props(new PlayerSupervisor()), name = "players")
        Logger.info("started supervisor :" + playerSupervisor.toString)
    }
    /*
    override def doFilter(action: EssentialAction): EssentialAction = EssentialAction { request =>
    action.apply(request).map(_.withHeaders(
      "Access-Control-Allow-Origin"->"*"
    ))
  }
  * */
  
}