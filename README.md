# Ruzain OS 3.0

Ruzain Abdurahman’s Android-inspired portfolio launcher: colorful applications, widgets, six original wallpapers, personalization, recent apps, local search, quick settings, and real engineering case studies. Desktop uses a landscape device; mobile fills the available viewport. Recruiter view stays one click away.

## Run

Use **Node 22.19+ (Node 24 recommended)** and npm. The system Node 18 is too old.

```sh
npm ci
npm run check
npm run test:browser
npm run preview
```

Open `http://127.0.0.1:4173`. Preview binds only to loopback. Rebuild after editing source. Generated HTML/CSS/JS are committed with the source so GitHub Pages does not need a Node build.

Tests use installed Google Chrome with Playwright. Optional cross-engine checks:

```sh
npx playwright install firefox webkit
```

Set `PORTFOLIO_BROWSER=firefox` or `PORTFOLIO_BROWSER=webkit` in your shell, then run `npx playwright test tests/os.spec.mjs`. WebKit automation is not physical Safari/iOS testing. Unset the variable to return to Chrome. Reports, traces, screenshots and local Lighthouse results live in ignored `.qa/`.

## Explore

- Click a launcher app or dock icon. Home returns to its launcher icon; Back uses portfolio/browser history.
- The bottom handle supports upward drag: Home from an app, All apps from the launcher. Buttons provide keyboard and mouse alternatives. Vertical content scrolling remains native.
- All apps or `/` opens local search. Arrow keys navigate results; Enter opens; Escape closes overlays or goes back from an app.
- Recents resumes visited apps, retaining their state in the current document. Dismiss and Clear remove shortcuts only.
- The status button or downward drag on the status region opens quick settings. Its notifications are portfolio shortcuts, not messages from other services.
- Settings previews/applies wallpapers, chooses a compatible accent, changes icon shape, respects system appearance and reduced motion, and optionally enables gentle wallpaper drift.
- The side power button or quick settings opens an optional visual lock screen. It starts unlocked; Unlock or Escape resumes the portfolio.
- Resume cards preview the actual PDFs and retain direct original downloads and new-tab fallback links.

## Architecture and content

Semantic static HTML, strict TypeScript, CSS container queries, native dialogs, Web Animations, esbuild, and an optional lazy Three.js module. No React/Next migration or new production dependency was introduced. All professional screens remain in generated HTML; without JavaScript, the site becomes a readable document with working links and downloads.

Primary routes: `/#home`, `/#about`, `/#work`, `/#expertise`, `/#experience`, `/#architecture`, `/#resumes`, `/#contact`, `/#settings`, `/#recruiter`. Legacy anchors and `/#skill-*` destinations remain. Four canonical `/work/<slug>.html` pages are independently accessible. Modified-click/open-in-new-tab retains native browser behavior.

The factual profile and projects remain in `src/content.mjs`, with skill evidence in `src/data/skills.mjs`. Build-time components are in `scripts/components/`; runtime OS interactions in `src/os/controller.ts`; personalization in `src/device/settings.ts`; routing in `src/main.ts` and `src/navigation.ts`; visual styles in `src/styles/`.

See [OS 3 implementation notes](docs/RUZAIN-OS-3.md), [validation](docs/VALIDATION.md), and [original resume reconciliation](docs/AUDIT.md). `docs/PORTFOLIO-OS.md` records the previous OS 2 design and is historical.

## Deploy with existing GitHub Pages

1. Run the checks above with supported Node and Chrome.
2. Review and commit source, generated pages/assets, configuration and tests together.
3. Push to the branch already configured in GitHub Pages, preserving root-folder publishing.
4. Keep `CNAME` as `ruzain.online`; `_config.yml` excludes development files and preserves the existing configuration.
5. Verify launcher, app routes, browser Back/Forward, canonical project pages, all three PDF downloads, sitemap and 404 on the deployed domain.

The task does not change hosting, DNS, or production publication. Root-relative links target the existing custom domain/user-site deployment; a repository-subpath deployment would need a base-path option.

## Maintenance

Preserve original regional PDFs under `resumes/` and the old root resume for existing links. Career dates are Jan 2023–Oct 2026; do not increment the completed tenure. Keep availability and relocation preferences current. Role-wide outcomes must not become per-project metrics. KMP remains early shared-code work; unsupported CameraX/ML Kit/QR/kiosk claims remain excluded. Conceptual artwork is not a production screenshot. Website technologies are not new career claims.
