/**
 *
 */
package me.firecloud.card.util
import scala.collection.mutable.Map

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Oct 19, 2012
 *
 */
trait Prototype extends Dynamic {
  val attributes = Map[String, Any]()

  def selectDynamic(attributeName: String): Unit = {
    attributes.get(attributeName)
  }

  def updateDynamic(attributeName: String)(value: Any): Unit = {
    attributes.put(attributeName, value)
  }
}