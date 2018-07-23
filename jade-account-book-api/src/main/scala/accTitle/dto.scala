package net.jadedungeon.accountbook.dto

import java.util.Date

import jadeutils.mongo._

case class AccountGroup(val id: String, val name: String, 
	val types: List[AccountType]) 
{
	def this(id: String, name: String) = this(id, name, Nil)

	override def toString = "AccountGroup:{id: %s, name: %s, types:[%s]}".format(
		id, name, if(null == types) null else types.toString )
}

case class AccountSpec(val id: String, val name: String) {
	override def toString = "AccountSpec:{id: %s, name: %s}".format(id, name)
}

case class AccountType(val id: String, val code: String, val name: String, 
	val spec: AccountSpec) 
{
	def this(id: String, code: String, name: String) = {
		this(id, code, name, null)
	}

	override def toString = "AccountType: {id: %s, code: %s, name: %s, spec: %s}".format(
		id, code, name, if(null == spec) null else spec.toString)

}

@MongoDocument(databaseName = "accountbook", collectionName = "asset")
case class Asset(assId: String, userIdStr: String, assName: String, 
	descStr: String) 
{
	@MongoField var id = assId
	@MongoField var userId = userIdStr
	@MongoField var name = assName
	@MongoField var desc = descStr

	override def toString = "Asset: {id: %s, code: %s, userId: %s, name: %s, desc: %s}".format(
		id, userId, name, desc)

}

@MongoDocument(databaseName = "accountbook", collectionName = "acctitle")
case class AccountTitle(accId: String, userIdStr: String, typeCodeStr: String, 
	accCode: String, accName: String, assIdStr: String, descStr: String) 
{
	@MongoField var id = accId
	@MongoField var userId = userIdStr
	@MongoField var typeCode = typeCodeStr
	@MongoField var code = accCode
	@MongoField var name = accName
	@MongoField var assetId = assIdStr
	@MongoField var desc = descStr

	override def toString = "AccountTitle: {id: %s, userId: %s, typeCode: %s, code: %s, name: %s, assetId: %s, desc: %s}".format(
		id, userId, typeCode, code, name, assetId, desc)

}

@MongoDocument(databaseName = "accountbook", collectionName = "accrec")
case class AccountRec(recId: String, userIdStr: String, accCodeStr: String, 
	entryIdStr: String, sideNum: Int, oriCcyStr: String, oriAmtNum: Double, 
	amtNum: Double, timeDate: Date)
{
	@MongoField var id = recId
	@MongoField var userId = userIdStr
	@MongoField var accCode = accCodeStr
	@MongoField var entryId = entryIdStr
	@MongoField var side = sideNum
	@MongoField var oriCcy = oriCcyStr
	@MongoField var oriAmt = oriAmtNum
	@MongoField var amt = amtNum
	@MongoField var time = timeDate

	override def toString = "AccountRec: {id: %s, userId: %s, accCode: %s, entryId: %s, side: %d, amt: %d, time: %d}".format(
		id, userId, accCode, entryId, side, amt, time)

}

case class AccountEntry(entryId: String, entryName: String, ivcIdStr: String, 
	timeDate: Date, createTimeDate: Date, recList: java.util.List[AccountRec]) 
{
	@MongoField var id = entryId
	@MongoField var name = entryName
	@MongoField var ivcId = ivcIdStr
	@MongoField var time = timeDate
	@MongoField var createTime = createTimeDate
	@MongoField(ElemType = classOf[AccountRec]) var recs = recList

	override def toString = "AccountEntry: {id: %s, name: %s, ivcId: %s, time: %d, createTime: %d, recs: %s}".format(
		id, name, ivcId, time, createTime, if (null == recs) null else recs.toString)
}
