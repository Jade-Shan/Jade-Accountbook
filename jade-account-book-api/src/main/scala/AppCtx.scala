package net.jadedungeon.accountbook

import jadeutils.common.EnvPropsComponent
import jadeutils.common.Logging

trait AuthComponent extends Logging {
	this: EnvPropsComponent =>

	object RecDaos {
		val mongoHost: String = getProperty("mongo.host")
		val mongoPort: Int    = Integer.parseInt(getProperty("mongo.port"))
		val mongoAuth = getProperty("mongo.authList.jadedungeon").split("`") :: Nil

		logDebug("----------- Creating userAuthDao: {}, {}, {}", mongoHost, mongoPort, mongoAuth)
		val userAuthDao = new UserAuthDao(mongoHost, mongoPort, mongoAuth)

	}

}

trait MailComponent extends Logging {
	this: EnvPropsComponent =>

	object MailCfg {
 		val protocolString = getProperty("email.user.protocol")
 		val host = getProperty("email.user.host")
 		val port = getProperty("email.user.port")
 		val username = getProperty("email.user.username")
 		val nickname = getProperty("email.ad.nickname")
 		val password = getProperty("email.user.password")
 		val auth = getProperty("email.user.auth")
	}

}


trait AccountBookAppCtx extends EnvPropsComponent with MailComponent 
with AuthComponent with Logging 
{

	val cfgFile = "accountbook.properties"
	logDebug("----------- Loading props: {}", cfgFile)

	val envProps = new java.util.Properties()
	envProps.load(Thread.currentThread().getContextClassLoader()
		.getResourceAsStream(cfgFile))

	val cdn3rd = getProperty("cdn.3rd")
	val cdnjadeutils = getProperty("cdn.jadeutils")
	val cdnaccountbook = getProperty("cdn.accountbook")
	val appbasepath = getProperty("app.basepath")

}

