# Ruzain Abdurahman — Portfolio OS

An Android-inspired portfolio with a landscape desktop device, adaptive tablet layout, and full-width mobile interface. It is a real HTML application, not an emulator or a canvas-rendered website.

## Run and validate

Use **Node 22.19+ (Node 24 recommended)** and a current npm. The system Node 18.12 is too old; this work used the bundled Node 24.22.1 runtime.

```sh
npm ci
npm run check
npm run test:browser
npm run preview
```

Open `http://127.0.0.1:4173`. The preview server binds only to loopback. Rebuild after editing TypeScript, templates, content, or CSS. Generated files are committed so GitHub Pages does not need a Node build.

Browser tests use the installed Google Chrome channel with Playwright. On another machine, install Chrome or change `channel` in `playwright.config.mjs` to an installed Playwright browser. Tests start the local server if one is not already running. Reports, traces, screenshots, and local audit artifacts live in ignored `.qa/`.

## Application architecture

- `src/content.mjs`: unchanged factual source model for profile, projects, expertise, and three resume regions.
- `src/data/skills.mjs`: verified capability categories and evidence-backed project associations.
- `scripts/components/device.mjs`: device frame, adaptive navigation, status bar, settings, and More dialog.
- `scripts/components/screens.mjs`: home, about, expertise, experience, project library/details, architecture, resumes, contact, and recruiter screens.
- `scripts/components/ui.mjs`: reusable semantic controls, icons, screen headings, and tag lists.
- `scripts/components/project-art.mjs`: preserved conceptual project illustrations. These are never presented as production screenshots.
- `src/main.ts`: application orchestration, URL navigation, history entries, focus, metadata, and scroll restoration.
- `src/navigation.ts`: allowlisted route resolution and legacy-anchor aliases.
- `src/features/explorers.ts`: skills, project filters, and selectable architecture responsibilities.
- `src/device/settings.ts`: theme, reduced-motion preferences, native accessible dialogs, clock, and form-factor controls.
- `src/device/core-loader.ts`, `src/core.ts`: optional lazy Three.js engineering core inside Architecture. The device itself requires no WebGL.
- `src/styles/device.css`: theme tokens, device frame, adaptive component layouts, reduced-motion and print rules.
- `src/styles/illustrations.css`: preserved project artwork styles.
- `scripts/build.mjs`: static HTML generation, CSS minification, split TypeScript compilation, metadata, and sitemap.
- `tests/portfolio.spec.mjs`: browser-level functional, responsive, accessibility, fallback, and download tests.

Stack: semantic static HTML, CSS container queries, strict TypeScript 6.0.3, esbuild 0.28.2, and optional Three.js 0.187.0. The existing static deployment and content model were retained instead of introducing React hydration or a framework/server migration. TypeScript 6 is compatible with the current ESLint peer range. A scoped minimatch override addresses a tooling advisory.

## Navigation and progressive enhancement

Primary screen URLs: `/#home`, `/#work`, `/#expertise`, `/#experience`, `/#about`, `/#architecture`, `/#resumes`, `/#contact`, `/#recruiter`.

Skill deep links include `/#skill-data`, `/#skill-hardware`, and `/#skill-cross-platform`. Existing `#projects`, `#skills`, and `#credentials` anchors are retained. Each `/work/<slug>.html` is a complete static, canonical case-study page and opens that project immediately. Internal links update the browser URL without reloading; Ctrl/Cmd-click and open-in-new-tab retain native behavior. Browser Back/Forward and the in-device Back button restore meaningful destinations and scroll positions.

Content is present in generated HTML. Without JavaScript, the portfolio becomes a readable document with navigation, native disclosures, diagrams, links, and downloads. The immersive interface shows one screen at a time after enhancement. Recruiter view presents a compact document and provides print styling.

Desktop scrolls the content pane inside a stable device. Mobile uses natural document scrolling and fixed bottom navigation. Container queries genuinely rearrange the interface for desktop smartphone/tablet previews. No custom swipe interception, audio, forced lock screen, fake notifications, or forms are included. The clock uses browser-local time; network and battery symbols are explicitly illustrative.

Preferences are stored locally when storage is available. OS reduced motion is always respected. Native dialogs support Escape, focus containment, and focus return. The CSS shell stays stable during interaction. Three.js is loaded only in Architecture on suitable devices; rendering is event-driven, pixel ratio is capped, and a static SVG remains usable without WebGL.

## Deploy through existing GitHub Pages

1. Run `npm ci`, `npm run check`, and `npm run test:browser` with supported Node and Chrome.
2. Review and commit source, generated HTML/CSS/JS, assets, lockfile, and resumes.
3. Push to the branch already selected in GitHub Pages, keeping its root-folder publishing configuration.
4. Keep `CNAME` as `ruzain.online`. `_config.yml` retains the existing Jekyll theme and excludes development/test sources. Generated HTML has no Jekyll front matter and uses the custom design directly.
5. Verify all main screens, browser Back/Forward, four `/work/*.html` routes, three PDF downloads, sitemap, and 404 on the deployed domain.

No hosting destination, DNS, or production publication was changed by this task. Root-relative URLs target the existing custom-domain/user-site deployment; a future repository-subpath deployment requires a base-path option.

## Content and maintenance

Original regional PDFs remain under `resumes/`, unchanged. The old root PDF remains for existing external links. The historical employer title is Android Developer, with dates Jan 2023–Oct 2026. Do not increment tenure after that end date. Update availability when it changes. Role-wide metrics must not become individual project metrics.

Only resume-supported skills and projects are displayed. KMP is scoped to early shared-code initiatives; CameraX, QR scanning, ML Kit, and kiosk claims remain excluded. Case-study diagrams show conceptual responsibilities, not confidential implementation blueprints. Certifications have no invented verification links.

See `docs/AUDIT.md` for the original resume reconciliation, `docs/PORTFOLIO-OS.md` for this evolution's decisions, and `docs/VALIDATION.md` for measured results and remaining limits. The earlier uncommitted original page backup remains outside the public repository at `D:\portfolio\portfolio-backups\index.before-redesign-2026-11-15.html`.
