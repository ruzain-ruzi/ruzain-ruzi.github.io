# Ruzain OS 3.0 — implementation notes

## Audit and preservation

The 17 November 2026 audit inspected the repository and the live `https://ruzain.online` page in Chrome. The production site matched the existing Android-display portfolio: a conventional hero and content screens inside a landscape frame, a mobile bottom navigation bar, canonical project pages, three regional resumes, and a recruiter overview.

The useful foundation was retained: static HTML generation, TypeScript routing and history, screen scroll restoration, semantic content, case-study URLs, original PDFs, conceptual project illustrations, interactive engineering diagrams, optional Three.js, recruiter printing, metadata, JSON-LD, sitemap, CNAME, and GitHub Pages configuration. The working tree was clean before this upgrade. No framework migration or new production dependency was needed.

The factual source `src/content.mjs` and skill evidence model are unchanged. The employer remains Technovia Info Solutions, historical title Android Developer, Jan 2023–Oct 2026, with 3 years and 10 months of experience. Metrics retain their role-wide attribution. Kotlin Multiplatform stays scoped to early shared-code initiatives. Website implementation tools are explicitly separated from career claims.

## Interaction model

The default home screen is a launcher with a local clock/date, profile widget, manually cycled verified engineering highlights, a featured OneDi transit widget, eight colored application icons, search, a contact shortcut, a recruiter shortcut, and a four-app dock.

Applications are real static HTML screens. The existing route allowlist and browser History API remain the source of navigation truth. `/#settings` is new; all earlier screen hashes, skill links and `/work/*.html` routes continue to work. Refresh opens the requested application directly.

`src/os/controller.ts` coordinates OS surfaces around that router:

- App launch records the clicked icon rectangle and expands the content surface using transform/opacity animation. Returning home contracts an inert, accessibility-hidden visual copy toward the corresponding icon, restores launcher focus, and removes the copy. Animations cancel when interrupted or motion is reduced.
- Home, Back, All apps and Recents have real buttons. Upward drag on the bottom handle returns home; on home it opens the app drawer. Downward drag on the status region opens quick settings. Gestures are confined to these controls; content scrolling and native browser edge gestures are untouched.
- Recent apps are an in-memory most-recently-used map keyed by application. A project detail belongs to My work. Cards show actual screen descriptions, resume the saved route and state, and can be dismissed individually or cleared. Dismissal removes a shortcut, not content. Recents reset on a full reload.
- Drawer search uses a static local index of applications, skill descriptions/technologies, all four projects, employer, recruiter overview, and resume regions. Arrow keys move through results; Enter activates; Escape closes the drawer, including from the search field. Result counts are announced.
- Quick settings exposes actual theme/motion controls and wallpaper, resumes, recruiter and settings destinations. Its notifications are explicitly portfolio shortcuts. Signal/battery icons are labeled illustrative, not actual hardware readings.
- The portfolio starts unlocked. The side power button and quick settings can open a visual lock screen. Unlock and Escape return to the current app. This is a visual pause, not authentication.

The Projects app adds a swipe/scrollable featured carousel with explicit previous/next controls. Existing filters, case studies, skills connections and selectable architecture responsibilities remain. Resume previews load the original regional PDF into a titled iframe only when requested, with an external PDF fallback and the existing direct download links. Closing the preview unloads it.

## Personalization and rendering

Six original CSS wallpaper collections use gradients and geometric lighting, with no raster download, shader, or continuous WebGL dependency. Wallpaper previews are staged until Apply. Reset restores Aurora Flow and its default palette. Curated mint, violet, coral and monochrome tokens update accents and surfaces without using sampled colors as arbitrary text colors.

Settings offers light, dark and OS-system appearance; wallpaper-derived or explicit accent; round or soft-square icons; reduced motion; optional launcher-only wallpaper drift; and an About OS panel. Preferences persist in the existing `portfolio-display` storage key, with validation and graceful in-memory behavior when storage is unavailable. System reduced motion takes precedence over optional effects.

Desktop retains the landscape device and internal scrolling; its form-factor selector genuinely reflows the launcher and apps. Mobile uses the available viewport and native document scrolling for long content. Wallpaper pseudo-elements are clipped to their own layer to prevent mobile layout-viewport expansion. System navigation is fixed to the viewport on mobile.

The shell remains accessible HTML/CSS. Web Animations supply lightweight transitions with no animation library. Portfolio content stays in static HTML for indexing and no-JavaScript reading; the app bundle does not gate resume or project links. The early layout marker expires if the application bundle fails. Heavy Three.js remains restricted to the existing optional architecture visual.

## Source map

- `scripts/components/os.mjs`: launcher, app registry, settings, search index and OS dialogs.
- `scripts/components/device.mjs`: adaptive shell, status controls and system navigation.
- `scripts/components/screens.mjs`: professional apps, case studies, featured gallery and original PDF actions.
- `src/os/controller.ts`: dialogs, recents, search, bounded gestures, app animations, lock, widgets, gallery and PDF preview.
- `src/device/settings.ts`: validated personalization, system preferences, local clock and persistence.
- `src/main.ts`, `src/navigation.ts`: routes, history, focus, scroll and SEO updates.
- `src/styles/os.css`: launcher, wallpapers, dynamic palettes, app surfaces, dialogs and responsive rules, layered over the existing device/illustration styles.
- `tests/os.spec.mjs`: eight OS behavior/accessibility tests; `tests/portfolio.spec.mjs`: sixteen retained and updated regression tests.

Measured validation and environmental limits are in `VALIDATION.md`. No production hosting or DNS settings were changed.
