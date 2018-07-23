package net.jadedungeon.accountbook

import scala.collection.JavaConversions._

import jadeutils.common.Logging

import jadeutils.mongo.MongoServer
import jadeutils.mongo.BaseMongoDao
import jadeutils.mongo.Condition.LinkType.AND
import jadeutils.mongo.Condition.Option.GTE
import jadeutils.mongo.Condition.Option.LT
import jadeutils.mongo.Condition.newCondition



class UserAuthDao(serverList: java.util.List[MongoServer]) 
extends BaseMongoDao[UserAuth](serverList) with Logging 
{
	def this(host: String, port: Int, auth: List[Array[String]]) = this(new MongoServer(host, port, auth) :: Nil)

	def findAuth(user: String): List[UserAuth] = {
		val cdt = newCondition("username", user)

		this.findByCondition(cdt).toList.toList
	}
}


