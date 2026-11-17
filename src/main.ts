import { resolveRoute, type PortfolioRoute } from './navigation';
import { initializeSettings } from './device/settings';
import { initializeExplorers } from './features/explorers';
import { initializeCore } from './device/core-loader';
import { initializeOS } from './os/controller';

interface RouteState { portfolio: true; index: number; key: string; scroll: number }
const viewport=document.querySelector<HTMLElement>('.device-viewport');
if(viewport) initializePortfolio(viewport);
function initializePortfolio(viewport:HTMLElement):void {
  const screens=[...document.querySelectorAll<HTMLElement>('[data-screen]')];
  const preferences=initializeSettings();
  const explorer=initializeExplorers();
  const mobile=matchMedia('(max-width:700px)');
  const initialScreen=viewport.dataset.initialScreen??'home';
  let current:PortfolioRoute=resolveRoute(new URL(location.href))??{screen:initialScreen,url:location.pathname};
  // The local audit route can specify a canonical page's initial screen.
  if(location.pathname==='/__audit' && !location.hash)current={screen:initialScreen,url:location.pathname+location.search};
  if(!screens.some(screen=>screen.dataset.screen===current.screen)) current={screen:initialScreen,url:location.pathname};
  let currentKey:string=crypto.randomUUID();
  let activeUrl=location.href;
  let routeIndex=0;
  const scrollPositions=new Map<string,number>();
  const screenPositions=new Map<string,number>();
  const readScroll=():number=>mobile.matches?window.scrollY:viewport.scrollTop;
  const writeScroll=(top:number):void=>{if(mobile.matches)window.scrollTo({top,behavior:'instant'});else {window.scrollTo({top:0,behavior:'instant'});viewport.scrollTo({top,behavior:'instant'});}};
  function saveScroll():void { scrollPositions.set(currentKey,readScroll());screenPositions.set(current.screen,readScroll()); }
  viewport.addEventListener('scroll',saveScroll,{passive:true});
  window.addEventListener('scroll',saveScroll,{passive:true});
  history.scrollRestoration='manual';
  const previousState=history.state as Partial<RouteState>|null;
  if(previousState?.portfolio && typeof previousState.key==='string') {currentKey=previousState.key;routeIndex=previousState.index??0;}
  history.replaceState({portfolio:true,index:routeIndex,key:currentKey,scroll:0} satisfies RouteState,'',location.href);
  function render(route:PortfolioRoute,focus:boolean,scroll:number):void {
    const active=screens.find(screen=>screen.dataset.screen===route.screen);
    if(!active)return;
    if(focus)os.before(screens.find(screen=>!screen.hidden),route.screen);
    document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(dialog=>dialog.close());
    screens.forEach(screen=>{screen.hidden=screen!==active;});
    document.body.classList.toggle('recruiter-mode',route.screen==='recruiter');
    if(route.category)explorer.selectSkill(route.category);
    const section=route.screen.startsWith('project-')?'work':route.screen;
    document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach(link=>{
      if(link.dataset.nav===section)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
    const moreButton=document.getElementById('open-more');
    if(moreButton)moreButton.classList.toggle('active',['experience','about','architecture','contact','recruiter'].includes(section));
    const label=active.dataset.title??'Portfolio';
    const labelElement=document.getElementById('screen-label');if(labelElement)labelElement.textContent=label;
    document.querySelectorAll<HTMLButtonElement>('#app-back,#os-back').forEach(button=>{
      button.disabled=route.screen==='home';
    });
    document.title=route.screen==='home'?'Ruzain Abdurahman | Android & Mobile Software Engineer':`${label} | Ruzain Abdurahman`;
    const canonical=route.screen.startsWith('project-')?`/work/${route.screen.slice(8)}.html`:'/';
    document.querySelector('link[rel="canonical"]')?.setAttribute('href','https://ruzain.online'+canonical);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content','https://ruzain.online'+canonical);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
    writeScroll(scroll);
    if(focus){
      const heading=active.querySelector<HTMLElement>('h2');heading?.focus({preventScroll:true});
      const announcement=document.getElementById('route-announcement');if(announcement)announcement.textContent=`${label} screen`;
    }
    os.after(active,focus);
  }
  function navigate(route:PortfolioRoute):void {
    saveScroll();
    if(current.url===route.url){render(route,true,readScroll());return;}
    current=route;currentKey=crypto.randomUUID();routeIndex++;
    const nextScroll=route.category?0:screenPositions.get(route.screen)??0;
    history.pushState({portfolio:true,index:routeIndex,key:currentKey,scroll:nextScroll} satisfies RouteState,'',route.url);
    activeUrl=location.href;
    render(route,true,nextScroll);
  }
  document.addEventListener('click',event=>{
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element))return;
    const anchor=event.target.closest<HTMLAnchorElement>('a[href]');
    if(!anchor || anchor.hasAttribute('download') || anchor.target==='_blank')return;
    const url=new URL(anchor.href,location.href);
    if(url.origin!==location.origin)return;
    if(anchor.classList.contains('skip')){
      event.preventDefault();const active=screens.find(screen=>!screen.hidden);active?.querySelector<HTMLElement>('h2')?.focus({preventScroll:false});return;
    }
    const route=resolveRoute(url);
    if(!route || !screens.some(screen=>screen.dataset.screen===route.screen))return;
    event.preventDefault();navigate(route);
  });
  function restore():void {
    if(activeUrl===location.href)return;
    saveScroll();
    const route=resolveRoute(new URL(location.href));
    if(!route)return;
    const state=history.state as Partial<RouteState>|null;
    current=route;currentKey=state?.key??crypto.randomUUID();routeIndex=state?.index??0;activeUrl=location.href;
    if(!state?.portfolio)history.replaceState({portfolio:true,index:routeIndex,key:currentKey,scroll:0} satisfies RouteState,'',location.href);
    const restoredScroll=scrollPositions.get(currentKey)??state?.scroll??0;
    render(route,true,restoredScroll);
    requestAnimationFrame(()=>writeScroll(restoredScroll));
  }
  window.addEventListener('popstate',restore);
  window.addEventListener('hashchange',restore);
  function goBack():void {
    // The launcher is the root of in-device navigation, even when the browser
    // still has previous entries. Native browser history remains independent.
    if(current.screen==='home')return;
    if(routeIndex>0)history.back();else navigate({screen:current.screen.startsWith('project-')?'work':'home',url:current.screen.startsWith('project-')?'/#work':'/#home'});
  }
  document.getElementById('app-back')?.addEventListener('click',goBack);
  const os=initializeOS({navigate,back:goBack,current:()=>current,reduced:preferences.motionReduced});
  window.addEventListener('pagehide',()=>{
    saveScroll();history.replaceState({portfolio:true,index:routeIndex,key:currentKey,scroll:readScroll()} satisfies RouteState,'',location.href);
  });
  document.documentElement.classList.add('enhanced');
  document.documentElement.classList.remove('app-loading');
  render(current,false,previousState?.scroll??0);
  // A direct #skill-* URL can trigger the browser's initial fragment scroll
  // after modules run. Restore the screen position once layout/load settles.
  const settleInitialScroll=():void=>{requestAnimationFrame(()=>writeScroll(previousState?.scroll??0));};
  if(document.readyState==='complete')settleInitialScroll();
  else window.addEventListener('load',settleInitialScroll,{once:true});
  initializeCore(preferences.motionReduced);
}
