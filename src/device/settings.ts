export interface DisplayPreferences { theme: 'dark'|'light'; reducedMotion: boolean }
export function initializeSettings(): { motionReduced: () => boolean } {
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let preferences: DisplayPreferences = {theme:'dark',reducedMotion:false};
  try {
    const saved: Partial<DisplayPreferences> = JSON.parse(localStorage.getItem('portfolio-display') ?? '{}');
    preferences = {theme:saved.theme==='light'?'light':'dark',reducedMotion:saved.reducedMotion===true};
  } catch { /* Preferences are optional, including in restricted storage contexts. */ }
  const checkbox = document.querySelector<HTMLInputElement>('#reduce-motion');
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
  const motionReduced = (): boolean => preferences.reducedMotion || systemMotion.matches;
  function apply(): void {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.motion = motionReduced()?'reduced':'full';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',preferences.theme==='light'?'#e9efeb':'#111918');
    if (checkbox) { checkbox.checked = motionReduced(); checkbox.disabled = systemMotion.matches; }
    radios.forEach(radio=> { radio.checked=radio.value===preferences.theme; });
    document.dispatchEvent(new Event('portfolio-preferences'));
  }
  function save(): void { try { localStorage.setItem('portfolio-display',JSON.stringify(preferences)); } catch { /* No persistence is required to use the portfolio. */ } }
  radios.forEach(radio=>radio.addEventListener('change',()=>{ preferences.theme=radio.value==='light'?'light':'dark'; apply();save(); }));
  checkbox?.addEventListener('change',()=>{ preferences.reducedMotion=checkbox.checked;apply();save(); });
  systemMotion.addEventListener('change',apply);
  apply();
  const dialogs = document.querySelectorAll<HTMLDialogElement>('.device-dialog');
  function open(id:string):void { dialogs.forEach(dialog=>{ if(dialog.open)dialog.close(); }); document.querySelector<HTMLDialogElement>(id)?.showModal(); }
  document.getElementById('open-more')?.addEventListener('click',()=>open('#more-dialog'));
  document.getElementById('open-settings')?.addEventListener('click',()=>open('#settings-dialog'));
  document.getElementById('more-settings')?.addEventListener('click',()=>open('#settings-dialog'));
  dialogs.forEach(dialog=>{
    dialog.querySelector('[data-close-dialog]')?.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{
      if(event.target!==dialog) return;
      const box=dialog.getBoundingClientRect();
      if(event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom) dialog.close();
    });
  });
  document.querySelector<HTMLSelectElement>('#form-factor')?.addEventListener('change',event=>{
    const select=event.target as HTMLSelectElement;
    if(['adaptive','tablet','phone'].includes(select.value)) document.body.dataset.layout=select.value;
  });
  const clock=document.getElementById('system-clock');
  function tick():void { if(clock) clock.textContent=new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date()); }
  tick();
  let clockInterval = window.setInterval(()=>{if(!document.hidden)tick();},30000);
  window.addEventListener('pagehide',()=>window.clearInterval(clockInterval),{once:true});
  window.addEventListener('pageshow',()=>{
    tick();window.clearInterval(clockInterval);
    clockInterval=window.setInterval(()=>{if(!document.hidden)tick();},30000);
  });
  document.querySelector('[data-print]')?.addEventListener('click',()=>window.print());
  return { motionReduced };
}
