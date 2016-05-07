package net.jadedungeon.accountbook

import jadeutils.common.Logging

import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner

import org.junit.runner.RunWith

import java.util.Properties

import net.jadedungeon.accountbook._


@RunWith(classOf[JUnitRunner])
class AccountTypeTest extends FunSuite with Logging {

	object TestAppCtx extends AccountTypeComponent {
		val accountGroups = loadAccTypeFromXML(
			TextFileLoader.loadInCurrentClassPath("test-accType.xml", "UTF-8"))
	}


	test("load-acc-xml") {
		assert(TestAppCtx.accountGroups.size == 6)
		assert(TestAppCtx.accountGroups(0).name == "资产类")
		assert(TestAppCtx.accountGroups(1).name == "负债类")
		assert(TestAppCtx.accountGroups(0).types.size == 73)
		assert(TestAppCtx.accountGroups(0).types(0).name == "库存现金")
		assert(TestAppCtx.accountGroups(0).types(1).name == "银行存款")
	}

}

