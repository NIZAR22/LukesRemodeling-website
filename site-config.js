/**
 * site-config.js
 *
 * Single source of truth for one client's site. Every client project created
 * from this template edits ONLY this file (plus the images in public/images/)
 * for business details. That keeps template upgrades easy (components never
 * change per client) and stops one client's details leaking into another
 * client's site.
 *
 * Rules for this file:
 * - Every value still waiting for real client data carries a to-do marker
 *   (one of the two capitalised marker words listed in scripts/check-site.ps1),
 *   in the value itself or in a comment on the same line, so the check script
 *   can list anything that was missed. Remove the marker comment once the
 *   value is real.
 * - Review text is pasted verbatim from the review site. Never invent or
 *   paraphrase reviews.
 * - Licensing and insurance claims stay off until the client confirms them
 *   in writing (see the Licensing section below).
 *
 * CommonJS (module.exports) rather than an ES module so that vue.config.js
 * (Node, at build time) and the Vue components (webpack, in the browser) can
 * both read the same file.
 *
 * Client: Luke's Handyman & Remodeling (Luke Frontczak), Palm Bay, FL.
 */
const SITE = {
  // ---- Launch status ----
  // false = PREVIEW: the site can go live so the client can see it and decide,
  // even with to-do markers and placeholder images left. The check script
  // reports those as warnings instead of failures, search engines are told not
  // to index the page (noindex meta tag, robots.txt "Disallow: /", no JSON-LD,
  // sitemap.xml or llms.txt), and if the EmailJS keys aren't real yet the form
  // asks visitors to call or text instead of sending.
  // true = LAUNCH: everything is strict. Every marker and placeholder image
  // fails the check, the quote-form keys must be real or the build stops, and
  // the page is indexable. Only an explicit true counts.
  // Luke's site is a preview for his approval: keep false until he signs off.
  launchReady: false,
  // Small "Preview" ribbon in the corner while launchReady is false. Off by
  // default so the preview looks finished when shown to the client; never
  // shown once launchReady is true.
  showPreviewBadge: false,

  // ---- Identity ----
  // The new name. His Google profile and Facebook page still say "Luke's
  // Remodeling and Handyman"; they will be renamed after he approves the
  // preview. (The template's JSON-LD has no alternateName field, so the old
  // name isn't published anywhere; the profiles get renamed instead.)
  businessName: 'Luke\'s Handyman & Remodeling',
  ownerName: 'Luke Frontczak',
  tagline: 'Your Local Remodeler.',
  // What the business does, in a few words. Used in llms.txt and the no-JavaScript fallback.
  industryNoun: 'handyman and home improvement services',
  // Material Design Icons name (https://pictogrammers.com/library/mdi/) used
  // for the project-type field of the quote form (and for the Services menu
  // entry if nav.services below has no icon), so no trade-specific icon is
  // hard-coded in a component.
  industryIcon: 'mdi-hammer-wrench',
  yearsExperience: '10+',

  // ---- Logo ----
  // SVG or PNG in public/images/. alt stays empty because the business name
  // is printed right next to the logo; repeating it would make screen readers
  // announce the name twice.
  logo: { src: 'images/logo.svg', alt: '' },

  // ---- Contact ----
  // His Google profile says "call or text for a quote", so texting is on.
  phoneDisplay: '(321) 504-8217',
  phoneHref: 'tel:+13215048217',
  smsHref: 'sms:+13215048217',
  email: 'lukefrontczak@gmail.com',
  hours: 'By appointment — call or text to schedule',

  // ---- Location ----
  // "City, ST": the part after the last comma becomes the state in the
  // search-engine data. The contact map centres on this city (or on the
  // street address when showStreetAddress is true); while it still has a
  // to-do marker the map shows the whole US instead.
  baseCity: 'Palm Bay, FL',
  postalCode: '32905',
  // Luke works from home, so his street address must never appear on the
  // site: the map centres on Palm Bay at town zoom, and "Get Directions" opens
  // his Google Maps profile (googleReviewsUrl below) instead of a street.
  showStreetAddress: false,
  // Deliberately empty (not a to-do): his address is his home and is never
  // published, so there is nothing to fill in here.
  streetAddress: '',
  serviceArea: ['Palm Bay', 'Melbourne', 'West Melbourne', 'Malabar', 'Grant-Valkaria', 'Viera',
    'Rockledge', 'Cocoa', 'Satellite Beach', 'Indialantic', 'Melbourne Beach', 'Titusville'],
  serviceAreaSummary: 'Proudly serving all of Brevard County',
  // One sentence under the business name in the footer.
  footerDescription: 'Handyman repairs and home improvements across Brevard County, from Palm Bay to Titusville.',

  // ---- Licensing / trust ----
  // Licensing claims are legally sensitive (e.g. Florida statute 489.103
  // forbids unlicensed businesses advertising as contractors), so they're OFF
  // by default and only appear when explicitly confirmed.
  // Confirmed with Luke: he holds no Florida contractor license, so this
  // stays false and schemaType below is never GeneralContractor.
  isLicensed: false,
  licenseNumber: '', // Shown in the footer only when isLicensed is true and this is set.
  // Confirmed with Luke: he is insured, so "Insured" shows in the hero trust
  // line, "why choose us" and the footer. "Licensed" never appears.
  isInsured: true,
  // Enforced by scripts/check-site.ps1 when isLicensed is false: none of these
  // words may appear in visible copy, alt text or meta tags. Matching is
  // case-insensitive and whole-word, and each entry also catches its plural
  // and -ed/-ing forms ('license' catches licenses, licensed and licensing;
  // 'permit' catches permits and permitted). Trade names are listed with
  // their activity word (plumber and plumbing) because an unlicensed site
  // mustn't advertise those trades at all.
  restrictedWords: ['contractor', 'license', 'plumber', 'plumbing',
    'electrician', 'electrical', 'roofer', 'roofing', 'permit'],
  // Exact phrases exempt from the restricted-word check, e.g. a sentence that
  // describes other people rather than the business ('family friends who
  // were contractors'). Matched case-insensitively before the word check, and
  // every one is printed in the check output so exemptions stay visible.
  // Keep this list short and specific: never add a bare restricted word.
  // None needed for Luke: no review or about text uses a restricted word.
  allowedPhrases: [],

  // ---- Search engines and link previews ----
  // Address the site is published at, with a trailing slash. Used for the
  // canonical link, Open Graph tags, sitemap.xml, robots.txt and llms.txt.
  siteUrl: 'https://nizar22.github.io/LukesRemodeling-website/',
  seo: {
    // Longer than the usual 50-60 characters on purpose: it was chosen to
    // carry both the service + city and the full business name.
    title: 'Handyman & Home Improvements in Palm Bay, FL | Luke\'s Handyman & Remodeling',
    // About 150 characters: services, area and the call to action. Nothing
    // about licensing (he isn't licensed).
    description: 'Palm Bay handyman serving Brevard County: flooring, trim and carpentry, kitchen & bath updates and home repairs. Call or text Luke for a free quote.',
    // 1200x630 image in public/images/ for Facebook, texts and other link previews
    ogImage: 'images/og-image.jpg'
  },
  // Schema.org type for the search-engine data. Must match what the business
  // can legally claim. Never GeneralContractor for Luke: he isn't licensed.
  schemaType: 'HomeAndConstructionBusiness',

  // ---- Links ----
  // Empty strings (or values still containing a to-do marker) hide the
  // matching buttons, so nothing links to a wrong profile.
  // The business's Facebook page: the "Connect With Us" button in the
  // Contact section. Empty hides it. The feed module (modules.facebookFeed)
  // only loads once this is a finished link with no to-do marker.
  facebookUrl: 'https://www.facebook.com/profile.php?id=61575300146880',
  // Round "Follow Us" buttons in the footer, in this order. Add Instagram and
  // others as more entries, e.g.
  //   { name: 'Instagram', url: 'https://www.instagram.com/...', icon: 'mdi-instagram' }
  // icon is a Material Design Icons name. An empty list hides "Follow Us".
  // Facebook is Luke's only social profile.
  social: [
    { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61575300146880', icon: 'mdi-facebook' }
  ],
  // His Google Maps profile. While showStreetAddress is false this is also
  // where "Get Directions" goes (the profile has its own Directions button).
  googleReviewsUrl: 'https://maps.google.com/?cid=2005332060349629585',
  // Same Maps link for now, so "Leave a review" still lands on his profile.
  googleWriteReviewUrl: 'https://maps.google.com/?cid=2005332060349629585', // TODO: replace with the 'Ask for reviews' link from his Business Profile once Nizar is a Manager
  thumbtackUrl: 'https://www.thumbtack.com/fl/palm-bay/handyman/lukes-remodeling-handyman/service/418332539218264077',
  // One summary per review site. source must match reviews[].source below.
  ratings: [
    { source: 'Google', value: '4.6', count: 10, url: 'https://maps.google.com/?cid=2005332060349629585' },
    { source: 'Thumbtack', value: '5.0', count: 6, url: 'https://www.thumbtack.com/fl/palm-bay/handyman/lukes-remodeling-handyman/service/418332539218264077' }
  ],

  // ---- Theme ----
  // Fed into the Vuetify theme and the CSS custom properties at build time.
  // scripts/check-site.ps1 checks these pairs against WCAG AA (4.5:1):
  // text and muted on background and surface, onPrimary on primary,
  // onAccent on accent, and accentText on background and surface.
  // Charcoal + warm wood/amber for a carpentry and remodeling business.
  theme: {
    primary: '#1F2328', // Charcoal: header, footer, primary buttons
    onPrimary: '#FFFFFF', // Text on primary
    accent: '#C8873A', // Warm wood/amber, for buttons only (always with onAccent text)
    onAccent: '#1F2328', // Charcoal text on amber buttons (white on amber fails contrast)
    accentText: '#8F5A22', // Darker amber for links and small accent text on light backgrounds
    background: '#F7F4EF', // Page background
    surface: '#FFFFFF', // Cards and alternating sections
    text: '#1F2328', // Body text
    muted: '#5B616B', // Secondary text
    headingFont: 'Oswald', // Any Google Fonts family name
    bodyFont: 'Inter'
  },

  // ---- Menu ----
  // Label and Material Design Icons name for each menu entry, used in the
  // header, the phone menu drawer and nowhere else. Entries only appear
  // when their section is switched on below (Home always shows). Pick
  // icons that suit the trade, e.g. mdi-mower for lawn care.
  nav: {
    home: { label: 'Home', icon: 'mdi-home' },
    services: { label: 'Services', icon: 'mdi-hammer-wrench' },
    projects: { label: 'Our Work', icon: 'mdi-image-multiple' },
    about: { label: 'About', icon: 'mdi-account' },
    reviews: { label: 'Reviews', icon: 'mdi-star' },
    quote: { label: 'Free Quote', icon: 'mdi-clipboard-text-outline' },
    contact: { label: 'Contact', icon: 'mdi-phone' }
  },

  // ---- Modules: turn sections on/off per client ----
  modules: {
    services: true,
    gallery: true, // Before/after slider gallery.
    about: true, // "Meet the owner" section.
    reviews: true,
    // Off: Luke's is a newer-style Facebook page, so the Page Plugin shows
    // only the header and no posts, leaving a ~400px blank gap. The Contact
    // "Connect With Us" button and the footer icon still link to the page.
    facebookFeed: false, // Lazy-loaded Facebook Page Plugin (needs facebookUrl).
    quoteForm: true,
    serviceArea: true,
    contact: true
  },

  // ---- Content ----
  hero: {
    h1: 'Handyman & Home Improvements in Palm Bay, FL',
    sub: 'Carpentry, flooring, kitchen and bath updates, and the repairs on your list, done right by Luke, a local craftsman with 10+ years of experience.',
    // 1920x1080 photo. The image is darkened behind the text, so any photo works.
    // Luke's knotty-pine porch ceiling, cropped from his Facebook photo at its
    // native 924x520 (not enlarged: the page scales it, and enlarging only
    // adds file weight). Swap in his original phone photo when he sends it.
    image: 'images/hero-porch-ceiling.jpg',
    // Short trust points shown under the headline. "Insured" (from isInsured)
    // and the two ratings are added automatically after these, so they're
    // not repeated here.
    trustItems: ['Serving all of Brevard County', 'Free Quotes']
  },
  // Services grouped under headings. icon is a Material Design Icons name.
  serviceGroups: [
    {
      title: 'Repairs & Handyman',
      items: [
        { name: 'Drywall Repair & Texturing', description: 'Patches, holes and water damage blended to match.', icon: 'mdi-wall' },
        { name: 'Doors, Windows & Attic Ladders', description: 'Installs, replacements and adjustments that close right.', icon: 'mdi-door' },
        { name: 'Fixtures, TV Mounting & Assembly', description: 'Mounting, hanging and assembly done level and secure.', icon: 'mdi-television' },
        { name: 'Fix Lists for Sellers & New Owners', description: 'Inspection items and punch lists knocked out in one visit.', icon: 'mdi-clipboard-check-outline' }
      ]
    },
    {
      title: 'Home Improvements',
      items: [
        { name: 'Flooring', description: 'Luxury vinyl plank and laminate, installed clean and tight.', icon: 'mdi-texture-box' },
        { name: 'Trim, Molding & Carpentry', description: 'Baseboards, crown, wainscoting, stairs and custom carpentry.', icon: 'mdi-saw-blade' },
        { name: 'Kitchen & Bath Updates', description: 'Cabinets, vanities, pantries and storage upgrades.', icon: 'mdi-countertop-outline' },
        { name: 'Interior Painting', description: 'Walls, trim and doors with crisp lines and clean-up included.', icon: 'mdi-format-paint' },
        { name: 'Window Cleaning', description: 'Inside and out, including screens, tracks and sliding doors.', icon: 'mdi-spray-bottle' }
      ]
    }
  ],
  servicesFootnote: 'Not sure if your project\'s a fit? Text Luke a photo and he\'ll tell you straight.',
  // "Why choose us" points. A licensing point is added automatically only
  // when the licensing flags allow it (here: an "Insured" point, first).
  whyChooseUs: [
    { icon: 'mdi-clock-check-outline', title: 'Shows Up On Time', description: 'When Luke gives you a day, he\'s there.' },
    { icon: 'mdi-broom', title: 'Leaves It Clean', description: 'Your home is treated with respect, during and after the job.' },
    { icon: 'mdi-message-text-outline', title: 'Straight Answers', description: 'Fair quotes he sticks to, and honesty if a job isn\'t the right fit.' }
  ],
  // Gallery photos: 4:3 JPEGs in public/images/projects/. Each entry is either
  // a before/after pair (beforeSrc + afterSrc, shown as a slider) or a single
  // finished photo (image, shown with a "Finished" label).
  // category drives the filter buttons; alt describes the job, and the card
  // adds "Before:" / "After:" / "Finished:" in front of it.
  // Luke's photos are small Facebook copies, so they're cropped to 4:3 at
  // their native size (924x693 for the laundry pair) rather than enlarged.
  galleryImageSize: { width: 1200, height: 900 },
  projects: [
    // The only confirmed before/after pair: same room, same framing.
    { title: 'Laundry Room LVP Flooring', category: 'Flooring', beforeSrc: 'images/projects/01-laundry-lvp-before.jpg', afterSrc: 'images/projects/01-laundry-lvp-after.jpg', alt: 'Laundry room with worn parquet tile replaced by light oak luxury vinyl plank' },
    // Single finished photos (no confirmed "before" for these, so they are not
    // shown as pairs). The card prefixes each alt with "Finished: ".
    // 924x693 for 02-03; 04-06 come from 590 px Facebook copies, so they are
    // only 364x273 until Luke sends his originals.
    { title: 'Tongue-and-Groove Porch Ceiling', category: 'Carpentry', image: 'images/projects/02-porch-ceiling.jpg', alt: 'Covered brick patio with a knotty-pine tongue-and-groove ceiling above French doors' },
    { title: 'Kitchen LVP Flooring', category: 'Flooring', image: 'images/projects/03-kitchen-lvp.jpg', alt: 'Galley kitchen with rustic wood-look luxury vinyl plank flooring between white shaker cabinets' },
    { title: 'Kitchen Subway Tile Backsplash', category: 'Kitchen & Bath', image: 'images/projects/04-kitchen-backsplash.jpg', alt: 'Glossy gray subway tile backsplash behind a stainless range, between white shaker cabinets and quartz counters' },
    { title: 'Coffee Bar Tile Backsplash', category: 'Kitchen & Bath', image: 'images/projects/05-coffee-bar-backsplash.jpg', alt: 'Gray subway tile backsplash under white shaker cabinets at a quartz-topped beverage bar' },
    { title: 'French Patio Doors', category: 'Repairs', image: 'images/projects/06-french-patio-doors.jpg', alt: 'White French patio doors in a navy dining-room wall' }
  ],
  // Owner photo: 800x1000 (4:5) JPEG. Blank lines in text start new paragraphs.
  about: {
    // Luke's profile photo, cropped to the frame's 4:5 shape (removing a
    // child's hand at the edge). Only 256x320 from Facebook; replace with a
    // larger headshot when he sends one.
    photo: 'images/owner-luke.jpg',
    // Luke's own words, as supplied.
    text: 'I\'m Luke. I learned the trade growing up, working alongside family friends in the building trades, and I\'ve been doing carpentry and home improvement work for over 10 years. I\'m a one-man operation, so the person who quotes your job is the person who does it. I show up when I say I will, keep your home clean while I work, and if a project isn\'t something I\'m the right fit for, I\'ll tell you upfront.',
    badges: ['Shows Up On Time', 'Leaves It Clean', 'Straight Answers']
  },
  // Verbatim reviews only. source must match a ratings[].source to share its badge.
  // Copied exactly as posted, including the original spelling, spacing and
  // punctuation ("knowledgable", "finished ."). Do not tidy them up.
  reviews: [
    // Google
    { quote: 'Excellent work at a fair price. A friend recommended Luke after having some windows replaced and cleaned. He replaced our broken attic ladder. He was very quick to respond and was able to schedule us pretty fast. Stuck with his original quote which was fair. Very happy with the results.', name: 'Jesse F.', source: 'Google', stars: 5 },
    { quote: 'Highly recommend Luke. Professional, knowledgable, gets the job done and leaves the area clean. Will be rehiring for future projects. We trust him.', name: 'Mick P.', source: 'Google', stars: 5 },
    { quote: 'Luke completed 2 larger projects for us. He was knowledgeable, personable, hard-working, and detail-oriented. Excellent quality.', name: 'Kirsten B.', source: 'Google', stars: 5 },
    { quote: 'Luke was great, he showed up on time, had great solutions to the issues, cleaned up and generally a great guy and great skills, I would highly recommend him!!', name: 'Susan P.', source: 'Google', stars: 5 },
    { quote: 'Luke is respectful, honest, dependable and thorough. Luke\'s work ethics are impeccable. Luke kept the place clean during and after completion.', name: 'Luz C.', source: 'Google', stars: 5 },
    { quote: 'Called Luke and he was able to come over and install my TV pretty quickly and did a great job. Highly recommend.', name: 'Joseph V.', source: 'Google', stars: 5 },
    // Thumbtack
    { quote: 'Luke was great! He clearly communicated and did an excellent job! We needed some minor repairs done to the house we were putting up for sale. He did everything we asked and even offered to help with more when he finished . We will be using him again for any needs we have in our new house!', name: 'Amanda T.', source: 'Thumbtack', stars: 5 },
    { quote: 'Luke did an excellent job cleaning our house windows and sliding glass doors. I didn\'t see a spot left or any areas that he missed. He was very professional and offered an overall fair price.', name: 'Susan P.', source: 'Thumbtack', stars: 5 },
    { quote: 'Luke did an amazing job on our windows. They are so clean and I\'m so glad the salt spray is gone now. Luke was prompt and quick and very responsive. We will be calling him again and again.', name: 'Malisa A.', source: 'Thumbtack', stars: 5 },
    { quote: 'Luke was a great help for our repairs. Professional and great quality.', name: 'Lauren W.', source: 'Thumbtack', stars: 5 }
  ],
  quoteForm: {
    // EmailJS and reCAPTCHA keys for this client. They end up in the public
    // JavaScript anyway (that's how EmailJS works), so they live here rather
    // than in secrets. SETUP.md explains how to create them; a production
    // build stops if any still contains a to-do marker.
    // Left unfinished for the preview: until Luke's EmailJS account exists,
    // the form shows "Online quotes are coming soon — call or text".
    emailjsPublicKey: 'TODO EmailJS public key',
    emailjsServiceId: 'TODO EmailJS service ID',
    emailjsTemplateId: 'TODO EmailJS template ID',
    recaptchaSiteKey: 'TODO reCAPTCHA v2 site key',
    projectTypes: ['Repair / Handyman list', 'Flooring', 'Trim & Carpentry', 'Kitchen or Bath Update',
      'Interior Painting', 'Window Cleaning', 'Other'],
    projectSizes: ['Small repair (a few hours)', 'One room or area', 'Larger multi-day project'], // Empty hides the field.
    timelines: ['ASAP', 'Within a month', '1-3 months', 'Just planning'], // Empty hides the field.
    successMessage: 'Thanks! Luke will get back to you within 1 business day. Need it sooner? Call or text (321) 504-8217.',
    // Photo attachments:
    //   'off'     no photo option
    //   'sms'     a "Text photos of your project" button (needs smsHref)
    //   'emailjs' photos resized in the browser and sent as attachments
    //             (needs EmailJS Professional or higher; see SETUP.md)
    // 'sms' for Luke: free, and it's how he already gets photos from customers.
    photoMode: 'sms',
    smsPhotoBody: 'Hi, I just sent a quote request from your website — here are photos of my project:',
    maxPhotos: 5,
    photoMaxEdge: 1280, // Longest side in pixels after resizing
    photoQuality: 0.7, // JPEG quality 0-1
    // EmailJS Professional rejects requests over 2 MB; staying a little under
    // leaves room for the text fields and EmailJS's own envelope.
    maxRequestBytes: 1900000
  },
  analyticsId: '' // Google Analytics 4 ID (G-XXXXXXX). Empty = no analytics loaded.
}

module.exports = SITE
