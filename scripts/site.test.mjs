import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { projects, regions } from '../src/content.mjs';
const pages = ['index.html','404.html',...projects.map(p=>`work/${p.slug}.html`)];
test('every local page link, fragment, image, stylesheet and script resolves',async()=>{
  for(const page of pages) {
    const html = await readFile(page,'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(ids.length,new Set(ids).size,`${page}: duplicate IDs`);
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${page}: one primary heading`);
    for(const [,link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if(/^(https?:|mailto:|data:)/.test(link)) continue;
      const url = new URL(link,`https://ruzain.online/${page}`);
      const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      await access(path.resolve(file));
      if(url.hash) {
        const target = await readFile(file,'utf8');
        assert.ok(target.includes(`id="${url.hash.slice(1)}"`),`${page}: missing ${link}`);
      }
    }
  }
});
test('regional resumes are valid PDFs with distinct content',async()=>{
  const hashes = [];
  for(const [region] of regions) {
    const data = await readFile(`resumes/Resume_Ruzain_Android_${region}.pdf`);
    assert.equal(data.subarray(0,5).toString(),'%PDF-');
    hashes.push(createHash('sha256').update(data).digest('hex'));
  }
  assert.equal(new Set(hashes).size,3);
});
test('SEO and career facts are consistent across generated pages',async()=>{
  const html = await readFile('index.html','utf8');
  assert.ok(html.includes('JAN 2023 — OCT 2026'));
  assert.ok(!html.includes('Jan 2023 - Present'));
  for(const page of pages) {
    const document = await readFile(page,'utf8');
    assert.ok(document.includes('rel="canonical"'));
    assert.ok(document.includes('name="description"'));
    const json = document.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
    assert.ok(json); assert.doesNotThrow(()=>JSON.parse(json));
  }
  const sitemap = await readFile('sitemap.xml','utf8');
  for(const project of projects) assert.ok(sitemap.includes(`/work/${project.slug}.html`));
});
