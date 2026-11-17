# Ruzain OS 3.0 — validation, 17 November 2026

## Follow-up — 18 November 2026

Latest portrait replacement: the user's transparent `myPhoto.png` replaces the previous portrait without modifying its pixels. Removed the silhouette mask, grayscale filter and reduced image opacity. Facial detail stays fully visible in natural color, with a CSS fade confined to the lower shirt and a separate text-protection gradient. Mobile text sizing/width keeps the copy beside the face. Both themes at 390px and 1440px passed launcher accessibility audits with zero violations or overflow; build and static checks passed. The earlier silhouette treatment described below is superseded.

Portrait polish: feathered the silhouette and faded the lower edge into the card. Strengthened the theme-aware gradient behind the name, role and experience. Visually inspected card captures at 390px and 1440px in both themes; the four launcher accessibility audits reported zero violations and no document overflow. Production build and all three static checks passed.

The in-device Back controls are now disabled on Home and the Back handler treats the launcher as its root, including after refresh. Native browser history remains available. A regression test covers app → Home → Back/Escape, reload, and subsequent app navigation. The supplied portrait is displayed in the launcher profile card using CSS monochrome styling and an SVG silhouette mask; the source photo is unchanged.

TypeScript, lint, build and the three static checks passed. The browser run passed 24 of 25 checks; the remaining audit sampled a dialog during its opening fade. The audit now waits for finite animations to settle, and it and the new navigation regression passed on retest. Responsive and palette accessibility checks passed. The performance measurements and resource sizes below predate the portrait addition and are historical, not measurements of this follow-up.

## Results

- TypeScript, ESLint, production build and all three static tests passed.
- Chrome: all **24 browser tests passed**. The four affected mobile/fallback tests passed again after the final startup CSS fix.
- Firefox: all **eight OS scenarios passed**. WebKit: eight scenarios verified, with targeted retests confirming corrected search focus return and final wallpaper behavior. These are Playwright engines on Windows, not physical Safari/iOS devices.
- Axe-core: zero automated violations across the checked professional screens, project detail, settings, drawer/search, recents, quick settings and lock screen, including all six wallpaper palettes. Both appearance modes were covered. This does not certify WCAG conformance or replace screen-reader testing.
- Nine screens tested at 320, 390, 768, 1024, 1440 and 2560 CSS px without horizontal document/screen overflow. Emulated mobile touch and natural scrolling passed.
- Original regional resume hashes are unchanged. Actual download events, response bytes, preview and fallback URLs were verified.
- Production dependency audit: zero vulnerabilities. Package versions did not change. Additional Firefox/WebKit test binaries were installed locally.

## Functional coverage

Tests exercise all launcher apps, launcher focus return, interrupted-navigation cleanup, browser Back/Forward, canonical project refresh, skill deep links, scroll restoration, filters, keyboard architecture selection, form-factor reflow, downloads, recruiter printing and page errors during navigation.

OS coverage includes staged wallpaper preview/apply/reset, palettes, icon styles, persistence, system appearance, reduced-motion precedence, keyboard search/result announcements, recent-app resume/dismiss/clear, retained filter state, quick controls, home/status gestures, lock/unlock, PDF preview unloading, featured-gallery navigation and unavailable storage.

Fallbacks were tested with JavaScript disabled, the application bundle blocked and WebGL unavailable. The early layout marker reserves the canonical screen during startup; it expires after four seconds if initialization fails, revealing the full readable document. A delayed-bundle measurement confirmed zero mobile startup shifts after the fix. Content scrolling and browser edge gestures remain native.

The live production page was inspected before implementation. Factual content, original PDFs, canonical URLs, metadata, structured data, sitemap, recruiter access and existing hosting configuration were preserved.

## Lighthouse measurements

Sequential localhost runs used Lighthouse 13.6.0 and installed headless Chrome. Mobile uses default simulated mobile throttling; desktop uses its desktop preset.

| Measurement | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 98 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| First contentful paint | 1.8 s | 0.4 s |
| Largest contentful paint | 1.8 s | 0.4 s |
| Total blocking time | 0 ms | 0 ms |
| Cumulative layout shift | 0 | 0 |
| Speed index | 1.8 s | 0.4 s |

These are local lab observations, not production-network, physical-device, field INP or sustained 60 FPS guarantees. The mobile startup shift found during testing was corrected before final measurements.

Reports: `.qa/os3-lighthouse-{mobile,desktop}.report.{html,json}`. Final screenshots: `.qa/os3-launcher.png`, `os3-mobile.png`, `os3-tablet.png`, `os3-dark.png`, `os3-settings.png`, `os3-projects.png` and `os3-quick-settings.png`. QA files are ignored by Git and excluded from deployment.

## Final resource sizes

Raw files and Node zlib gzip estimates; actual host transfer sizes may differ.

| Resource | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| Home HTML, including static professional content | 137,461 | 19,034 |
| Shared CSS and original CSS wallpapers | 71,701 | 15,190 |
| Initial JavaScript | 21,791 | 7,063 |
| Optional Three.js/core chunk | 554,936 | 139,784 |

No wallpaper image requests, remote fonts or new production dependencies. Inactive apps are hidden from layout and accessibility navigation. PDF previews load on request. Three.js remains architecture-only with a static alternative.

## Reproduce

Use Node 22.19+ (24 recommended), npm and installed Google Chrome:

```sh
npm ci
npm run check
npm run test:browser
npm run preview
```

For Firefox/WebKit, install `npx playwright install firefox webkit`, set `PORTFOLIO_BROWSER` to `firefox` or `webkit`, and run `npx playwright test tests/os.spec.mjs`. Unset it for Chrome. The OS suite excludes Chrome-only PDF printing from the broader regression suite.

With preview running:

```sh
npx lighthouse http://127.0.0.1:4173/ --chrome-flags=--headless --output=json --output=html --output-path=.qa/os3-lighthouse-mobile --only-categories=performance,accessibility,best-practices,seo
npx lighthouse http://127.0.0.1:4173/ --preset=desktop --chrome-flags=--headless --output=json --output=html --output-path=.qa/os3-lighthouse-desktop --only-categories=performance,accessibility,best-practices,seo
```

Set `CHROME_PATH` if automatic discovery fails. Browser tests start the loopback server when needed. The optional development audit harness remains available.

## Limits and deployment

Physical Android/iOS devices, actual screen-reader speech, field INP, sustained frame rates, every hardware/GPU hint and deployed-network performance were not measured. The PDF iframe depends on the browser viewer; original download and new-tab links remain available. Recents are scoped to the current page session. Lock is a visual pause, not authentication. Actual hardware indicators/settings are not controlled.

No Git commit, push, DNS change or production deployment was performed. Generated artifacts remain compatible with the existing GitHub Pages root deployment and `ruzain.online` CNAME. README documents post-deployment checks.

## Preserved resume hashes

| Region | SHA-256 |
| --- | --- |
| India | `B072C2869CD5DD9D6A9DBE2A670ADA45CF11B135FD3F287B5F9EDDB37A3D82CB` |
| GCC | `A311CACCEA229AFBE076F30A24EA3E5C5F9C541D5DC4F426A868A4618FF2F027` |
| Europe | `384C384BA76595CFA7B91EED7A5D2F8984007D04EAE5219BE1AE68B54B6D8547` |
