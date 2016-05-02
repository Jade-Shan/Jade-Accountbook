package net.jadedungeon.accountbook.dto

import java.util.Date

import jadeutils.mongo._

case class AccountGroup(val id: String, val name: String, 
	val types: List[AccountType]) 
{
	def this(id: String, name: String) = this(id, name, Nil)
}

case class AccountSpec(val id: String, val name: String)

case class AccountType(val id: String, val code: String, val name: String, 
	val spec: AccountSpec) 
{
	def this(id: String, code: String, name: String) = {
		this(id, code, name, null)
	}

}

@MongoDocument(databaseName = "accountbook", collectionName = "asset")
case class Asset(assId: String, userIdStr: String, assName: String, 
	descStr: String) 
{
	@MongoField var id = assId
	@MongoField var userId = userIdStr
	@MongoField var name = assName
	@MongoField var desc = descStr

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

}

@MongoDocument(databaseName = "accountbook", collectionName = "accrec")
case class AccountRec(recId: String, userIdStr: String, accCodeStr: String, 
	entryIdStr: String, sideNum: Int, amtNum: Double, timeDate: Date)
{
	@MongoField var id = recId
	@MongoField var userId = userIdStr
	@MongoField var accCode = accCodeStr
	@MongoField var entryId = entryIdStr
	@MongoField var side = sideNum
	@MongoField var amt = amtNum
	@MongoField var time = timeDate
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
}
