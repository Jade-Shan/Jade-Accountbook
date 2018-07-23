// package example
// 
// import org.slf4j.LoggerFactory
// import org.slf4j.Logger
// 
// import org.scalatest.BeforeAndAfter
// import org.scalatest.FunSuite
// import org.scalatest.junit.JUnitRunner
// 
// import org.junit.runner.RunWith
// 
// import java.util.Properties
// 
// import net.jadedungeon.accountbook._
// 
// 
// @RunWith(classOf[JUnitRunner])
// class MailTest extends FunSuite with BeforeAndAfter {
// 
// 	import com.icegreen.greenmail.util.GreenMail;
// 	import com.icegreen.greenmail.util.GreenMailUtil;
// 	import com.icegreen.greenmail.util.ServerSetup;
// 
// 	var greenMail: GreenMail = null
// 
// 	before {
// 		val protocal = if ("ssl" == MailTest.TestAppCtx.UserMailSender.auth) 
// 			com.icegreen.greenmail.util.ServerSetupTest.SMTPS
// 			else com.icegreen.greenmail.util.ServerSetupTest.SMTP
// 		MailTest.logger.debug("try start greenmail server on port: {}", protocal.getPort())
// 		greenMail = new GreenMail(protocal);
// 		greenMail.setUser(MailTest.TestAppCtx.UserMailSender.username, 
// 			MailTest.TestAppCtx.UserMailSender.password);
// 		greenMail.start();
// 		MailTest.logger.debug("greenmail start success")
// 	}
// 
// 	after {
// 		MailTest.logger.debug("try stop greenmail server")
// 		greenMail.stop();
// 		MailTest.logger.debug("greenmail stop success")
// 	}
// 
// 	test("Send-mail-userinfo") {
// 		val toList = "user1@gmail.com" :: "user2@gmail.com" :: Nil
// 		MailTest.TestAppCtx.UserMailSender.sendTextMail(toList, "Active your account",
// 			"<h1>please active your account</h1>")
// 	}
// 
// }
// 
// object MailTest { 
// 	lazy val logger = LoggerFactory.getLogger(this.getClass)
// 
// 	def getLoggerByName(name: String) = LoggerFactory.getLogger(name)
// 
// 	object TestAppCtx extends ContextComponent {
// 		val envProp: Properties = new Properties()
// 		envProp.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("mail.properties"))
// 	}
// }
