export interface DisplayPreferences {
  theme:'dark'|'light'|'system'; reducedMotion:boolean; wallpaper:string;
  accent:'wallpaper'|'mint'|'violet'|'coral'; iconShape:'soft'|'round'; wallpaperMotion:boolean;
}
const collections:Record<string,{name:string;palette:string}>={aurora:{name:'Aurora Flow',palette:'violet'},graphite:{name:'Midnight Graphite',palette:'mint'},spectrum:{name:'Liquid Spectrum',palette:'violet'},ocean:{name:'Ocean Depth',palette:'mint'},sunset:{name:'Sunset Bloom',palette:'coral'},mono:{name:'Minimal Monochrome',palette:'mono'}};
export function initializeSettings():{motionReduced:()=>boolean} {
  const systemMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const systemTheme=matchMedia('(prefers-color-scheme: dark)');
  let preferences:DisplayPreferences={theme:'light',reducedMotion:false,wallpaper:'aurora',accent:'wallpaper',iconShape:'soft',wallpaperMotion:false};
  try {
    const saved:Partial<DisplayPreferences>=JSON.parse(localStorage.getItem('portfolio-display')??'{}')??{};
    preferences={theme:saved.theme==='dark'||saved.theme==='system'?saved.theme:'light',reducedMotion:saved.reducedMotion===true,wallpaper:typeof saved.wallpaper==='string'&&Object.hasOwn(collections,saved.wallpaper)?saved.wallpaper:'aurora',accent:saved.accent==='mint'||saved.accent==='violet'||saved.accent==='coral'?saved.accent:'wallpaper',iconShape:saved.iconShape==='round'?'round':'soft',wallpaperMotion:saved.wallpaperMotion===true};
  } catch { /* Storage is optional. */ }
  let preview=preferences.wallpaper;
  let wallpaperFade:Animation|null=null;
  let previousWallpaper:HTMLElement|null=null;
  const motionReduced=():boolean=>preferences.reducedMotion||systemMotion.matches;
  const actualTheme=():string=>preferences.theme==='system'?(systemTheme.matches?'dark':'light'):preferences.theme;
  function save():void {try{localStorage.setItem('portfolio-display',JSON.stringify(preferences));}catch{/* Keep in-memory preferences. */}}
  function apply():void {
    const root=document.documentElement;
    root.dataset.theme=actualTheme();root.dataset.motion=motionReduced()?'reduced':'full';
    root.dataset.palette=preferences.accent==='wallpaper'?collections[preferences.wallpaper].palette:preferences.accent;
    root.dataset.iconShape=preferences.iconShape;
    root.dataset.wallpaperMotion=preferences.wallpaperMotion&&!motionReduced()?'on':'off';
    document.querySelectorAll<HTMLElement>('.os-wallpaper:not(.wallpaper-previous)').forEach(el=>el.dataset.wallpaper=preferences.wallpaper);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',actualTheme()==='light'?'#eeeaf4':'#18171f');
    document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(el=>el.checked=el.value===preferences.theme);
    const reduced=document.querySelector<HTMLInputElement>('#reduce-motion');if(reduced){reduced.checked=motionReduced();reduced.disabled=systemMotion.matches;}
    const wallpaperMotion=document.querySelector<HTMLInputElement>('#wallpaper-motion');if(wallpaperMotion){wallpaperMotion.checked=preferences.wallpaperMotion;wallpaperMotion.disabled=motionReduced();}
    const accent=document.querySelector<HTMLSelectElement>('#accent-palette');if(accent)accent.value=preferences.accent;
    const shape=document.querySelector<HTMLSelectElement>('#icon-shape');if(shape)shape.value=preferences.iconShape;
    const themeState=document.getElementById('quick-theme-state');if(themeState)themeState.textContent=actualTheme()==='dark'?'On':'Off';
    const motionState=document.getElementById('quick-motion-state');if(motionState)motionState.textContent=motionReduced()?'On':'Off';
    document.getElementById('quick-theme')?.setAttribute('aria-pressed',String(actualTheme()==='dark'));
    document.getElementById('quick-motion')?.setAttribute('aria-pressed',String(motionReduced()));
    (document.getElementById('quick-motion') as HTMLButtonElement|null)?.toggleAttribute('disabled',systemMotion.matches);
    document.dispatchEvent(new Event('portfolio-preferences'));
  }
  function showPreview():void {
    const el=document.getElementById('wallpaper-preview');if(el)el.dataset.wallpaper=preview;
    const name=document.getElementById('wallpaper-preview-name');if(name)name.textContent=collections[preview].name;
    document.querySelectorAll<HTMLElement>('[data-wallpaper-choice]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.wallpaperChoice===preview)));
  }
  document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(el=>el.addEventListener('change',()=>{preferences.theme=el.value as DisplayPreferences['theme'];apply();save();}));
  document.querySelector<HTMLInputElement>('#reduce-motion')?.addEventListener('change',event=>{preferences.reducedMotion=(event.target as HTMLInputElement).checked;apply();save();});
  document.querySelector<HTMLInputElement>('#wallpaper-motion')?.addEventListener('change',event=>{preferences.wallpaperMotion=(event.target as HTMLInputElement).checked;apply();save();});
  document.querySelector<HTMLSelectElement>('#accent-palette')?.addEventListener('change',event=>{preferences.accent=(event.target as HTMLSelectElement).value as DisplayPreferences['accent'];apply();save();});
  document.querySelector<HTMLSelectElement>('#icon-shape')?.addEventListener('change',event=>{preferences.iconShape=(event.target as HTMLSelectElement).value as DisplayPreferences['iconShape'];apply();save();});
  document.getElementById('quick-theme')?.addEventListener('click',()=>{preferences.theme=actualTheme()==='dark'?'light':'dark';apply();save();});
  document.getElementById('quick-motion')?.addEventListener('click',()=>{preferences.reducedMotion=!preferences.reducedMotion;apply();save();});
  document.querySelectorAll<HTMLElement>('[data-wallpaper-choice]').forEach(el=>el.addEventListener('click',()=>{preview=el.dataset.wallpaperChoice??'aurora';showPreview();const status=document.getElementById('wallpaper-status');if(status)status.textContent=collections[preview].name+' preview. Select Apply wallpaper to save.';}));
  function commitWallpaper():void {
    wallpaperFade?.cancel();previousWallpaper?.remove();previousWallpaper=null;
    const wallpaper=document.querySelector<HTMLElement>('.os-wallpaper');
    if(wallpaper&&!motionReduced()){
      previousWallpaper=wallpaper.cloneNode(true) as HTMLElement;
      previousWallpaper.className='wallpaper-previous';
      wallpaper.after(previousWallpaper);
    }
    preferences.wallpaper=preview;apply();save();showPreview();
    if(previousWallpaper){
      const fading=previousWallpaper;wallpaperFade=fading.animate([{opacity:1},{opacity:0}],{duration:350});
      wallpaperFade.finished.catch(()=>{}).finally(()=>fading.remove());
    }
    const status=document.getElementById('wallpaper-status');if(status)status.textContent=collections[preview].name+' applied. Your palette is ready.';
  }
  document.getElementById('apply-wallpaper')?.addEventListener('click',commitWallpaper);
  document.getElementById('reset-wallpaper')?.addEventListener('click',()=>{preview='aurora';preferences.accent='wallpaper';commitWallpaper();});
  systemMotion.addEventListener('change',apply);systemTheme.addEventListener('change',apply);apply();showPreview();
  document.querySelector<HTMLSelectElement>('#form-factor')?.addEventListener('change',event=>{const value=(event.target as HTMLSelectElement).value;if(['adaptive','tablet','phone'].includes(value))document.body.dataset.layout=value;});
  function tick():void {
    const now=new Date(),time=new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',hour12:false}).format(now);
    document.querySelectorAll<HTMLElement>('#system-clock,[data-large-clock]').forEach(el=>el.textContent=time);
    document.querySelectorAll<HTMLElement>('[data-local-date]').forEach(el=>el.textContent=new Intl.DateTimeFormat(undefined,{weekday:'long',month:'short',day:'numeric'}).format(now));
  }
  tick();let timer=window.setInterval(()=>{if(!document.hidden)tick();},30000);
  window.addEventListener('pagehide',()=>clearInterval(timer));
  window.addEventListener('pageshow',()=>{clearInterval(timer);tick();timer=window.setInterval(()=>{if(!document.hidden)tick();},30000);});
  document.querySelector('[data-print]')?.addEventListener('click',()=>window.print());
  return {motionReduced};
}
