import { Scene, PerspectiveCamera, WebGLRenderer, Group, Mesh, BoxGeometry, MeshStandardMaterial, MeshPhysicalMaterial, AmbientLight, DirectionalLight, PointLight, EdgesGeometry, LineSegments, LineBasicMaterial, CylinderGeometry, PlaneGeometry, ShadowMaterial, PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Procedural geometry, no downloaded models/textures and no continuous loop. */
export function mountCore(host: HTMLElement, reducedMotion: MediaQueryList): void {
  const container = host.querySelector<HTMLElement>('.core-canvas');
  if (!container || reducedMotion.matches) return;
  let renderer: WebGLRenderer;
  try { renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  const scene = new Scene();
  const camera = new PerspectiveCamera(33, 1, .1, 40);
  camera.position.set(6.5, 5.7, 7.5);
  camera.lookAt(0, .25, 0);
  const system = new Group();
  system.rotation.y = -.18;
  scene.add(system);
  const board = new MeshStandardMaterial({ color: 0x42634e, roughness: .33, metalness: .6 });
  const edge = new MeshStandardMaterial({ color: 0x9cb8a0, roughness: .3, metalness: .65 });
  const dark = new MeshStandardMaterial({ color: 0x182b20, roughness: .45, metalness: .35 });
  const light = new MeshStandardMaterial({ color: 0xaccbb0, emissive: 0x294f33, emissiveIntensity: .5, roughness: .3, metalness: .4 });
  const glass = new MeshPhysicalMaterial({ color: 0xa6cdb1, transparent: true, opacity: .28, roughness: .17, metalness: .25, depthWrite: false });
  const layers: Group[] = [];
  const levels = [-1.2, -.37, .54, 1.48];
  for (let index = 0; index < 4; index++) {
    const layer = new Group();
    layer.position.y = levels[index];
    const width = index === 0 || index === 3 ? 3.15 : 2.86;
    const shape = new RoundedBoxGeometry(width, index === 0 ? .22 : .12, width * .8, 2, .07);
    const plate = new Mesh(shape, index === 3 ? glass : board);
    plate.castShadow = index !== 3;
    plate.receiveShadow = true;
    layer.add(plate);
    const outline = new LineSegments(new EdgesGeometry(new BoxGeometry(width - .07, .08, width * .8 - .07)), new LineBasicMaterial({ color: index === 3 ? 0xb7d9bf : 0x90b69b, transparent: true, opacity: .7 }));
    layer.add(outline);
    if (index < 3) {
      for (const x of [-1, 1]) for (const z of [-.8, .8]) {
        const screw = new Mesh(new CylinderGeometry(.045, .045, .025, 8), edge);
        screw.position.set(x * 1.2, .09, z * 1.2);
        layer.add(screw);
      }
    }
    if (index === 2) {
      const chip = new Mesh(new RoundedBoxGeometry(.85, .22, .85, 2, .045), dark);
      chip.position.y = .16; chip.castShadow = true; layer.add(chip);
      const cap = new Mesh(new BoxGeometry(.66, .035, .66), light);
      cap.position.y = .29; layer.add(cap);
      for (let pin = 0; pin < 8; pin++) {
        for (const sign of [-1, 1]) {
          const contact = new Mesh(new BoxGeometry(.055, .035, .17), edge);
          contact.position.set((pin - 3.5) * .095, .105, sign * .48); layer.add(contact);
          const trace = new Mesh(new BoxGeometry(.018, .012, .35), light);
          trace.position.set((pin - 3.5) * .095, .075, sign * .73); layer.add(trace);
        }
      }
    }
    if (index === 1) {
      for (let n = 0; n < 4; n++) {
        const module = new Mesh(new BoxGeometry(.7, .09, .37), dark);
        module.position.set((n % 2 ? 1 : -1) * .54, .12, (n < 2 ? -1 : 1) * .4);
        module.castShadow = true; layer.add(module);
      }
    }
    if (index === 0) {
      for (let n = 0; n < 10; n++) {
        const port = new Mesh(new BoxGeometry(.08, .045, .25), edge);
        port.position.set((n - 4.5) * .18, .13, 1.01); layer.add(port);
      }
    }
    layers.push(layer); system.add(layer);
  }
  // Four structural posts visually connect the isolated responsibilities.
  for (const x of [-1.18, 1.18]) for (const z of [-.94, .94]) {
    const post = new Mesh(new CylinderGeometry(.018, .018, 2.7, 6), edge);
    post.position.set(x, .14, z); system.add(post);
  }
  const ambient = new AmbientLight(0xc7e0ce, 2); scene.add(ambient);
  const key = new DirectionalLight(0xe5f5d9, 4.5); key.position.set(-3, 7, 5); key.castShadow = true;
  key.shadow.mapSize.set(512, 512); key.shadow.camera.left = -5; key.shadow.camera.right = 5; key.shadow.camera.top = 5; key.shadow.camera.bottom = -5; key.shadow.bias = -.002; scene.add(key);
  const rim = new PointLight(0x96d4b1, 35, 20); rim.position.set(4, 2, -3); scene.add(rim);
  const ground = new Mesh(new PlaneGeometry(18, 18), new ShadowMaterial({ opacity: .2 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -1.5; ground.receiveShadow = true; scene.add(ground);
  let visible = true;
  let disposed = false;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  const resetButton = host.querySelector<HTMLButtonElement>('.core-reset');
  function render(): void {
    frame = 0;
    if (disposed || !visible || document.hidden || reducedMotion.matches) return;
    const progress = Math.min(1, Math.max(0, -host.getBoundingClientRect().top / window.innerHeight));
    system.rotation.y = -.18 + pointerX * .16 + progress * .25;
    system.rotation.x = pointerY * .07;
    layers.forEach((layer, index) => { layer.position.y = levels[index] * (1 - progress * .19); });
    renderer.render(scene, camera);
  }
  function requestRender(): void {
    if (!frame && !disposed && visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(render);
  }
  function resize(): void {
    if (!container || disposed) return;
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); requestRender();
  }
  function move(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    const rect = host.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - .5) * 2;
    pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2; requestRender();
  }
  function reset(): void { pointerX = 0; pointerY = 0; requestRender(); }
  function changeMotion(): void { if (reducedMotion.matches) dispose(); }
  function contextLost(event: Event): void { event.preventDefault(); dispose(); }
  const visibility = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; requestRender(); });
  const sizeObserver = new ResizeObserver(resize);
  function dispose(): void {
    if (disposed) return;
    disposed = true; cancelAnimationFrame(frame);
    host.classList.remove('webgl-ready');
    if (resetButton) resetButton.hidden = true;
    sizeObserver.disconnect(); visibility.disconnect();
    host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', reset);
    window.removeEventListener('scroll', requestRender); window.removeEventListener('pagehide', dispose);
    document.removeEventListener('visibilitychange', requestRender); reducedMotion.removeEventListener('change', changeMotion);
    resetButton?.removeEventListener('click', reset);
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    scene.traverse(object => {
      if (object instanceof Mesh || object instanceof LineSegments) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => material.dispose());
      }
    });
    renderer.dispose(); renderer.domElement.remove();
  }
  try {
    container.append(renderer.domElement); resize(); render(); host.classList.add('webgl-ready');
    if (resetButton) resetButton.hidden = false;
    visibility.observe(host); sizeObserver.observe(container);
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', requestRender, { passive: true });
    document.addEventListener('visibilitychange', requestRender);
    reducedMotion.addEventListener('change', changeMotion); window.addEventListener('pagehide', dispose, { once: true });
    resetButton?.addEventListener('click', reset); renderer.domElement.addEventListener('webglcontextlost', contextLost);
  } catch { dispose(); }
}
