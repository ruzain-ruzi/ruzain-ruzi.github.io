import { test, expect } from '@playwright/test';
const active=p=>p.locator('[data-screen]:visible');
async function start(p,route='/'){await p.goto(route);await expect(p.locator('html')).toHaveClass('enhanced');}
async function launch(p,id){await p.locator(`#home .launcher-grid [data-launch="${id}"]`).click();await expect(active(p)).toHaveAttribute('id',id);}
async function home(p){await p.locator('#os-home').click();await expect(active(p)).toHaveAttribute('id','home');}

test('launcher icons open apps, home returns focus, transitions survive rapid navigation',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await start(page);
 for(const id of ['about','work','expertise','experience','architecture','resumes','contact','settings']){
  await launch(page,id);await home(page);await expect(page.locator(`#home .launcher-grid [data-launch="${id}"]`)).toBeFocused();
 }
 await page.locator('#cycle-highlight').click();await expect(page.locator('#highlight-value')).toHaveText('1,000+');
 await launch(page,'work');await page.locator('#os-home').click();await page.locator('#home [data-launch="contact"]').first().click();
 await expect(active(page)).toHaveAttribute('id','contact');await expect(page.locator('.app-transition-ghost')).toHaveCount(0);
 expect(errors).toEqual([]);
});
test('recent apps resume retained project filters, can be dismissed and cleared',async({page})=>{
 await start(page);await launch(page,'work');await page.getByRole('button',{name:'Android TV',exact:true}).click();await home(page);
 await launch(page,'expertise');await home(page);await page.locator('#open-recents').click();
 await expect(page.locator('.recent-card')).toHaveCount(2);
 await page.locator('.recent-preview[href="/#work"]').click();await expect(page.locator('.project-tile:visible')).toHaveCount(1);
 await home(page);await page.locator('#open-recents').click();await page.getByRole('button',{name:'Dismiss Project library',exact:true}).click();
 await expect(page.locator('.recent-card')).toHaveCount(1);await page.locator('#clear-recents').click();await expect(page.locator('#recents-empty')).toBeVisible();
 await page.keyboard.press('Escape');await launch(page,'work');await expect(active(page)).toHaveAttribute('id','work');
});
test('drawer search finds resume-verified skills, projects and regional destinations with keyboard',async({page})=>{
 await start(page);await page.keyboard.press('/');await expect(page.locator('#os-search')).toBeFocused();
 await page.locator('#os-search').fill('Kotlin');await expect(page.locator('#search-count')).toContainText('result');
 await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');await expect(active(page)).toHaveAttribute('id','expertise');
 await page.locator('#open-more').click();await page.locator('#os-search').fill('Europe');await expect(page.locator('#search-results a:visible')).toHaveCount(1);
 await page.locator('#search-results a:visible').click();await expect(active(page)).toHaveAttribute('id','resumes');
 await page.locator('#open-more').click();await page.locator('#os-search').fill('no-such-project');await expect(page.locator('#search-count')).toContainText('No matches');
 await page.keyboard.press('Escape');await expect(page.locator('#open-more')).toBeFocused();
});
test('wallpaper preview is staged, applies palette and persists with display settings',async({page})=>{
 await start(page,'/#settings');await page.locator('[data-wallpaper-choice="sunset"]').click();
 await expect(page.locator('#wallpaper-preview')).toHaveAttribute('data-wallpaper','sunset');await expect(page.locator('.os-wallpaper')).toHaveAttribute('data-wallpaper','aurora');
 await page.locator('#apply-wallpaper').click();await expect(page.locator('.os-wallpaper')).toHaveAttribute('data-wallpaper','sunset');await expect(page.locator('html')).toHaveAttribute('data-palette','coral');
 await page.selectOption('#icon-shape','round');await page.selectOption('#accent-palette','mint');await page.getByRole('radio',{name:'System',exact:true}).check();
 await page.emulateMedia({colorScheme:'dark'});await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.reload();await expect(page.locator('.os-wallpaper')).toHaveAttribute('data-wallpaper','sunset');await expect(page.locator('html')).toHaveAttribute('data-icon-shape','round');await expect(page.locator('html')).toHaveAttribute('data-palette','mint');
 await page.locator('#reset-wallpaper').click();await expect(page.locator('.os-wallpaper')).toHaveAttribute('data-wallpaper','aurora');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#wallpaper-motion')).toBeDisabled();await expect(page.locator('html')).toHaveAttribute('data-motion','reduced');
});
test('quick settings, lock/unlock, home and shade gestures have working alternatives',async({page})=>{
 await start(page);await page.locator('#open-settings').click();await page.locator('#quick-theme').click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.locator('#quick-motion').click();await expect(page.locator('html')).toHaveAttribute('data-motion','reduced');
 await page.locator('#lock-device').click();await expect(page.locator('#lock-dialog')).toBeVisible();await page.locator('#unlock-device').click();await expect(page.locator('#lock-dialog')).toBeHidden();
 await launch(page,'work');
 const handle=await page.locator('#os-home').boundingBox();await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);await page.mouse.down();await page.mouse.move(handle.x+handle.width/2,handle.y-60,{steps:6});await page.mouse.up();await expect(active(page)).toHaveAttribute('id','home');
 const top=await page.locator('#shade-gesture').boundingBox();await page.mouse.move(top.x+100,top.y+15);await page.mouse.down();await page.mouse.move(top.x+100,top.y+90,{steps:6});await page.mouse.up();await expect(page.locator('#settings-dialog')).toBeVisible();
 await page.locator('#settings-dialog a[href="/#recruiter"]').click();await expect(active(page)).toHaveAttribute('id','recruiter');
});
test('PDF previews and featured project gallery open original content',async({page})=>{
 await start(page,'/#resumes');await page.getByRole('button',{name:'Preview GCC resume',exact:true}).click();
 await expect(page.locator('#resume-preview-frame')).toHaveAttribute('src','/resumes/Resume_Ruzain_Android_GCC.pdf');await expect(page.locator('#preview-external')).toHaveAttribute('href','/resumes/Resume_Ruzain_Android_GCC.pdf');
 await page.keyboard.press('Escape');await expect(page.locator('#resume-preview-frame')).not.toHaveAttribute('src');
 await page.goto('/#work');await page.getByRole('button',{name:'Next featured project'}).click();await expect(page.locator('#gallery-status')).toContainText('2 of 4');
 await expect.poll(()=>page.locator('.gallery-track').evaluate(el=>el.scrollLeft)).toBeGreaterThan(100);
});
test('unavailable storage does not block preferences or navigation',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
 await start(page,'/#settings');await page.getByRole('radio',{name:'Dark',exact:true}).check();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.locator('[data-wallpaper-choice="ocean"]').click();await page.locator('#apply-wallpaper').click();await home(page);await launch(page,'resumes');
});
test('OS panels and all curated palettes pass automated accessibility checks',async({page})=>{
 await start(page,'/#settings');await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
 const failures=[];
 const audit=async(label)=>{await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));const v=await page.evaluate(async()=> (await window.axe.run()).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));if(v.length)failures.push({label,violations:v});};
 for(const name of ['aurora','graphite','spectrum','ocean','sunset','mono']){
  await page.locator(`[data-wallpaper-choice="${name}"]`).click();await page.locator('#apply-wallpaper').click();await home(page);await audit(name+' launcher');await launch(page,'settings');
 }
 await page.locator('#open-more').click();await audit('drawer');await page.locator('#os-search').fill('Room');await audit('search');await page.keyboard.press('Escape');
 await page.locator('#open-recents').click();await audit('recents');await page.keyboard.press('Escape');
 await page.locator('#open-settings').click();await audit('quick settings');await page.locator('#lock-device').click();await audit('lock');await page.keyboard.press('Escape');
 await test.info().attach('OS accessibility',{body:JSON.stringify(failures,null,2),contentType:'application/json'});expect(failures).toEqual([]);
});
