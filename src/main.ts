export {};
const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#nav-links');
const mobile = matchMedia('(max-width: 800px)');
function setMenu(open: boolean): void {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.hidden = mobile.matches && !open;
}
function syncMenu(): void {
  if (!menuButton) return;
  menuButton.hidden = !mobile.matches;
  setMenu(false);
}
syncMenu();
mobile.addEventListener('change', syncMenu);
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation?.addEventListener('click', event => {
  if (!(event.target instanceof HTMLAnchorElement) || !mobile.matches) return;
  setMenu(false);
  const hash = event.target.hash;
  const section = hash ? document.querySelector<HTMLElement>(hash) : null;
  if (section) {
    section.setAttribute('tabindex', '-1');
    section.focus({ preventScroll: true });
    section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

// The currently visible navigation section; no scroll interception.
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('.nav-links a')];
const sections = navLinks.map(link => document.querySelector<HTMLElement>(link.hash)).filter((section): section is HTMLElement => section !== null);
if ('IntersectionObserver' in window) {
  const visibleSections = new Set<Element>();
  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    }
    const current = [...visibleSections].sort((a, b) => Math.abs(a.getBoundingClientRect().top - 150) - Math.abs(b.getBoundingClientRect().top - 150))[0];
    for (const link of navLinks) {
      if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }, { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
}

const layers = [
  { label: 'LAYER 01 / INTERACTION', title: 'The device is part of the experience.', description: 'Transit ticketing brings application workflows together with NFC cards and specialized Android POS terminals. The user-facing flow and the hardware integration need to work as one system.', principle: 'Keep device-specific concerns separate from application behavior, so each responsibility can be reasoned about clearly.' },
  { label: 'LAYER 02 / PERSISTENCE', title: 'Connectivity should not define continuity.', description: 'My offline-first work uses Room and WorkManager. Local persistence supports work in zero- or low-connectivity environments, including transit ticketing and enterprise field operations.', principle: 'Treat local data as an explicit application responsibility. Decide what can continue offline and make connectivity-related states understandable to the user.' },
  { label: 'LAYER 03 / CONNECTIVITY', title: 'Reconnect with a clear responsibility.', description: 'WorkManager supports background work in my offline-first systems. Ledger synchronization in Chandini DSR is another example of connecting field activity with business records as the application moves between local and connected operation.', principle: 'Separate background synchronization from the foreground interaction. Model failures and retries deliberately; a network request is not itself proof that a payment has settled.' }
];
const layerButtons = document.querySelectorAll<HTMLButtonElement>('[data-layer]');
for (const button of layerButtons) {
  button.addEventListener('click', () => {
    const layer = layers[Number(button.dataset.layer)];
    if (!layer) return;
    layerButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const updates: Record<string, string> = { 'layer-number': layer.label, 'layer-title': layer.title, 'layer-description': layer.description, 'layer-principle': layer.principle };
    for (const [id, text] of Object.entries(updates)) {
      const element = document.getElementById(id);
      if (element) element.textContent = text;
    }
  });
}

interface NetworkNavigator extends Navigator { connection?: { saveData?: boolean }; deviceMemory?: number }
const device = navigator as NetworkNavigator;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const core = document.querySelector<HTMLElement>('#engineering-core');
const suitableDevice = !matchMedia('(max-width: 800px), (pointer: coarse)').matches && !device.connection?.saveData && (device.deviceMemory ?? 8) >= 4 && (device.hardwareConcurrency ?? 4) >= 4;
if (core && suitableDevice && !reducedMotion.matches && 'IntersectionObserver' in window) {
  const lazyObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    lazyObserver.disconnect();
    // Wait until the page has loaded; preserve the static visual on any failure.
    const load = (): void => {
      if (reducedMotion.matches) return;
      import('./core').then(module => module.mountCore(core, reducedMotion)).catch(() => { /* Static fallback remains visible. */ });
    };
    if (document.readyState === 'complete') setTimeout(load, 700);
    else window.addEventListener('load', () => setTimeout(load, 700), { once: true });
  }, { rootMargin: '0px' });
  lazyObserver.observe(core);
}
