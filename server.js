const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Cache-Control': 'public, max-age=3600',
};

http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  filePath = path.normalize(filePath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('403'); return; }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { ...SECURITY_HEADERS });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath);
    const headers = { ...SECURITY_HEADERS, 'Content-Type': MIME[ext] || 'text/plain' };
    res.writeHead(200, headers);
    res.end(data);
  });
}).listen(8765, () => {
  console.log('爻象 AI命理大师 已启动 → http://localhost:8765');
});
