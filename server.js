// Zero-dependency static server for Railway
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon'
};

function send(req, res, code, file) {
  const ext = path.extname(file);
  const headers = {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'public, max-age=300' : 'public, max-age=86400',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN'
  };
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(500); return res.end('Server error'); }
    const gz = /\bgzip\b/.test(req.headers['accept-encoding'] || '') && /html|xml|text|javascript|css|svg/.test(headers['Content-Type']);
    if (gz) { data = zlib.gzipSync(data); headers['Content-Encoding'] = 'gzip'; headers['Vary'] = 'Accept-Encoding'; }
    res.writeHead(code, headers);
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}

http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, st) => {
    if (!err && st.isFile()) return send(req, res, 200, file);
    send(req, res, 404, path.join(ROOT, '404.html'));
  });
}).listen(PORT, () => console.log('Listening on ' + PORT));
