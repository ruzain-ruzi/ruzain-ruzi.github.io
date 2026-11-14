# Ruzain Abdurahman — Engineering Portfolio

A static portfolio for Android and mobile systems engineering, with original procedural 3D, four project case studies, and three regional resume downloads.

## Develop and validate

Use **Node 22.13+ (Node 24 recommended)** and a current npm. The machine's default Node 18.12 is too old for this toolchain; this implementation was checked with bundled Node 24.22.1.

```sh
npm ci
npm run check
npm run preview
```

Open `http://127.0.0.1:4173`. Preview binds to loopback only. Re-run `npm run build` after editing TypeScript, templates, or content, then reload the browser. CSS changes need only a reload. `npm run check` runs strict type checking, ESLint, the production build, and route/content tests. No environment secrets are needed.

## Architecture and editing

- `src/content.mjs`: professional profile, project narratives, expertise, and resume regions.
- `scripts/build.mjs`: shared semantic HTML templates, metadata, structured data, sitemap, and esbuild bundling.
- `src/main.ts`: responsive navigation, focus management, active-section indicator, architecture explorer, and lazy enhancement loading.
- `src/core.ts`: event-driven Three.js scene with procedural geometry, physical materials, shadows, device checks, lifecycle cleanup, and static fallback.
- `assets/site.css`: shared responsive design system and print/reduced-motion rules. Tokens at the top define ink, ivory, teal, lines, surfaces, fonts, and content width.
- `assets/core.svg`: static core illustration used without JS/WebGL and on constrained devices.
- `assets/social-preview.png`: 1200 x 630 social preview.
- `resumes/`: unchanged India, GCC, and Europe PDFs, including their original contact information.
- `index.html`, `work/*.html`, `404.html`, `assets/main.js`, `assets/chunks/*`, `sitemap.xml`, `robots.txt`: generated deployable files. Commit generated files alongside source changes.
- `docs/AUDIT.md`: repository audit, resume reconciliation, factual boundaries, and design/stack decisions.
- `docs/VALIDATION.md`: completed checks and measurement limits.

Stack: static HTML/CSS, strict TypeScript 6.0.3, esbuild 0.28.2, and Three.js 0.187.0. TypeScript 6 is the newest stable major compatible with the current TypeScript ESLint peer range; TypeScript 7 is deliberately not forced into an unsupported pairing. A scoped minimatch override addresses a tooling dependency advisory; review it when upgrading TypeScript ESLint.

There is no React hydration, backend, contact form, analytics, remote font request, or model download. The initial interaction script is small; the 3D module loads separately only on suitable devices. The scene renders on pointer/scroll/resize changes, skips hidden/offscreen work, and has no continuous animation loop. Pixel ratio is capped at 1.5; the shadow map is 512px. Small/coarse-pointer, reduced-motion, low-memory/core-count and save-data devices use the static visual. WebGL failure or context loss restores the fallback.

Core content, native disclosures, resume links, and case-study routes work without JavaScript. Navigation stays visible without JS. Architecture controls enhance a conceptual diagram; the no-script alternative describes its other layers.

## Deploy with the existing GitHub Pages configuration

1. Run `npm ci` and `npm run check` with a supported Node version.
2. Review and commit source, generated pages/bundles, assets, lockfile, and regional resumes.
3. Push to the branch already selected in this repository's GitHub Pages settings. Retain its root-folder publishing configuration.
4. GitHub Pages serves committed root assets through the existing Jekyll setup. No Node build is required on the host. `_config.yml` retains Cayman and excludes development sources; `CNAME` remains `ruzain.online`.
5. Check the home page, four `/work/*.html` routes, three PDFs, sitemap, and a missing route on `https://ruzain.online` after deployment.

This task does not push or change the hosting destination. Root-relative paths target this custom-domain/user-site deployment; a future repository-subpath deployment needs a base-path option. The old root resume remains for existing external links but is no longer promoted; archive or redirect it intentionally when ready.

## Content maintenance

Keep the historical role title **Android Developer** and dates **Jan 2023–Oct 2026**. Do not increment tenure after employment ended. Update availability when it changes. Role-wide metrics must not become project-specific metrics. Do not add skills, credential links, or screenshots without supporting evidence. Original illustrations are explicitly conceptual.

The prior uncommitted page was preserved outside the public repository at `D:\portfolio\portfolio-backups\index.before-redesign-2026-11-15.html`. No existing images or original resume were deleted.
