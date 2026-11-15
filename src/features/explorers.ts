export function initializeExplorers(): { selectSkill:(category:string) => void } {
  const panels=[...document.querySelectorAll<HTMLDetailsElement>('[data-skill-panel]')];
  function selectSkill(category:string):void {
    if(!panels.some(panel=>panel.dataset.skillPanel===category)) category='mobile';
    panels.forEach(panel=>{ panel.hidden=panel.dataset.skillPanel!==category; panel.open=panel.dataset.skillPanel===category; });
    document.querySelectorAll<HTMLAnchorElement>('[data-skill-link]').forEach(link=>{
      if(link.dataset.skillLink===category) link.setAttribute('aria-current','true'); else link.removeAttribute('aria-current');
    });
  }
  selectSkill('mobile');
  document.querySelectorAll<HTMLElement>('[data-architecture]').forEach(explorer=>{
    const buttons=explorer.querySelectorAll<HTMLButtonElement>('[data-node]');
    const details=explorer.querySelectorAll<HTMLElement>('[data-node-detail]');
    function select(index:string):void {
      buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.node===index)));
      details.forEach(detail=>{detail.hidden=detail.dataset.nodeDetail!==index;});
    }
    buttons.forEach(button=>button.addEventListener('click',()=>select(button.dataset.node??'0')));
    select('0');
  });
  const filters=document.querySelectorAll<HTMLButtonElement>('[data-filter]');
  filters.forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.filter;
    let count=0;
    document.querySelectorAll<HTMLElement>('[data-project-kind]').forEach(project=>{
      project.hidden=filter!=='all' && !project.dataset.projectKind?.split(' ').includes(filter??'all');
      if(!project.hidden)count++;
    });
    filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    const status=document.getElementById('filter-status');
    if(status)status.textContent=`${count} ${count===1?'project':'projects'} shown.`;
  }));
  return {selectSkill};
}
