export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const paths = {
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  signal: '<path d="M4 20v-3m5 3v-7m5 7V9m5 11V4"/>',
  recents: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M3 6v12M21 6v12"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  work: '<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M8 6V3h8v3M3 12h18M10 12v3h4v-3"/>',
  skills: '<path d="m8 5-6 7 6 7m8-14 6 7-6 7m-2-16-4 20"/>',
  experience: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
  resume: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6M8 13h8m-8 4h6"/>',
  contact: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
  about: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
  architecture: '<rect x="8" y="2" width="8" height="6" rx="1"/><rect x="2" y="16" width="7" height="6" rx="1"/><rect x="15" y="16" width="7" height="6" rx="1"/><path d="M12 8v4H5v4m7-4h7v4"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  external: '<path d="M8 4H4v16h16v-4M11 3h10v10M21 3 10 14"/>',
  back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  motion: '<path d="M3 6h12M3 12h7M3 18h12m2-12 5 6-5 6"/>',
  settings: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
  battery: '<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 10v4M5 10h11v4H5z"/>',
  wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r=".5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  award: '<circle cx="12" cy="8" r="5"/><path d="m8 12-2 10 6-3 6 3-2-10"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7zm-10 10 10 5 10-5M2 17l10 5 10-5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  power: '<path d="M12 2v10M6 5a9 9 0 1 0 12 0"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>',
};
export function icon(name, cls = '') { return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.layers}</svg>`; }
export function link(href, label, symbol = 'arrow', cls = 'button') { return `<a class="${cls}" href="${href}">${label}${icon(symbol)}</a>`; }
export function tags(items) { return `<ul class="tags">${items.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`; }
export function screen(id, label, content, description = '') { return `<section class="app-screen" id="${id}" data-screen="${id}" data-title="${escapeHtml(label)}" aria-labelledby="heading-${id}"><header class="screen-heading"><div><p class="eyebrow">RUZAIN / ${escapeHtml(label.toUpperCase())}</p><h2 id="heading-${id}" tabindex="-1">${escapeHtml(label)}</h2>${description?`<p>${description}</p>`:''}</div></header>${content}</section>`; }
