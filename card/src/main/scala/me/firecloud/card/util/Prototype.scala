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
abstract class Prototype extends Dynamic {
  var attributes = Map[String, Any]()

  def selectDynamic(attributeName: String): Unit = {
    //attributes.get(attributeName)
    println("select "+attributeName)
  }

  def updateDynamic(attributeName: String)(value: Int): Unit = {
    //attributes.put(attributeName, value)
    println("update "+attributeName+" with "+value)
  }
  
  
  
  def applyDynamic(methodName:String)(args:Any*)={	
    println("apply "+methodName+" with "+args)
    this
  }
  
  def applyDynamicNamed(name: String)(args: (String, Any)*) {
    println("applyDynamicNamed: " + name)
  }
}