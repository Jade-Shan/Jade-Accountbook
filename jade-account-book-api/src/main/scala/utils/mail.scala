package net.jadedungeon.accountbook

import jadeutils.common.Logging
import jadeutils.common.EnvPropsComponent

// import java.util.Properties
// 
// import org.slf4j.LoggerFactory
// import org.slf4j.Logger
//
// trait MailComponent {
// 	this: ContextComponent =>
// 
// 	trait MailSender {
// 		import org.apache.commons.mail.Email
// 		import org.apache.commons.mail.EmailException
// 		import org.apache.commons.mail.SimpleEmail
// 
// 		val logger = MailSender.logger
// 
// 		val protocolString: String
// 		val host: String
// 		val port: String
// 		val username: String
// 		val nickname: String
// 		val password: String
// 		val auth: String
// 
// 		def sendTextMail(toList: List[String], subject: String, msg: String) {
// 			logger.debug(
// 				"\n\tSending mail: {}://{}:{}\n\t" + 
// 				"username: {}, password: {}, auth: {}\n\t" +
// 				"to: {}\n\t" + "subject: {}" + "\n\tcontent: {}", 
// 				protocolString.asInstanceOf[AnyRef], host.asInstanceOf[AnyRef], 
// 				port.asInstanceOf[AnyRef], username.asInstanceOf[AnyRef], 
// 				password.asInstanceOf[AnyRef], auth.asInstanceOf[AnyRef], 
// 				toList.asInstanceOf[AnyRef], subject.asInstanceOf[AnyRef], 
// 				msg.asInstanceOf[AnyRef])
// 			try {
// 				val email: Email = new SimpleEmail()
// 				email.setSSLOnConnect("ssl" == auth)
// 				email.setHostName(host)
// 				email.setSmtpPort(Integer.parseInt(port))
// 				email.setAuthentication(username, password)
// 				email.setFrom(username, nickname)
// 				toList.foreach((to: String) => email.addTo(to))
// 				// email.addTo(to)
// 				email.setSubject(subject)
// 				email.setMsg(msg)
// 				email.send()
// 				logger.debug("mail send success! ")
// 			} catch {
// 				case e: EmailException => e.printStackTrace
// 				case e: Exception => e.printStackTrace
// 			}
// 		}
// 	}
// 
// 	object MailSender {
// 		lazy val logger = LoggerFactory.getLogger(this.getClass)
// 		def getLoggerByName(name: String) = LoggerFactory.getLogger(name)
// 	}
// }
//
// 
// trait ContextComponent extends MailComponent {
// 	val envProp: Properties
// 
// 	def getProperty(key: String) = envProp.getProperty(key)
// 
// 	object UserMailSender extends MailSender {
// 	}
// }

