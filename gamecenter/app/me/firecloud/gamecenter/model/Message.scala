/**
 *
 */
package me.firecloud.gamecenter.model

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 4, 2014
 *
 */
abstract class Message(val code:String){
    val id=java.util.UUID.randomUUID().toString()
}

abstract class Action(code:String,userId:String) extends Message(code)

abstract class Notice(code:String) extends Message(code)


object ErrorNotice{
    val code="NOTICE_ERROR"
}
class ErrorNotice(errorMessage:String) extends Notice(ErrorNotice.code)