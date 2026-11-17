import type { PortfolioRoute } from '../navigation';
interface RecentApp { screen:string; url:string; title:string; excerpt:string }
interface OSHost { navigate:(route:PortfolioRoute)=>void; back:()=>void; current:()=>PortfolioRoute; reduced:()=>boolean }
export function initializeOS(host:OSHost) {
  const recents=new Map<string,RecentApp>();
  let launchOrigin:DOMRect|null=null;
  let lastApp='work';
  let running:Animation|null=null;
  let ghost:HTMLElement|null=null;
  const appKey=(screen:string):string=>screen.startsWith('project-')?'work':screen;
  const dialogs=[...document.querySelectorAll<HTMLDialogElement>('.device-dialog')];
  // Safari/WebKit does not always focus buttons on pointer activation. Give
  // native dialogs a reliable restoration target before calling showModal.
  document.addEventListener('click',event=>{
    if(!(event.target instanceof Element))return;
    event.target.closest<HTMLElement>('[data-open-drawer],#open-settings,#open-recents,#power-button,[data-preview-resume],#lock-device')?.focus({preventScroll:true});
  },true);
  const closePanels=():void=>dialogs.forEach(d=>{if(d.open)d.close();});
  function open(id:string):void {
    closePanels();const dialog=document.querySelector<HTMLDialogElement>(id);if(!dialog)return;
    dialog.showModal();
    if(!host.reduced())dialog.animate([{opacity:0,transform:'translateY(24px) scale(.98)'},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.2,.8,.2,1)'});
  }
  function drawer():void {open('#more-dialog');document.querySelector<HTMLInputElement>('#os-search')?.focus();}
  document.querySelectorAll('[data-open-drawer]').forEach(el=>el.addEventListener('click',drawer));
  document.getElementById('open-settings')?.addEventListener('click',()=>open('#settings-dialog'));
  function lock():void {open('#lock-dialog');document.getElementById('unlock-device')?.focus();}
  document.getElementById('lock-device')?.addEventListener('click',lock);
  document.getElementById('power-button')?.addEventListener('click',lock);
  document.getElementById('unlock-device')?.addEventListener('click',closePanels);
  document.querySelectorAll<HTMLElement>('[data-preview-resume]').forEach(button=>button.addEventListener('click',()=>{
    const region=button.dataset.previewResume;if(!region||!['India','GCC','Europe'].includes(region))return;
    const url=`/resumes/Resume_Ruzain_Android_${region}.pdf`;
    const frame=document.querySelector<HTMLIFrameElement>('#resume-preview-frame');if(frame){frame.src=url;frame.title=region+' resume PDF preview';}
    document.getElementById('preview-external')?.setAttribute('href',url);
    open('#pdf-dialog');
  }));
  document.getElementById('pdf-dialog')?.addEventListener('close',()=>document.getElementById('resume-preview-frame')?.removeAttribute('src'));
  let featured=0;
  document.querySelectorAll<HTMLElement>('[data-gallery-step]').forEach(button=>button.addEventListener('click',()=>{
    const track=document.querySelector<HTMLElement>('.gallery-track');if(!track)return;
    const cards=[...track.querySelectorAll<HTMLElement>('.gallery-card')];
    featured=Math.max(0,Math.min(cards.length-1,featured+Number(button.dataset.galleryStep)));
    track.scrollTo({left:cards[featured].offsetLeft-cards[0].offsetLeft,behavior:host.reduced()?'instant':'smooth'});
    const status=document.getElementById('gallery-status');if(status)status.textContent=`Featured project ${featured+1} of ${cards.length}: ${cards[featured].querySelector('h4')?.textContent}`;
  }));
  dialogs.forEach(dialog=>{
    dialog.querySelector('[data-close-dialog]')?.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  });
  const home=():void=>host.navigate({screen:'home',url:'/#home'});
  document.getElementById('os-home')?.addEventListener('click',home);
  document.getElementById('os-back')?.addEventListener('click',host.back);
  function drawRecents():void {
    const container=document.getElementById('recent-cards');if(!container)return;
    container.replaceChildren();
    [...recents.values()].reverse().forEach(app=>{
      const card=document.createElement('article');card.className='recent-card';
      const resume=document.createElement('a');resume.href=app.url;resume.className='recent-preview';
      const eyebrow=document.createElement('span');eyebrow.className='eyebrow';eyebrow.textContent='RESUME APPLICATION';
      const title=document.createElement('h3');title.textContent=app.title;
      const text=document.createElement('p');text.textContent=app.excerpt;
      const action=document.createElement('span');action.className='recent-resume';action.textContent='Continue →';
      resume.append(eyebrow,title,text,action);
      const dismiss=document.createElement('button');dismiss.type='button';dismiss.className='button ghost';dismiss.textContent='Dismiss';dismiss.setAttribute('aria-label','Dismiss '+app.title);
      dismiss.addEventListener('click',()=>{recents.delete(appKey(app.screen));drawRecents();(container.querySelector('button')??document.querySelector('#recents-dialog [data-close-dialog]'))?.focus();});
      card.append(resume,dismiss);container.append(card);
    });
    const empty=document.getElementById('recents-empty');if(empty)empty.hidden=recents.size>0;
    const clear=document.getElementById('clear-recents') as HTMLButtonElement|null;if(clear)clear.disabled=recents.size===0;
  }
  document.getElementById('open-recents')?.addEventListener('click',()=>{drawRecents();open('#recents-dialog');});
  document.getElementById('clear-recents')?.addEventListener('click',()=>{recents.clear();drawRecents();document.querySelector<HTMLButtonElement>('#recents-dialog [data-close-dialog]')?.focus();});
  const search=document.querySelector<HTMLInputElement>('#os-search');
  search?.addEventListener('input',()=>{
    const query=search.value.trim().toLocaleLowerCase();
    const results=document.getElementById('search-results'),apps=document.getElementById('drawer-apps');
    if(results)results.hidden=!query;if(apps)apps.hidden=!!query;
    let count=0;
    document.querySelectorAll<HTMLElement>('[data-search]').forEach(el=>{el.hidden=!query.split(/\s+/).every(word=>el.dataset.search?.toLocaleLowerCase().includes(word));if(!el.hidden)count++;});
    const status=document.getElementById('search-count');if(status)status.textContent=count?`${count} result${count===1?'':'s'} for “${search.value}”`:'No matches. Try Kotlin, NFC, OneDi, or a resume region.';
  });
  search?.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='Enter'){event.preventDefault();document.querySelector<HTMLAnchorElement>('#search-results:not([hidden]) a:not([hidden]),#drawer-apps:not([hidden]) a')?.focus();}});
  document.getElementById('search-results')?.addEventListener('keydown',event=>{
    if(event.key!=='ArrowDown'&&event.key!=='ArrowUp')return;
    const links=[...document.querySelectorAll<HTMLAnchorElement>('#search-results a:not([hidden])')];
    const index=links.indexOf(document.activeElement as HTMLAnchorElement);if(index<0)return;
    event.preventDefault();if(event.key==='ArrowUp'&&index===0)search?.focus();else links[(index+(event.key==='ArrowDown'?1:-1)+links.length)%links.length]?.focus();
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&dialogs.some(d=>d.open)){event.preventDefault();closePanels();return;}
    if(event.defaultPrevented||event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement||event.target instanceof HTMLSelectElement)return;
    if(dialogs.some(d=>d.open))return;
    if(event.key==='/'&&!event.ctrlKey&&!event.metaKey){event.preventDefault();drawer();}
    if(event.key==='Escape'&&host.current().screen!=='home'){event.preventDefault();host.back();}
  });
  document.addEventListener('click',event=>{if(!(event.target instanceof Element))return;const launcher=event.target.closest<HTMLElement>('[data-launch]');launchOrigin=launcher?.querySelector('.launcher-icon')?.getBoundingClientRect()??null;},true);
  function swipe(el:HTMLElement|null,direction:'up'|'down',action:()=>void):void {
    if(!el)return;let start:{x:number;y:number;id:number}|null=null;let swiped=false;
    el.addEventListener('pointerdown',e=>{if(e.button!==0)return;if(el.id==='shade-gesture'&&e.target instanceof Element&&e.target.closest('button'))return;start={x:e.clientX,y:e.clientY,id:e.pointerId};swiped=false;el.setPointerCapture(e.pointerId);});
    el.addEventListener('pointerup',e=>{if(!start||start.id!==e.pointerId)return;const dy=e.clientY-start.y,dx=Math.abs(e.clientX-start.x);if(dx<55&&(direction==='up'?dy< -35:dy>35)){swiped=true;action();}start=null;});
    el.addEventListener('pointercancel',()=>{start=null;});
    el.addEventListener('click',event=>{if(swiped){event.preventDefault();event.stopImmediatePropagation();swiped=false;}},true);
  }
  swipe(document.getElementById('os-home'),'up',()=>host.current().screen==='home'?drawer():home());
  swipe(document.getElementById('shade-gesture'),'down',()=>open('#settings-dialog'));
  const highlights=[['10+','production Android applications'],['1,000+','daily POS transactions'],['28%','faster cold starts'],['Offline-first','engineering for unreliable networks'],['NFC + POS','software that connects to hardware']];let highlight=0;
  document.getElementById('cycle-highlight')?.addEventListener('click',()=>{highlight=(highlight+1)%highlights.length;const value=document.getElementById('highlight-value'),label=document.getElementById('highlight-label'),count=document.getElementById('highlight-count');if(value){value.textContent=highlights[highlight][0];value.dataset.long=String(highlight>=3);}if(label)label.textContent=highlights[highlight][1];if(count)count.textContent=`0${highlight+1} / 05`;});
  function before(previous:HTMLElement|undefined,next:string):void {
    running?.cancel();ghost?.remove();ghost=null;
    if(!previous||host.reduced())return;
    if(next==='home'&&previous.dataset.screen!=='home'){
      lastApp=appKey(previous.dataset.screen??'work');
      const bounds=previous.getBoundingClientRect();
      ghost=previous.cloneNode(true) as HTMLElement;
      ghost.removeAttribute('id');ghost.removeAttribute('data-screen');ghost.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));ghost.querySelectorAll('[data-screen]').forEach(el=>el.removeAttribute('data-screen'));ghost.setAttribute('aria-hidden','true');ghost.inert=true;
      ghost.classList.add('app-transition-ghost');
      Object.assign(ghost.style,{position:'fixed',left:bounds.left+'px',top:bounds.top+'px',width:bounds.width+'px',height:Math.min(bounds.height,innerHeight-bounds.top)+'px',overflow:'hidden',margin:'0',zIndex:'80',pointerEvents:'none',transformOrigin:'0 0',background:'var(--screen)'});
      document.body.append(ghost);
    }
  }
  function after(active:HTMLElement,animate:boolean):void {
    const screen=active.dataset.screen??'home';
    document.body.dataset.activeApp=screen;
    if(!['home','recruiter','not-found'].includes(screen)){
      const key=appKey(screen);lastApp=key;recents.delete(key);
      recents.set(key,{screen,url:host.current().url,title:active.dataset.title??key,excerpt:(active.querySelector('.screen-heading p:last-child')?.textContent??active.textContent??'').trim().slice(0,190)});
    }
    if(!animate)return;
    if(screen==='home'){
      const destination=document.querySelector<HTMLElement>(`#home [data-launch="${lastApp}"]`);
      if(ghost){const target=destination?.querySelector('.launcher-icon')?.getBoundingClientRect();const from=ghost.getBoundingClientRect();const closing=ghost;ghost=null;if(target&&!host.reduced()){running=closing.animate([{transform:'none',opacity:1,borderRadius:'24px'},{transform:`translate(${target.x-from.x}px,${target.y-from.y}px) scale(${target.width/from.width},${target.height/from.height})`,opacity:0,borderRadius:'60px'}],{duration:300,easing:'cubic-bezier(.4,0,.2,1)'});running.finished.catch(()=>{}).finally(()=>closing.remove());}else closing.remove();}
      destination?.focus({preventScroll:true});
    }else if(!host.reduced()){
      const bounds=active.getBoundingClientRect(),origin=launchOrigin;
      running=active.animate(origin?[{transform:`translate(${origin.x-bounds.x}px,${origin.y-bounds.y}px) scale(${origin.width/bounds.width},${origin.height/Math.min(bounds.height,innerHeight)})`,opacity:.2,borderRadius:'56px'},{transform:'none',opacity:1,borderRadius:'24px'}]:[{transform:'translateY(14px) scale(.985)',opacity:.35},{transform:'none',opacity:1}],{duration:origin?380:210,easing:'cubic-bezier(.16,1,.3,1)'});
      active.style.transformOrigin='0 0';
    }
    launchOrigin=null;
  }
  document.addEventListener('portfolio-preferences',()=>{if(host.reduced()){running?.cancel();ghost?.remove();ghost=null;}});
  return {before,after};
}

