# Portfolio 2.0 — Android device experience

## Audit and reuse

The starting checkout was clean at `0a1cd60`. It already contained static generated pages, strict TypeScript interactions, Four resume-backed case studies, an optional Three.js core, project illustrations, regional PDFs, a local preview server, and automated static checks. The original PDF reconciliation in `AUDIT.md` remains authoritative; all three current resume hashes still match the source files. No new professional claims were inferred from the device concept.

Retained: profile/project source data, original regional resume files, canonical case-study paths, contact destinations, original favicon assets, custom domain, GitHub Pages/Jekyll deployment, conceptual project art, and the optional engineering core. The old linear scrolling presentation became a real application shell. Existing project and skills anchors remain aliases.

## Experience architecture

- Desktop: graphite landscape device with metallic edge, restrained shadow, status bar, application toolbar, navigation rail, and one scrolling content pane.
- Tablet: rail retained with fewer content columns and repositioned context panels. Container queries adapt content to the actual display width.
- Mobile: frame becomes edge-to-edge, body scrolling stays native, a sticky toolbar and bottom navigation maintain orientation, and More exposes secondary destinations.
- Desktop form-factor selector: Adaptive, Tablet, Smartphone. Layout changes through container queries instead of scaling text or controls.
- Default screen: identity, availability, Android role, engineering statement, primary actions, career metrics, featured transit work, and architecture entry.
- Screens: Home, About, Expertise, Experience, Projects, four project details, Architecture, Resume Center, Contact, and Recruiter Overview.

## Interaction design

The route allowlist uses native History APIs. Links remain real anchors, case studies retain real static paths, and modified clicks work normally. Internal navigation updates the URL without reloading, moves focus to the screen heading, and announces the screen. History entries preserve scroll positions; native direct-fragment scrolling is corrected after restoration to avoid clipped skill headings. The in-app Back button returns through portfolio history or falls back to the project library/home on an initial deep link.

Skills are linked to project evidence where supported. Architecture, KMP and delivery categories use role-wide context where project-specific attribution is unavailable. The project library filters by offline-first, hardware and Android TV. Every project has selectable conceptual responsibilities. No internal employer schemas, exact settlement protocols, unsupported use-case chains, or production screenshots are invented.

Experience has an initially expanded role and an associated-project panel. Recruiter Overview combines essential content and downloads and supports printing. Native HTML dialogs provide More and display settings. Theme and user-selected reduced motion persist locally, while OS reduced motion always takes precedence. Storage failures do not block the application.

The status clock is browser-local time, not a fixed placeholder. Network/battery indicators are decorative and labeled as illustrative. No audio, lock-screen gate, fake notifications, or native-gesture interception was added. These optional emulator features would increase friction without helping a recruiter.

## Rendering, accessibility and SEO

The device shell is CSS, so essential text and controls remain real accessible HTML. Its appearance does not require WebGL. The existing Three.js visual is moved into Architecture and loaded only when that screen becomes visible on a suitable device. Rendering is event-driven, respects visibility, and has a static SVG fallback.

All professional content is generated into HTML; without JS the result is a complete readable document, not an empty app. Each canonical project page puts that project first in source order. The enhanced interface hides inactive screens from both layout and the accessibility tree. Semantic headings, named landmarks, visible focus, native dialogs, real download links, print rules, and reduced-motion handling are preserved.

No framework migration was needed. Small typed modules and build-time components provide clear ownership without introducing React, Next, another router, a state library, or an animation library. The existing GitHub Pages deployment stays directly compatible. New dependencies are QA-only: Playwright and Lighthouse; production still depends only on optional Three.js.

## Reference guidance

- Android adaptive navigation: https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns
- History and popstate behavior: https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API
- Browser emulation and reduced motion: https://playwright.dev/docs/emulation

Validation results and remaining environmental limits are recorded in `VALIDATION.md`.
