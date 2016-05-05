package net.jadedungeon.accountbook

import jadeutils.common.Logging

import net.jadedungeon.accountbook.dto._

trait AccTypeCfg {

	val accountTypes: AccountGroup

}


trait AccountTypeService extends Logging {
	this: AccTypeCfg  =>

}













