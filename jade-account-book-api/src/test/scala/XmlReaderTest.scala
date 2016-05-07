package net.jadedungeon.accountbook

import jadeutils.common.Logging

import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner

import org.junit.runner.RunWith

import java.util.Properties

import net.jadedungeon.accountbook._


@RunWith(classOf[JUnitRunner])
class MailTest extends FunSuite with Logging {

	object TestAppCtx extends AccountTypeComponent {
		val accountGroups = loadAccTypeFromXML(
			TextFileLoader.loadInCurrentClassPath("accType.xml", "UTF-8"))
	}


	test("load-acc-xml") {
		logDebug("{}", TestAppCtx.accountGroups.toString)
	}

}

