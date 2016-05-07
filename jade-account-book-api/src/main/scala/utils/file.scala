package net.jadedungeon.accountbook

object TextFileLoader {

	def loadInCurrentClassPath(fileName: String, encode: String) = {
		val reader =  new java.io.BufferedReader(new java.io.InputStreamReader(
			Thread.currentThread().getContextClassLoader(
			).getResourceAsStream(fileName), encode))

		val sb = new StringBuffer()
		var str = reader.readLine()
		while(null != str) { sb.append(str); str = reader.readLine(); }
		sb.toString
	}

}




