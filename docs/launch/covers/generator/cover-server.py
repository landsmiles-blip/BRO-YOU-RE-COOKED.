"""Scratch server for building covers from the game's OWN renderer. Not part of the repo.

GET  /            -> cover.html (this folder)
GET  /js/...      -> repo js/ (read-only), /vendor/..., /css/...
POST /save?name=X -> writes the request body to ./out/X (png only, no path tricks)
Binds to 127.0.0.1 only.
"""
import http.server, os, re, sys, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = sys.argv[1]
OUT = os.path.join(HERE, 'out')
os.makedirs(OUT, exist_ok=True)
MIME = {'.js': 'application/javascript', '.mjs': 'application/javascript', '.html': 'text/html',
        '.css': 'text/css', '.json': 'application/json', '.png': 'image/png'}

class H(http.server.BaseHTTPRequestHandler):
    def _send(self, code, body=b'', ctype='text/plain'):
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        p = urllib.parse.urlparse(self.path).path
        if p in ('/', '/cover.html'):
            f = os.path.join(HERE, 'cover.html')
        elif p.startswith(('/js/', '/vendor/', '/css/')):
            f = os.path.normpath(os.path.join(REPO, p.lstrip('/')))
            if not f.startswith(os.path.normpath(REPO)):
                return self._send(403)
        else:
            return self._send(404)
        if not os.path.isfile(f):
            return self._send(404)
        ext = os.path.splitext(f)[1].lower()
        self._send(200, open(f, 'rb').read(), MIME.get(ext, 'application/octet-stream'))

    def do_POST(self):
        u = urllib.parse.urlparse(self.path)
        if u.path != '/save':
            return self._send(404)
        name = urllib.parse.parse_qs(u.query).get('name', [''])[0]
        if not re.fullmatch(r'[A-Za-z0-9_\-]+\.png', name):
            return self._send(400, b'bad name')
        n = int(self.headers.get('Content-Length', 0))
        data = self.rfile.read(n)
        if data[:8] != b'\x89PNG\r\n\x1a\n':
            return self._send(400, b'not a png')
        open(os.path.join(OUT, name), 'wb').write(data)
        self._send(200, ('saved %s %d bytes' % (name, len(data))).encode())

    def log_message(self, *a):
        pass

http.server.ThreadingHTTPServer(('127.0.0.1', 8102), H).serve_forever()
