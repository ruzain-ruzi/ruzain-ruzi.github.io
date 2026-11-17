import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const current = page => page.locator('[data-screen]:visible');
async function visit(page,path='/') { await page.goto(path);await expect(page.locator('html')).toHaveClass('enhanced'); }
async function go(page,route) { await page.locator(`a[href="${route}"]:visible`).first().click(); }
test('desktop navigation, browser history, deep links and scroll restoration',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await visit(page);
  await expect(current(page)).toHaveAttribute('id','home');
  await go(page,'/#work');
  await expect(current(page)).toHaveAttribute('id','work');
  await page.locator('.device-viewport').evaluate(el=>el.scrollTop=180);
  await expect.poll(()=>page.locator('.device-viewport').evaluate(el=>el.scrollTop)).toBe(180);
  await page.locator('#work .project-tile h3 a').first().click();
  await expect(page).toHaveURL(/\/work\/onedi-transit\.html$/);
  await expect(current(page)).toHaveAttribute('id','project-onedi-transit');
  await page.goBack();
  await expect(current(page)).toHaveAttribute('id','work');
  await expect.poll(()=>page.locator('.device-viewport').evaluate(el=>el.scrollTop)).toBeGreaterThan(100);
  await page.goForward();await expect(current(page)).toHaveAttribute('id','project-onedi-transit');
  await page.reload();await expect(current(page)).toHaveAttribute('id','project-onedi-transit');
  await page.locator('#app-back').click();await expect(current(page)).toHaveAttribute('id','work');
  await visit(page,'/#skill-data');
  await expect(current(page)).toHaveAttribute('id','expertise');
  await expect(page.locator('#skill-data')).toBeVisible();
  await expect(page.locator('#skill-mobile')).toBeHidden();
  await expect.poll(()=>page.locator('.device-viewport').evaluate(el=>el.scrollTop)).toBe(0);
  expect(errors).toEqual([]);
});
test('skills, project filters and architecture controls reveal supported evidence',async({page})=>{
  await visit(page,'/#work');
  await page.getByRole('button',{name:'Offline-first',exact:true}).click();
  await expect(page.locator('.project-tile:visible')).toHaveCount(2);
  await page.getByRole('button',{name:'Android TV',exact:true}).click();
  await expect(page.locator('.project-tile:visible')).toHaveCount(1);
  await expect(page.locator('.project-tile:visible')).toContainText('OneDi Media & PIS');
  await go(page,'/#expertise');
  await go(page,'/#skill-hardware');
  await expect(page.locator('#skill-hardware')).toBeVisible();
  await page.locator('#skill-hardware a[href="/work/onedi-transit.html"]').click();
  const diagram=page.locator('#project-onedi-transit [data-architecture]');
  await diagram.locator('[data-node="2"]').focus();
  await page.keyboard.press('Enter');
  await expect(diagram.locator('[data-node="2"]')).toHaveAttribute('aria-pressed','true');
  await expect(diagram.locator('[data-node-detail="2"]')).toBeVisible();
  await expect(diagram.locator('[data-node-detail="0"]')).toBeHidden();
  await expect(diagram.locator('[data-node-detail="2"]')).toContainText('Room');
});
test('mobile navigation, natural scrolling, touch and accessible menus',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const page=await context.newPage();await visit(page,'http://127.0.0.1:4173/');
  await expect(page.locator('.navigation-rail')).toBeHidden();
  await expect(page.locator('.bottom-navigation')).toBeVisible();
  await page.locator('#open-more').tap();
  await expect(page.locator('#more-dialog')).toBeVisible();
  await page.keyboard.press('Escape');await expect(page.locator('#more-dialog')).not.toBeVisible();
  await expect(page.locator('#open-more')).toBeFocused();
  await page.locator('#open-more').tap();await page.locator('#more-dialog a[href="/#experience"]').tap();
  await expect(current(page)).toHaveAttribute('id','experience');
  await expect(page.locator('#more-dialog')).not.toBeVisible();
  await expect(page.locator('#heading-experience')).toBeFocused();
  await page.evaluate(()=>window.scrollTo(0,500));
  expect(await page.evaluate(()=>scrollY)).toBeGreaterThan(0);
  expect(await page.locator('.device-viewport').evaluate(el=>el.scrollTop)).toBe(0);
  await page.locator('.bottom-navigation a[href="/#resumes"]').tap();
  await expect(current(page)).toHaveAttribute('id','resumes');
  await context.close();
});
test('display preferences, form factors and reduced motion',async({page})=>{
  await visit(page);
  await page.selectOption('#form-factor','phone');
  await expect(page.locator('.bottom-navigation')).toBeVisible();
  await expect(page.locator('.navigation-rail')).toBeHidden();
  await expect.poll(()=>page.locator('.device-frame').evaluate(el=>el.getBoundingClientRect().width)).toBeLessThan(450);
  await page.selectOption('#form-factor','tablet');await expect(page.locator('.navigation-rail')).toBeVisible();
  await page.selectOption('#form-factor','adaptive');
  await page.locator('#open-settings').click();
  await page.getByRole('radio',{name:'Light',exact:true}).check();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.locator('#reduce-motion').check();
  await expect(page.locator('html')).toHaveAttribute('data-motion','reduced');
  await page.keyboard.press('Escape');
  await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.locator('html')).toHaveAttribute('data-motion','reduced');
  await go(page,'/#architecture');await expect(page.locator('.core-fallback')).toBeVisible();
  await expect(page.locator('.core-canvas canvas')).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('#open-settings').click();await expect(page.locator('#reduce-motion')).toBeDisabled();
});
test('all regional downloads preserve original bytes',async({page,request})=>{
  await visit(page,'/#resumes');
  for(const region of ['India','GCC','Europe']){
    const filename=`Resume_Ruzain_Android_${region}.pdf`;
    const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:`Download ${region} resume`,exact:true}).click()]);
    expect(download.suggestedFilename()).toBe(filename);
    const original=await readFile(`resumes/${filename}`);
    const response=await request.get(`/resumes/${filename}`);
    expect(response.ok()).toBe(true);expect(response.headers()['content-type']).toBe('application/pdf');
    expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(createHash('sha256').update(original).digest('hex'));
  }
});
test('no-JavaScript fallback keeps meaningful content and downloads accessible',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('#home')).toBeVisible();await expect(page.locator('#experience')).toBeVisible();
  await expect(page.locator('#resumes')).toBeVisible();await expect(page.locator('.noscript-note')).toBeVisible();
  expect(await page.locator('a[download]').count()).toBe(6);
  await context.close();
});
test('failed application bundle restores the readable fallback',async({page})=>{
  await page.route('**/assets/main.js',route=>route.abort());
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/app-loading/,{timeout:6000});
  await expect(page.locator('#experience')).toBeVisible();
  await expect(page.locator('#resumes')).toBeVisible();
  await expect(page.locator('.navigation-rail')).toBeVisible();
  expect(await page.locator('a[download]').count()).toBe(6);
});
test('unavailable WebGL never blocks architecture content',async({browser})=>{
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(kind,...args){return String(kind).startsWith('webgl')?null:original.call(this,kind,...args);};
  });
  const page=await context.newPage();await visit(page,'http://127.0.0.1:4173/#architecture');
  await expect(page.locator('#engineering-core .core-fallback')).toBeVisible();
  await expect(page.locator('#engineering-core')).not.toHaveClass(/webgl-ready/);
  await page.locator('#architecture [data-node="1"]').click();
  await expect(page.locator('#architecture [data-node-detail="1"]')).toBeVisible();
  await context.close();
});
test('each canonical case study opens directly and recruiter mode prints',async({page})=>{
  for(const slug of ['onedi-transit','onedi-smart-pos','onedi-media','chandini-dsr']){
    await visit(page,`/work/${slug}.html`);
    await expect(current(page)).toHaveAttribute('id',`project-${slug}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://ruzain.online/work/${slug}.html`);
    await page.locator(`#project-${slug} [data-node="3"]`).click();
    await expect(page.locator(`#project-${slug} [data-node-detail="3"]`)).toBeVisible();
  }
  await go(page,'/#recruiter');await page.emulateMedia({media:'print'});
  await expect(page.locator('#recruiter')).toBeVisible();
  await expect(page.locator('.navigation-rail')).toBeHidden();
  await expect(page.locator('#home')).toBeHidden();
  await page.pdf({path:'.qa/recruiter-print.pdf',format:'A4',printBackground:false});
});
for(const width of [320,390,768,1024,1440,2560]) {
  test(`responsive content remains in bounds at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:width<700?844:1000});
    await visit(page);
    for(const route of ['home','expertise','work','experience','resumes','contact','recruiter','architecture']){
      await page.goto('/#'+route);
      await expect(current(page)).toHaveAttribute('id',route);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route}: document overflow`).toBe(true);
      expect(await current(page).evaluate(el=>el.scrollWidth<=el.clientWidth+1),`${route}: screen overflow`).toBe(true);
    }
  });
}
test('axe audits each screen, project detail, settings, and light mode',async({page})=>{
  await visit(page);
  await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
  const results=[];
  for(const route of ['home','expertise','experience','work','resumes','contact','about','architecture','recruiter']){
    await go(page,route==='recruiter'?'/#recruiter':'/#'+route);
    await expect(current(page)).toHaveAttribute('id',route);
    const audit=await page.evaluate(async()=>{
      const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}});
      return {violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),passes:result.passes.length};
    });
    results.push({route,...audit});
  }
  await go(page,'/#work');await page.locator('#work .project-tile h3 a').first().click();
  const detail=await page.evaluate(async()=> (await window.axe.run()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
  results.push({route:'project-detail',violations:detail});
  await page.locator('#open-settings').click();await page.getByRole('radio',{name:'Light',exact:true}).check();
  const settings=await page.evaluate(async()=> (await window.axe.run()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
  results.push({route:'light-settings',violations:settings});
  await page.keyboard.press('Escape');
  const light=await page.evaluate(async()=> (await window.axe.run()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
  results.push({route:'light-detail',violations:light});
  await test.info().attach('accessibility-results',{body:JSON.stringify(results,null,2),contentType:'application/json'});
  expect(results.filter(result=>result.violations.length)).toEqual([]);
});
