package net.jadedungeon.accountbook

import jadeutils.mongo._

@MongoDocument(databaseName="jadedungeon", collectionName="userauth")
case class UserAuth(
	usr: String, pwd: String, ts: Long, upt: Long) extends MongoModel
{
	def this() = this(null, null, System.currentTimeMillis, 0)

	@MongoField var username = usr
	@MongoField var password = pwd
	@MongoField var createTime = ts
	@MongoField var lastUpdateTime = ts

	override def toString = ("""userAuth: {""" + 
		"""user: "%s", password: "%s", createTime: %d, lastUpdateTime: %d}""").format (
		username, password, createTime, lastUpdateTime)

}


