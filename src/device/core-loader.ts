interface DeviceNavigator extends Navigator { connection?:{saveData?:boolean}; deviceMemory?:number }
export function initializeCore(motionReduced:()=>boolean):void {
  const host=document.querySelector<HTMLElement>('#engineering-core');
  if(!host)return;
  const device=navigator as DeviceNavigator;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let loaded=false;
  const observer=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting) || loaded || motionReduced() || matchMedia('(max-width:800px), (pointer:coarse)').matches || device.connection?.saveData || (device.deviceMemory??8)<4 || (device.hardwareConcurrency??4)<4)return;
    loaded=true;
    import('../core').then(module=>{if(!motionReduced())module.mountCore(host,reduced);}).catch(()=>{loaded=false;});
  });
  observer.observe(host);
  // Preference changes preserve a static alternative immediately.
  document.addEventListener('portfolio-preferences',()=>{
    if(motionReduced()) host.dispatchEvent(new Event('portfolio-static-core'));
  });
}
