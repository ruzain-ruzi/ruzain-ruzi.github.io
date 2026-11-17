# Validation — 15 November 2026

## Completed

- `npm run check`: strict TypeScript, ESLint, production build, and all three static tests passed after the final startup-layout fix.
- Browser regression suite: 15 tests passed after that fix; the newly added blocked-script fallback test also passed separately (16 tests total). Chrome with Playwright was used.
- Functional coverage: application navigation, browser Back/Forward, direct skill links, canonical project reloads, scroll restoration, project filters, keyboard architecture selection, mobile touch navigation, Escape/focus return, theme persistence, form-factor reflow, reduced motion, recruiter printing, and all three real PDF downloads.
- Fallback coverage: JavaScript disabled, application bundle blocked, and WebGL unavailable. A small early layout marker prevents the unenhanced document from flashing before initialization; it expires after four seconds if the application bundle fails, restoring the complete readable document.
- Responsive checks: eight screens at 320, 390, 768, 1024, 1440, and 2560 CSS px; no horizontal document overflow. Desktop, mobile, tablet, project, skills, resume, contact, and architecture screenshots inspected. Desktop architecture successfully rendered WebGL; mobile retained the static alternative.
- Axe-core 4.14.0: zero automated violations across nine screens, a project detail, settings, and light mode for the configured WCAG A/AA and best-practice rules. This does not certify WCAG conformance or replace screen-reader and human review.
- Static tests resolve local links, fragments, assets, and metadata across six generated pages, check unique IDs and one h1 per page, parse JSON-LD, check sitemap coverage/career facts, and validate distinct regional PDFs.
- Regional download responses are valid PDFs and byte-identical to repository originals. Their SHA-256 hashes match the supplied resume files.
- `npm audit`: zero vulnerabilities including development dependencies. `git diff --check`: passed; only ordinary Windows line-ending notices.

## Lighthouse lab measurements

Final local homepage runs used Lighthouse 13.6.0 with headless installed Chrome. Mobile uses Lighthouse's default simulated mobile throttling; desktop uses its desktop preset. Runs were sequential, after browser tests finished.

| Measurement | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| First contentful paint | 1.5 s | 0.4 s |
| Largest contentful paint | 1.5 s | 0.4 s |
| Total blocking time | 0 ms | 0 ms |
| Cumulative layout shift | 0 | 0 |
| Speed index | 1.5 s | 0.5 s |

An earlier desktop run exposed a startup shift between fallback and enhanced layouts; the early layout marker fixed it. These are localhost lab results, not deployed-network, field INP, physical-device, or production Core Web Vitals guarantees.

Reports are in ignored `.qa/lighthouse-{mobile,desktop}.report.html` and `.json`. Browser artifacts and screenshots are also in `.qa/`; recruiter print output is `.qa/recruiter-print.pdf`.

## Final resource sizes

Node zlib gzip estimates, not actual GitHub Pages transfers:

| Resource | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| Home HTML (all static screen content) | 104,971 | 14,843 |
| Shared CSS | 48,045 | 10,348 |
| Initial JavaScript | 9,436 | 3,466 |
| Optional Three.js/core chunk | 554,936 | 139,784 |

System fonts avoid remote font requests. The CSS device shell and static architecture diagram do not require Three.js. Its optional chunk loads only in Architecture on suitable devices; reduced motion, small/coarse pointers, save-data and low hardware hints prevent loading. Geometry renders on demand with visibility checks. Every hardware-hint combination and WebGL context loss was not separately tested.

## Reproduce

Use Node 22.19+ (24 recommended), npm, and installed Google Chrome:

```sh
npm ci
npm run check
npm run test:browser
npm run preview
```

With preview running, in a separate terminal:

```sh
npx lighthouse http://127.0.0.1:4173/ --chrome-flags=--headless --output=json --output=html --output-path=.qa/lighthouse-mobile --only-categories=performance,accessibility,best-practices,seo
npx lighthouse http://127.0.0.1:4173/ --preset=desktop --chrome-flags=--headless --output=json --output=html --output-path=.qa/lighthouse-desktop --only-categories=performance,accessibility,best-practices,seo
```

Set `CHROME_PATH` if automatic Chrome discovery fails. The optional local `node scripts/serve.mjs --audit` harness remains available at `/__audit`; it is excluded from deployment.

## Limits and deployment

Safari, Firefox, actual screen-reader speech, physical phones, real mid-range GPUs, field INP, and deployed performance were not tested. Touch and reduced motion were browser-emulated. Keep availability and relocation preferences current; credential issuer URLs were not supplied.

No Git commit, push, DNS change, or production deployment was performed. The generated files remain ready for the existing GitHub Pages configuration and `ruzain.online` CNAME. Follow README deployment checks after publishing.

## Preserved resume hashes

| Region | SHA-256 |
| --- | --- |
| India | `B072C2869CD5DD9D6A9DBE2A670ADA45CF11B135FD3F287B5F9EDDB37A3D82CB` |
| GCC | `A311CACCEA229AFBE076F30A24EA3E5C5F9C541D5DC4F426A868A4618FF2F027` |
| Europe | `384C384BA76595CFA7B91EED7A5D2F8984007D04EAE5219BE1AE68B54B6D8547` |
