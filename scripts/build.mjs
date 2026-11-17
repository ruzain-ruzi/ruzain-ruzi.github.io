import { build, transform } from 'esbuild';
import { mkdir, writeFile, readFile, readdir, unlink } from 'node:fs/promises';
import { profile, projects } from '../src/content.mjs';
import { escapeHtml } from './components/ui.mjs';
import { deviceShell } from './components/device.mjs';
import * as screens from './components/screens.mjs';

const summary = 'Ruzain Abdurahman, Android and mobile software engineer. Explore production applications, offline-first architecture, payment hardware integrations, experience, and regional resumes.';
function document(title, description, path, initial = 'home', notFound = false) {
  const url = profile.origin + path;
  const allScreens = [screens.homeScreen(), screens.aboutScreen(), screens.expertiseScreen(), screens.experienceScreen(), screens.projectsScreen(), screens.architectureScreen(), screens.resumeScreen(), screens.contactScreen(), screens.recruiterScreen(), ...projects.map(screens.projectScreen)];
  if (notFound) allScreens.unshift('<section class="app-screen" id="not-found" data-screen="not-found" data-title="Page not found"><p class="eyebrow">404 / NO SCREEN HERE</p><h2 id="heading-not-found" tabindex="-1">Let’s get you back to the work.</h2><p>This page is no longer available.</p><a class="button primary" href="/#home">Open portfolio home →</a></section>');
  // Put the canonical page content first in source, so it remains useful without JS.
  allScreens.sort((a,b) => Number(b.includes(`data-screen="${initial}"`)) - Number(a.includes(`data-screen="${initial}"`)));
  const schema = initial.startsWith('project-') ? {'@context':'https://schema.org','@type':'CreativeWork',name:title,description,url,author:{'@type':'Person',name:profile.name,url:profile.origin}} : {'@context':'https://schema.org','@type':'Person',name:profile.name,jobTitle:profile.role,url:profile.origin,email:profile.email,sameAs:[profile.linkedin,profile.github]};
  return `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#111918"><meta name="color-scheme" content="dark light"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${url}"><link rel="icon" type="image/svg+xml" href="/images/favicon.svg"><link rel="apple-touch-icon" href="/images/apple-touch-icon.png"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${profile.origin}/assets/social-preview.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><script>document.documentElement.classList.add("app-loading");setTimeout(()=>document.documentElement.classList.remove("app-loading"),4000)</script><link rel="stylesheet" href="/assets/site.css"><script type="module" src="/assets/main.js"></script><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body>${deviceShell(allScreens.join('\n'),initial)}</body></html>`;
}
await mkdir('assets', {recursive:true});
await mkdir('work', {recursive:true});
await mkdir('.qa', {recursive:true});
const result = await build({entryPoints:['src/main.ts'],bundle:true,format:'esm',splitting:true,outdir:'assets',chunkNames:'chunks/[name]-[hash]',minify:true,target:['es2022'],legalComments:'eof',metafile:true});
await writeFile('.qa/bundle-meta.json',JSON.stringify(result.metafile,null,2));
// Remove only obsolete esbuild core chunks; preserve hand-authored assets.
for(const file of await readdir('assets/chunks')) {
  const output=`assets/chunks/${file}`;
  if(/^core-[A-Z0-9]+\.js$/.test(file) && !result.metafile.outputs[output]) await unlink(output);
}
const css = await Promise.all(['src/styles/device.css','src/styles/illustrations.css'].map(p=>readFile(p,'utf8')));
await writeFile('assets/site.css',(await transform(css.join('\n'),{loader:'css',minify:true})).code);
await writeFile('index.html',document('Ruzain Abdurahman | Android & Mobile Software Engineer',summary,'/'));
for(const p of projects) await writeFile(`work/${p.slug}.html`,document(`${p.title} | Ruzain Abdurahman`,p.description,`/work/${p.slug}.html`,`project-${p.slug}`));
await writeFile('404.html',document('Page not found | Ruzain Abdurahman','Return to Ruzain’s engineering portfolio.','/404.html','not-found',true));
await writeFile('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...projects.map(p=>`/work/${p.slug}.html`)].map(p=>`<url><loc>${profile.origin}${p}</loc></url>`).join('')}</urlset>`);
await writeFile('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${profile.origin}/sitemap.xml\n`);
console.log('Built adaptive Android portfolio, four canonical case studies, 404, SEO files, and split bundles.');
