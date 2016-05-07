package net.jadedungeon.accountbook

import jadeutils.common.Logging

import net.jadedungeon.accountbook.dto._

trait AccTypeCfg extends Logging {

	val accountGroups: List[AccountGroup]

	def loadAccTypeFromXML(str: String) = {
		def parseType(nodes: scala.xml.NodeSeq) = {
			(List[AccountType]() /: nodes) {
				(types, node) => 
				AccountType((node \ "@id").toString, (node \ "@code").toString, 
					(node \ "@name").toString, null) :: types
			}
		}.reverse

		val grpData = scala.xml.XML.loadString(str) \ "groups" \ "group"

		(List[AccountGroup]() /: grpData) {
			(grps, node) => 
			new AccountGroup((node \ "@id").toString, 
				(node \ "@name").toString, parseType(node \ "acctype")) :: grps
		}.reverse
	}

}


trait AccountTypeService extends Logging {
	this: AccTypeCfg  =>

}


