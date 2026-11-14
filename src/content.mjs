// Professional claims consolidated from the three supplied regional resumes.
// Keep project-specific claims separate from employer-wide outcomes.
export const profile = {
  name: 'Ruzain Abdurahman', role: 'Android & Mobile Software Engineer',
  email: 'ruzain.abdurahman@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ruzain-abdurahman',
  github: 'https://github.com/ruzain-ruzi',
  origin: 'https://ruzain.online'
};
export const projects = [
  {
    slug: 'onedi-transit', number: '01', category: 'Transit & mobility', title: 'OneDi Transit Ecosystem',
    subtitle: 'Keep the journey moving. Even when the network doesn’t.',
    description: 'Offline-first bus ticketing, NFC tap-and-pay, and a companion fleet driver app. Built for the realities of public transit.',
    tags: ['Android POS', 'Offline-first', 'NFC'], visual: 'transit',
    problem: 'Bus ticketing needs to keep working through intermittent connectivity, while bringing payment terminals, transit cards, and driver workflows into one ecosystem.',
    contribution: 'Developed production Android ticketing and POS systems at Technovia Info Solutions, integrating NFC tap-and-pay across PAX, PineLabs, Worldline, and Mosambee terminals. The ecosystem also includes the OneDi Pilot fleet driver app.',
    approach: 'Offline-first ticketing puts continuity at the center of the application. My work across this role used Room for local persistence and WorkManager for background work, alongside payment hardware integration. The illustration separates these responsibilities to explain the engineering concerns.',
    integrations: 'PAX · PineLabs · Worldline · Mosambee · NFC tap-and-pay · Closed-loop transit cards',
    outcome: 'A deployed transit ticketing ecosystem with a companion driver application. Across my POS integration work at Technovia, these hardware workflows supported 1,000+ daily live transactions.',
    nodes: ['Transit card', 'Android POS', 'Local data', 'Background sync'],
    detail: 'Separate the passenger interaction, device integration, local persistence, and connectivity concerns so the system can support field operations.'
  },
  {
    slug: 'onedi-smart-pos', number: '02', category: 'Payments & hardware', title: 'OneDi Smart POS Suite',
    subtitle: 'Software that meets the physical world.',
    description: 'Payment processing, parking ticketing, and prepaid card issuance across Pay, Park, and Connect.',
    tags: ['Payment SDKs', 'Smart cards', 'POS'], visual: 'pos',
    problem: 'Payment, parking, and card issuance workflows need to work with specialized terminals rather than a single general-purpose phone interface.',
    contribution: 'Contributed to the OneDi Pay, Park, and Connect production modules at Technovia Info Solutions, covering enterprise POS payments, parking slot ticketing, and closed-loop prepaid card issuance.',
    approach: 'The suite connects Android application workflows with payment hardware and closed-loop card operations. Across the role, the integration work covered four terminal providers, NFC readers, and thermal printers. No provider-specific internals are disclosed here.',
    integrations: 'Android POS · Payment hardware SDKs · Closed-loop prepaid cards · Parking ticketing',
    outcome: 'Delivered production modules for three distinct operational workflows: enterprise payments, parking ticketing, and closed-loop prepaid card issuance.',
    nodes: ['Pay', 'Park', 'Connect', 'POS hardware'],
    detail: 'A conceptual view of the suite’s product domains and their shared physical-device context, rather than a claim about its internal module boundaries.'
  },
  {
    slug: 'onedi-media', number: '03', category: 'Android TV & media', title: 'OneDi Media & PIS',
    subtitle: 'The right information. On a bigger screen.',
    description: 'Android TV digital signage for real-time schedules and dynamic advertising in passenger environments.',
    tags: ['Android TV', 'Digital signage', 'Passenger information'], visual: 'media',
    problem: 'Passenger environments need timely scheduling information and advertising delivered on large-screen devices.',
    contribution: 'Developed Android TV media and passenger information systems at Technovia Info Solutions, supporting a digital signage network with scheduling updates and dynamic advertisements.',
    approach: 'The system brings two content domains—passenger information and advertising—to an Android TV surface. Real-time scheduling updates keep the information relevant, while dynamic advertisements give the display a second operational purpose.',
    integrations: 'Android TV · Real-time scheduling updates · Dynamic advertising',
    outcome: 'A production Android TV digital signage network delivering real-time scheduling updates and dynamic advertisements in passenger environments.',
    nodes: ['Schedules', 'Advertisements', 'Android TV', 'Passengers'],
    detail: 'A product-level information flow: scheduling and media content reach passengers through Android TV. The visual is an illustration, not a production screenshot.'
  },
  {
    slug: 'chandini-dsr', number: '04', category: 'Enterprise & field operations', title: 'Chandini Automobiles DSR',
    subtitle: 'Field operations, connected beyond the office.',
    description: 'Offline-capable field sales, ledger synchronization, and payment collection for enterprise operations.',
    tags: ['Offline workflows', 'Ledger sync', 'Field sales'], visual: 'field',
    problem: 'Field sales and payment collection take place outside the office, where a dependable network connection cannot be assumed.',
    contribution: 'Worked on the Chandini Automobiles DSR production system at Technovia Info Solutions, covering offline-capable enterprise field sales, real-time ledger synchronization, and field payment collection.',
    approach: 'The engineering focus is continuity between local field activity and synchronized business records. Offline-capable sales workflows allow work to continue in the field, while ledger synchronization connects that activity to enterprise records.',
    integrations: 'Android · Offline field sales · Ledger synchronization · Payment collection',
    outcome: 'An offline-capable enterprise system bringing field sales, real-time ledger synchronization, and field payment collection into a connected operational workflow.',
    nodes: ['Field sales', 'Local activity', 'Ledger sync', 'Business records'],
    detail: 'A conceptual flow linking work performed in the field with synchronized business records, without exposing private customer or transaction data.'
  }
];
export const expertise = [
  ['01', 'Mobile engineering', 'Interfaces are only the beginning.', 'Native Android applications across phones, payment terminals, and TV. Modernizing XML interfaces with Jetpack Compose and exploring shared Android/iOS business logic with KMP.', 'Kotlin · Java · Android SDK · Compose · Android TV · KMP'],
  ['02', 'Architecture & state', 'Clear boundaries. Predictable behavior.', 'Separate UI, domain, and data responsibilities with Clean Architecture, MVVM, MVI, and the repository pattern. Model asynchronous state with Kotlin’s reactive tools.', 'Coroutines · Flow · StateFlow · SharedFlow · Dagger-Hilt · Multi-module architecture'],
  ['03', 'Data & connectivity', 'Useful software, even offline.', 'Build local persistence and background synchronization for environments with intermittent connectivity, alongside API and Firebase integrations.', 'Room · WorkManager · DataStore · Retrofit · OkHttp · REST · Firebase'],
  ['04', 'Hardware integration', 'Connect code to the real world.', 'Integrate specialized Android terminals, NFC tap-and-pay, closed-loop smart cards, and thermal printers into operational workflows.', 'PAX · PineLabs · Worldline · Mosambee · NFC · Thermal printers'],
  ['05', 'Quality & delivery', 'Profile. Test. Refine. Ship.', 'Use profiling and leak detection to improve startup behavior, unit tests to support reliability, and code reviews and CI/CD to maintain delivery quality.', 'JUnit · Mockk · Android Profiler · LeakCanary · Git · GitHub Actions']
];
export const regions = [
  ['India', 'IN', 'On-site, hybrid, or remote roles. Immediate availability.'],
  ['GCC', 'GCC', 'Ready to relocate to the UAE, Qatar, and Oman.'],
  ['Europe', 'EU', 'Open to relocation to Germany, the UK, and Europe.']
];
