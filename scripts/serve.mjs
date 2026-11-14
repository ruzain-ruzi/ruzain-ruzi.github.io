import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const auditMode = process.argv.includes('--audit');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.pdf':'application/pdf','.xml':'application/xml','.txt':'text/plain'};
const server = http.createServer(async (request,response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    // Local-only audit endpoints are excluded from GitHub Pages publishing.
    if (auditMode && pathname.startsWith('/__audit')) {
      if (pathname === '/__audit/axe.js') {
        response.writeHead(200, {'Content-Type':'text/javascript'});
        response.end(await readFile(path.join(root,'node_modules/axe-core/axe.min.js'))); return;
      }
      if (pathname === '/__audit/run.js') {
        response.writeHead(200, {'Content-Type':'text/javascript'});
        response.end(await readFile(path.join(root,'scripts/audit-browser.js'))); return;
      }
      const route = new URL(request.url,'http://localhost').searchParams.get('page') || 'index.html';
      const allowed = ['index.html','work/onedi-transit.html','work/onedi-smart-pos.html','work/onedi-media.html','work/chandini-dsr.html'];
      if (!allowed.includes(route)) throw new Error('Unknown audit page');
      const html = await readFile(path.join(root,route),'utf8');
      response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      response.end(html.replace('</body>','<script src="/__audit/axe.js"></script><script src="/__audit/run.js"></script></body>')); return;
    }
    const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(root,target);
    if(relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(p=>p.startsWith('.') || ['node_modules','src','scripts','docs'].includes(p))) { response.writeHead(403); response.end('Forbidden'); return; }
    const info = await stat(target);
    if(!info.isFile()) throw new Error('Not found');
    response.writeHead(200, {'Content-Type':mime[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    response.end(await readFile(target));
  } catch { response.writeHead(404, {'Content-Type':'text/html; charset=utf-8'}); response.end(await readFile(path.join(root,'404.html')).catch(()=> 'Not found')); }
});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
