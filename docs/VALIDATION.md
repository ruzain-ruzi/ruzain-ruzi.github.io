# Validation — 15 November 2026

## Completed

- `npm run check`: passed strict TypeScript checking, ESLint, production generation/bundling, and all three Node test suites.
- Tests resolve every local link, fragment, stylesheet, script, and image across six generated pages; check unique IDs, one h1 per page, JSON-LD parsing, canonical/description metadata, sitemap coverage, career dates, and distinct valid regional PDFs.
- `npm audit`: **0 vulnerabilities**, including development dependencies, after a scoped minimatch override and clean dependency resolution.
- `git diff --check`: passed (Git emits only normal Windows line-ending conversion notices).
- HTTP checks: home, all four case studies, all three PDFs, sitemap and robots returned 200. A missing path returned the custom 404 response.
- All three regional PDF SHA-256 hashes match their original files exactly.
- Browser: desktop WebGL canvas rendered successfully with no captured console warnings/errors in the checked preview. Static fallback rendered on mobile. Desktop and small-phone screenshots were inspected; ticket and TV illustrations were corrected after mobile review.
- Responsive checks: home inspected at 320, 390, 768, 1440, and 2560 CSS px. No horizontal document overflow at the checked widths. Transit case study also checked at 320, 768, and 1920px. Browser viewport overrides were used; this is not physical-device testing.
- Interaction checks: mobile Menu opens; Escape closes it; section navigation closes the menu and transfers focus to the selected section. Architecture layer selection updates text; Enter activates a layer with visible focus. Mobile project links navigate to dedicated case studies.
- Axe-core 4.14.0: **zero automated violations** on the home page and all four case studies for WCAG A/AA tags through 2.2 plus best-practice rules. Home recorded 41 passing rules; each case study recorded 32. Some contrast checks on transformed/layered/decorative artwork were incomplete and require human review. This is not a WCAG conformance certification.

## Size measurements

Measured with Node zlib gzip on final local files; these are compressed file estimates, not actual GitHub Pages transfer measurements.

| Resource | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| Home HTML | 21,576 | 6,580 |
| Shared CSS | 36,969 | 7,628 |
| Initial JavaScript | 3,794 | 1,839 |
| Optional Three.js/core chunk | 554,710 | 139,765 |

The static SVG core does not require Three.js. System fonts avoid third-party font downloads. The optional WebGL module uses no external textures/models and is skipped for reduced-motion, small/coarse-pointer, save-data, low-memory, and low-core-count devices. Geometry renders on demand; rendering work checks intersection and document visibility. These lifecycle paths were reviewed in source, but reduced-motion changes, context loss, and each hardware constraint were not independently emulated in-browser.

## Reproduce browser accessibility checks

Run `node scripts/serve.mjs --audit` after `npm ci` and `npm run build`, then open:

- `http://127.0.0.1:4173/__audit`
- `http://127.0.0.1:4173/__audit?page=work/onedi-transit.html`

The local-only harness adds axe to the requested page and appends JSON results in `#accessibility-audit`. It is not injected into production HTML. The development server and scripts are excluded from Pages publishing. Local review images and machine-readable audits are in ignored `.qa/`.

## Not measured / follow-up

- Lighthouse, LCP, CLS, INP, real-network transfer sizes, and deployed Core Web Vitals were not measured. No target scores or field performance results are claimed.
- Safari, Firefox, screen-reader speech output, actual low-end GPUs, physical phones, and browser-emulated reduced-motion changes were not tested. Test these before claiming complete cross-browser or WCAG coverage.
- Confirm credentials with issuer URLs when available; none were supplied. Maintain current availability and relocation preferences as circumstances change.
- No Git push or production deployment was performed. Run the post-deploy checks in README after publishing through the existing GitHub Pages configuration.

## Preserved resume hashes

| Region | SHA-256 |
| --- | --- |
| India | `B072C2869CD5DD9D6A9DBE2A670ADA45CF11B135FD3F287B5F9EDDB37A3D82CB` |
| GCC | `A311CACCEA229AFBE076F30A24EA3E5C5F9C541D5DC4F426A868A4618FF2F027` |
| Europe | `384C384BA76595CFA7B91EED7A5D2F8984007D04EAE5219BE1AE68B54B6D8547` |
