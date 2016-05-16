import SimpleHTTPServer  
import SocketServer  
import re  
import cgi
  
def htc(m):  
    return chr(int(m.group(1),16))  
  
def urldecode(url):  
    rex=re.compile('%([0-9a-hA-H][0-9a-hA-H])',re.M)  
    return rex.sub(htc,url)  
  
class SETHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):  
              
    def do_GET(self):  
        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):  
        form = cgi.FieldStorage()
        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

Handler = SETHandler  
PORT = 8181
httpd = SocketServer.TCPServer(("", PORT), Handler)  
print "serving at port", PORT  
httpd.serve_forever()  
