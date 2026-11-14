# Portfolio audit — 15 November 2026

## Repository
The original site is one 89 KB HTML file with embedded styles, scripts, canvas effects, project dialogs, filtering, contact links, and one old resume. It deploys directly through GitHub Pages with `CNAME` set to `ruzain.online` and the Cayman Jekyll theme in `_config.yml`. No package manifest, automated checks, or framework existed.

An existing uncommitted index.html was preserved outside the publishable repository at `D:\portfolio\portfolio-backups\index.before-redesign-2026-11-15.html` before edits. Original icons and the old PDF remain intact. Existing contact links and projects/skills anchor URLs are retained. Old modal-only project content is replaced by indexable case studies. The prior “Jan 2023 – Present” date and generic 3+ years claim are superseded by the supplied resumes.

## Resume consolidation
All three supplied resumes agree on employer, employment dates, core project systems, major outcomes, and immediate availability. No version is clearly newer; use their common factual core, with the narrower Europe description of KMP as early-stage shared Android/iOS codebases.

- Positioning: Android & Mobile Software Engineer. The historical job title is Android Developer, not Senior Android Developer.
- Experience: the resumes explicitly report 3 years 10 months. Month-only employment dates Jan 2023–Oct 2026 are consistent with counting 46 named calendar months; exact day-level tenure cannot be calculated. Do not let the experience counter keep increasing after October 2026.
- Employment: Technovia Info Solutions, India, Jan 2023–Oct 2026. Immediate joiner, zero-day notice. Do not describe employment as current.
- Scope: 10+ production Android applications, FinTech, transit, parking, TV, enterprise operations.
- Reported role-wide metrics: 99.9% transaction continuity/reliability with Room and WorkManager; 1,000+ daily transactions across POS integrations; 40%+ productivity/development velocity improvement using AI tools; 28% lower cold-start time; mentored two junior engineers. These are resume-reported, not independently audited, and have no supplied measurement methodology. Do not assign them to an individual project.
- Recognition: Promising Performer Award, 2023. Prefer this common wording over Europe-only “zero-downtime releases.”
- Projects: OneDi Transit (Bus Ticketing, POS & Pilot); OneDi Smart POS (Pay, Park & Connect); OneDi Media & TV Passenger Information System; Chandini Automobiles DSR. These are projects at one employer, not separate jobs.
- Skills: Kotlin, Java, Dart, Python, SQL, C/C++ (JNI basics); Android SDK, Compose, XML modernization, TV/POS, Room, WorkManager, DataStore, Navigation, Flutter; KMP/Compose Multiplatform; Clean Architecture/MVVM/MVI/repository/SOLID/multi-module; Coroutines/Flow/StateFlow/SharedFlow, RxJava concepts; Dagger-Hilt, Retrofit, OkHttp, REST/JSON/WebSockets, Firebase FCM/Crashlytics/Auth; four POS SDK brands, NFC, smart cards, printers, Google Maps; JUnit, Mockk, Profiler, LeakCanary, Git, GitHub Actions, CI/CD, Postman, Agile; AI-assisted workflows using ChatGPT, Gemini in Android Studio, Claude.
- Omitted from professional claims: CameraX, ML Kit, QR scanning and kiosk/device management are in the brief but not substantiated by the resumes. No invented consumer travel app, screenshots, Play Store links, repositories, or project metrics.
- Education: B.Sc. Computer Science, Kannur University, 2019–2022.
- Common certifications: IBM AI Developer Professional (2026), Google AI Essentials (2026), IBM Flutter & Dart (2025). No credential URLs supplied. India additionally lists Python Full Stack Web Development (2022), but no issuer; record here and omit from the main credential panel to avoid an incomplete attribution.

## Regional distinctions and unresolved verification
India specifies on-site/hybrid/remote work. GCC specifies readiness for UAE, Qatar, Oman. Europe specifies Germany, UK, Europe and elementary German; these are not conflicting identities. Europe also claims EU Blue Card eligibility, but the materials do not substantiate legal eligibility; do not republish that as a site claim. Original resume bytes are preserved as requested. No visa status is inferred. Certification issuers are clear from their titles, but verification links were not supplied. Availability is a dated statement and should be updated when employment changes.

## Implementation strategy and design
Retain static GitHub Pages deployment. Generate semantic HTML from shared templates and a single content module. Strict TypeScript plus esbuild provides a small interaction bundle and a separate lazy Three.js chunk; no React, Next, Tailwind, or competing animation runtimes are necessary for this content-led site. Current stable package versions are resolved from npm and locked. Node 24 from the Codex runtime is used for tooling (the system Node 18 is too old for current ESLint).

Design: ink background, warm ivory text, desaturated teal accent, system sans with mono annotations, an editorial grid and ample spacing. Signature: a layered computational core representing hardware, persistence, domain, and UI. Three.js uses physical materials, lighting, procedural geometry, event-driven rendering, capped pixel ratio, and no perpetual animation. A lightweight static SVG remains available for reduced-motion, small/coarse-pointer devices, data-saving, low-core-count devices, or unavailable WebGL. Project visuals are explicitly conceptual; case studies avoid unsupported implementation details.

Primary references: https://threejs.org/manual/en/rendering-on-demand.html ; https://threejs.org/manual/pages/installation.html ; https://esbuild.github.io/api/ ; https://www.typescriptlang.org/tsconfig/ ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
