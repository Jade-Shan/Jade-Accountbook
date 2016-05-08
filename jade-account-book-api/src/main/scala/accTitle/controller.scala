package net.jadedungeon.accountbook


import org.json4s._
import org.json4s.JsonDSL._
import org.json4s.jackson.JsonMethods._

import scala.collection.JavaConversions._

import jadeutils.common.Logging

import jadeutils.web.BasicController
import jadeutils.web.DispatherInfo
import jadeutils.web.DispatherServlet.Foward
import jadeutils.web.DispatherServlet.Redirect
import jadeutils.web.Method

import net.jadedungeon.accountbook.dto._


trait AuthController extends BasicController {

	/**
		* (isAuth, isSuccess)
		*/
	def auth(info: DispatherInfo): (Boolean, Boolean, String)

	override def service(method: Method.Method, pattern: String)(logic: (DispatherInfo) => Any) 
	{
		def newLogic(info: DispatherInfo): Any = auth(info) match {
			case (true, true, _) => logic(info)
			case _ => ("status" -> "success") ~ ("auth" -> "fail"): JValue
		}
		super.service(Method.ANY, pattern)(newLogic)
	}

	override def service(pattern: String)(logic: (DispatherInfo) => Any) 
	{
		this.service(Method.ANY, pattern)(logic)
	}

}

trait XssController extends BasicController {

	override def service(method: Method.Method, pattern: String)(logic: (DispatherInfo) => Any) 
	{
		def newLogic(info: DispatherInfo): Any = {
			info.response.setHeader("Access-Control-Allow-Origin", "*")
			info.response.setHeader("Access-Control-Allow-Headers", "authorization")
			if(Method.OPTIONS == info.method) {
				("status" -> "success"): JValue
			} else {
				logic(info)
			}
		}
		super.service(Method.ANY, pattern)(newLogic)
	}

	override def service(pattern: String)(logic: (DispatherInfo) => Any) 
	{
		this.service(Method.ANY, pattern)(logic)
	}

}

trait BaseAccountController extends XssController with AuthController with AccountBookAppCtx {

	/**
		* (isAuth, isSuccess)
		*/
	def auth(info: DispatherInfo): (Boolean, Boolean, String) = {
		val auth = decodeHttpBasicAuth(info.request.getHeader("Authorization"))
		logDebug("after auth check: {}", auth)
		val username = auth._2
		val password = auth._3
		if (auth._1 && null != username && username.trim.length > 0) try {
			val rec = RecDaos.userAuthDao.findAuth(username)
			logDebug("match user: {}", rec)
			if (rec.size > 0 && password == rec(0).password) {
				(true, true, username)
			} else (true, false, username)
		} catch {
			case e: Exception => {
				logError(e.toString)
				(true, false, username)
			}
		} else (false, false, username)
	}
}

object AccountController extends BaseAccountController with Logging {

	service("/api/accountbook/testAuth") {(info) => auth(info) match {
		case (true, true, _) => ("status" -> "success") ~ ("auth" -> "success"): JValue
		case _ => ("status" -> "success") ~ ("auth" -> "fail"): JValue
	}}

	service("/api/accountbook/allAccountType") {(info) => try {
		("status" -> "success") ~ 
		("types" -> this.parseAccGroups2Json(accountGroups)): JValue
	} catch {
		case e: Exception => {
			e.printStackTrace()
			logError(e.toString)
			("status" -> "error") ~ ("err" -> e.toString): JValue
		}
	}}

	private[this] def parseAccTypes2Json(acc: List[AccountType], pId: String) = 
	(for (i <- 0 until acc.size) yield acc(i)).map(
		r => ("id" -> r.id) ~ ("code" -> r.code) ~ ("type" -> "accType") ~ 
		("name" -> r.name): JValue)

	private[this] def parseAccGroups2Json(acc: List[AccountGroup]) = 
	(for (i <- 0 until acc.size) yield acc(i)).map(
		r => ("id" -> r.id) ~ ("name" -> r.name) ~ ("type" -> "accGrp") ~
		("open" -> true) ~ ("children" -> this.parseAccTypes2Json(r.types, r.id)): JValue)

}

