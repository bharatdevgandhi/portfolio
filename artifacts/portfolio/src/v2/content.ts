// Single source of truth for the v2 portfolio.
//
// Everything a visitor or a machine can read — the gallery, the detail pages,
// the agent view, llms.txt, llms-full.txt, resume.md, profile.json and JSON-LD
// — is rendered from this file. Facts come from the September 2026 résumé and
// the existing site. Change a fact here once and every surface updates.
//
// Keep this file dependency-free and free of non-erasable TypeScript syntax:
// Node imports it directly (type stripping) when generating agent assets.

import { extraEntries } from "./cards.generated.ts";

export const origin = "https://www.bharatdevgandhi.com";

export type Metric = { value: string; label: string };

export type Org = {
  id: string;
  name: string;
  /** File in /media/logos. Real marks, fetched from the owner or Wikimedia Commons. */
  logo: string;
  /** Rendered width in a logo row, in px, tuned so marks look the same size. */
  width: number;
  url: string;
  /** Set when the mark alone does not spell the name. */
  label?: string;
};

export type Picture = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** True when there is no half-size "-sm" copy of the file. */
  single?: boolean;
  /** A looping capture, when the picture moves. `src` is its poster. */
  video?: { mp4: string; webm: string };
};

export type Cover =
  | { kind: "picture"; picture: Picture; ratio: string }
  | { kind: "logo"; org: string; tone: "ink" | "paper" | "accent" }
  | { kind: "type"; line: string; tone: "ink" | "paper" | "accent" };

export type Entry = {
  id: string;
  group: "work" | "education" | "project" | "teaching";
  title: string;
  orgs: string[];
  role: string;
  dates: string;
  startDate?: string;
  endDate?: string | null;
  place: string;
  /** One line for the gallery. No numbers here: those live on the detail page. */
  intro: string;
  /** Two or three sentences that open the detail page. */
  summary: string;
  /** What the organisation is, for readers who don't know it. */
  orgNote?: string;
  metrics: Metric[];
  shipped: string[];
  tags: string[];
  cover: Cover;
  /** An organisation whose logo sits on the cover, when the picture is not theirs. */
  badge?: string;
  pictures: Picture[];
  /** A page of its own, when the card is more than a card. Defaults to /work/<id>. */
  page?: string;
  /** A longer write-up elsewhere on the site. */
  story?: { href: string; label: string };
  external?: { href: string; label: string };
};

export const person = {
  name: "Bharat Gandhi",
  givenName: "Bharat",
  familyName: "Gandhi",
  headline: "AI Product Manager",
  /** The hero introduction, kept from the current site. */
  intro:
    "I am Bharat Gandhi. I build AI products and take them to market. Currently, I am a Platform Product Manager at District by Zomato, leading search, discovery, personalization and AI-native products.",
  thesis: "I build AI products and take them to market.",
  about:
    "I enjoy growing and building things from the ground up. I own app-wide search, discovery, personalization, notifications and AI-native products at District by Zomato, reporting directly to the CEO. Before that: agentic workflow products at CanvasX AI, content intelligence and production platforms at Audible/Amazon, and travel-pricing data products at RateGain.",
  summary:
    "Bharat Gandhi is an AI product manager who builds AI products and takes them to market. He is Platform Product Manager at District by Zomato (Eternal Ltd.), where he owns app-wide search, discovery, personalization, notifications and AI-native products and reports directly to the CEO. Previously he led product and growth in an advisory role at CanvasX AI, was Product Manager – Tech for Audible Originals and Content Systems at Amazon in New York, and was a Product Manager at RateGain. He holds an MS in Information Systems from Cornell Tech.",
  location: "New Delhi, India",
  relocation: "Open to relocation",
  since: "2018",
  email: "bharatgandhi.sf@gmail.com",
  portrait: {
    src: "/media/portrait.jpg",
    alt: "Bharat Gandhi in a city square at night, in front of a monument lit in blue",
  },
} as const;

/**
 * Work authorisation. Published in the machine-readable surfaces only
 * (agent view, llms files, profile.json, JSON-LD), never in the human UI.
 * Wording is deliberately limited to what Bharat has stated.
 */
export const workAuthorization = {
  short: "Holds a US H-1B work visa. Open to relocation.",
  detail:
    "Bharat Gandhi holds a US H-1B work visa and has worked in the United States (Amazon/Audible, New York, 2021–2024). He is open to relocation, including to the US. For a US employer this is a simpler path than hiring a candidate with no US work visa; he can confirm the specifics of transfer and timing directly.",
};

export const links = {
  linkedin: "https://linkedin.com/in/bdgandhi",
  x: "https://x.com/bharaatobama",
  substack: "https://bharatgandhi.substack.com",
  medium: "https://bg445.medium.com/",
  github: "https://github.com/bharatgandhi",
  instagram: "https://www.instagram.com/betterbharaat",
  repo: "https://github.com/bharatdevgandhi/portfolio",
  /** Stable, human-readable URL. Copied from attached_assets at build time. */
  resume: "/Bharat_Gandhi_Resume.pdf",
} as const;

export const socials: { label: string; href: string }[] = [
  { label: "X", href: links.x },
  { label: "LinkedIn", href: links.linkedin },
  { label: "Substack", href: links.substack },
  { label: "Medium", href: links.medium },
  { label: "GitHub", href: links.github },
];

export const orgs: Record<string, Org> = {
  district: { id: "district", name: "District by Zomato", logo: "district-wordmark.png", width: 96, url: "https://www.district.in/" },
  zomato: { id: "zomato", name: "Zomato", logo: "zomato.svg", width: 104, url: "https://www.zomato.com/" },
  sketch: { id: "sketch", name: "Sketch by CanvasX AI", logo: "sketch.svg", width: 34, url: "https://getsketch.ai", label: "Sketch" },
  audible: { id: "audible", name: "Audible", logo: "audible.svg", width: 40, url: "https://www.audible.com/", label: "Audible" },
  amazon: { id: "amazon", name: "Amazon", logo: "amazon.svg", width: 96, url: "https://www.amazon.com/" },
  rategain: { id: "rategain", name: "RateGain", logo: "rategain.png", width: 118, url: "https://rategain.com/" },
  cornelltech: { id: "cornelltech", name: "Cornell Tech", logo: "cornelltech.svg", width: 132, url: "https://tech.cornell.edu/" },
  manipal: { id: "manipal", name: "Manipal University Jaipur", logo: "manipal.png", width: 164, url: "https://jaipur.manipal.edu/" },
  fubo: { id: "fubo", name: "Fubo", logo: "fubo.svg", width: 84, url: "https://www.fubo.tv/" },
};

/** The row under the introduction: every organisation, in career order. */
export const orgRow = ["district", "sketch", "audible", "amazon", "rategain", "cornelltech", "manipal", "fubo"];

// ---------------------------------------------------------------------------
// Adding things
//
// The quick way: run
//   pnpm --filter @workspace/portfolio run new:card -- "Name of the thing"
// It creates content/cards/<name>.md from a template. Fill in the header and
// the story, put the picture in public/media, and rebuild. No code to touch.
//
// The full way, for a card with several pictures, a video or a logo cover:
// add one object to `coreEntries` below and its chapters to chapters.ts.
//
// Either way the card gets a tile on the home page, its own page at
// /work/<id>, a place in the agent files and an SEO entry.
//
// A new organisation is one line in `orgs`, with its logo in
// public/media/logos. A new place is one object in `places`. Articles appear
// on their own: the Writing tiles come from the Substack and Medium feeds.
// ---------------------------------------------------------------------------

const coreEntries: Entry[] = [
  {
    id: "district",
    group: "work",
    title: "District by Zomato",
    orgs: ["district", "zomato"],
    role: "Platform Product Manager",
    dates: "Apr 2026 to present",
    startDate: "2026-04",
    endDate: null,
    place: "Gurugram",
    intro: "Search, discovery, personalization and AI-native products for Zomato's going-out app.",
    orgNote: "Zomato's going-out platform spanning dining-out, movies and live events (Eternal Ltd.).",
    summary:
      "I own app-wide search, discovery, personalization, notifications and AI-native products end to end, and report directly to the CEO. The work so far: a 0-to-1 contextual search launch, a voice navigation agent, one-click Indic-language movie translation and new ways to plan an outing.",
    metrics: [
      { value: "7% to 1.8%", label: "null-result searches" },
      { value: "+5%", label: "search click-through rate" },
      { value: "+2%", label: "daily GMV from search" },
      { value: "+30%", label: "inventory views from personalization" },
      { value: "+8%", label: "day-0 push opt-ins" },
    ],
    shipped: [
      "Led the 0-to-1 launch of AI-powered contextual search, combining upgraded keyword retrieval with model-based intent understanding. Null-result searches fell from 7% to 1.8%, search CTR rose 5%, and daily GMV rose 2%.",
      "Incubated AI products from functional proof of concept through launch, including a voice-driven navigation agent using LLM tool-calling with deterministic grounding, and one-click Indic-language movie translation.",
      "Built hands-on prototypes with AI-assisted coding to validate UX, model capability, latency and technical feasibility before engineering investment.",
      "Increased inventory views by 30% with ML-based homepage personalization across customer cohorts.",
      "Ran the push-notifications charter, lifting day-0 opt-ins by 8% through growth experiments, prioritized pushes and in-app reminders.",
      "Started new discovery surfaces: in-app curations, maps and outing planning.",
    ],
    tags: ["AI", "Search", "Personalization", "Consumer", "0 to 1"],
    cover: {
      kind: "picture",
      ratio: "9 / 16",
      picture: {
        src: "/media/shot-district-mobile.jpg",
        alt: "District's mobile home screen: a search bar above movies and events near Gurugram",
        caption: "District on a phone",
        width: 780,
        height: 1560,
        video: { mp4: "/media/district-loop.mp4", webm: "/media/district-loop.webm" },
      },
    },
    pictures: [
      {
        src: "/media/shot-district.jpg",
        alt: "District's desktop home page listing Hindi movies and music events near Gurugram",
        caption: "Discovery on the web",
        width: 1600,
        height: 1000,
      },
      {
        src: "/media/shot-district-movies.jpg",
        alt: "District's movies page with a featured film and language filters",
        caption: "Movies",
        width: 1600,
        height: 1000,
      },
    ],
    external: { href: "https://www.district.in/", label: "district.in" },
  },
  {
    id: "canvasx",
    group: "work",
    title: "CanvasX AI",
    orgs: ["sketch"],
    role: "Head of Product & Growth (Advisory)",
    dates: "Jan 2025 to Apr 2026",
    startDate: "2025-01",
    endDate: "2026-04",
    place: "Remote, across India, the US and Europe",
    intro: "Product, pricing and go-to-market for agentic workflow products, including Sketch.",
    orgNote: "Applied-AI lab building agentic workflow products for SMBs.",
    summary:
      "I led product strategy, go-to-market, partnerships and forward deployment for an applied-AI lab. That meant turning customer workflows into production agents, designing how Sketch is priced and deployed, and building the sales pipeline from nothing.",
    metrics: [
      { value: "25+", label: "SMB teams in India adopted Sketch" },
      { value: "25,000", label: "users on a retail agentic deployment" },
      { value: "+8%", label: "incentive-achievement rate within 60 days" },
    ],
    shipped: [
      "Drove 0-to-1 product strategy and deployment for agentic AI products, translating customer workflows into production implementations across multiple markets.",
      "Architected the product, pricing and deployment model for Sketch, a multiplayer agentic workflow harness with credit-based consumption tiers and Bring Your Own Key options that balance inference cost, latency and output quality. Adopted by 25+ SMB teams in India.",
      "Built the sales pipeline from scratch, including the first Fortune 100 prospect and SMB opportunities across India, Dubai and the EU.",
      "Led forward deployment of an agentic data-analysis product for an omnichannel retail client with 25,000 users, increasing incentive-achievement rates by 8% within 60 days of launch.",
    ],
    tags: ["AI", "Agents", "Go-to-market", "Pricing", "B2B", "0 to 1"],
    cover: {
      kind: "picture",
      ratio: "4 / 5",
      picture: {
        src: "/media/shot-sketch-mobile.jpg",
        alt: "Sketch's home page on a phone: Meet Sketch, your new project manager",
        caption: "Sketch",
        width: 780,
        height: 820,
      },
    },
    pictures: [
      { src: "/media/shot-sketch.jpg", alt: "Sketch's home page on a desktop", caption: "Sketch", width: 1600, height: 1000 },
    ],
    external: { href: "https://getsketch.ai", label: "getsketch.ai" },
  },
  {
    id: "audible",
    group: "work",
    title: "Audible",
    orgs: ["audible", "amazon"],
    role: "Product Manager – Tech, Audible Originals & Content Systems",
    dates: "Aug 2021 to Dec 2024",
    startDate: "2021-08",
    endDate: "2024-12",
    place: "New York City",
    intro: "Content intelligence, monetization and production platforms for Audible Originals.",
    orgNote: "Audible Originals and Studios at Amazon, across global marketplaces.",
    summary:
      "I owned the platforms behind Audible's first-party content: how the business decides what to make, how it gets made and published, how creators get paid, and how the rights travel to television.",
    metrics: [
      { value: "20M+", label: "listeners segmented into 36 taste categories, 11 countries" },
      { value: "$100M+", label: "content spend evaluated with that framework" },
      { value: "~$7M", label: "GMV from a new audiobook-to-TV rights business" },
      { value: "50% faster", label: "audiobook time-to-market across 12 markets" },
      { value: "70% to 93%", label: "error-free, on-time creator payments" },
      { value: "36% faster", label: "localization with LLM text-to-speech" },
    ],
    shipped: [
      "Developed and operationalized ML segmentation of 20M+ listeners into 36 taste categories across Audible and Amazon in 11 countries. It became the standard evaluation framework for deploying $100M+ in first-party content production over 2 years.",
      "Took LLM-based text-to-speech audiobook production from research prototype to production pipeline, reducing localization timelines by 36% across 3 languages and expanding the monetizable catalog into 8+ countries.",
      "Created a new audiobook-to-TV rights business generating ~$7M GMV: a platform for global TV producers to discover and acquire first-party content rights.",
      "Launched a creator-payments API for the publisher and creator ecosystem, improving error-free, on-time payments from 70% to 93% across 12 markets within 2 quarters.",
      "Established the global source of truth for production, deals and publishing operations, cutting audiobook time-to-market by 50% and podcast time-to-market by 70% across 12 markets. It also powered Audible Brazil's $12M content-acquisition program with an operations suite taken from idea to deployment in 2 weeks.",
    ],
    tags: ["AI", "Content", "Marketplace", "Payments", "Consumer", "0 to 1"],
    cover: {
      kind: "picture",
      ratio: "4 / 5",
      picture: { src: "/media/gen-audible.jpg", alt: "Studio headphones resting on a stack of old hardcover books", caption: "", width: 928, height: 1152 },
    },
    badge: "audible",
    pictures: [],
  },
  {
    id: "rategain",
    group: "work",
    title: "RateGain",
    orgs: ["rategain"],
    role: "Product Manager",
    dates: "Jan 2018 to Jun 2019",
    startDate: "2018-01",
    endDate: "2019-06",
    place: "Noida",
    intro: "Travel-pricing data products and the scraping infrastructure behind them.",
    orgNote: "B2B SaaS travel-pricing intelligence platform.",
    summary:
      "I joined as an intern, shipped an airline-pricing product from scratch and converted to Product Manager. I then owned the scraping infrastructure and the data products built on it.",
    metrics: [
      { value: "+40%", label: "revenue over 3 quarters" },
      { value: "94% to 98%", label: "successful scrapes across 550+ bots" },
      { value: "+25", label: "NPS points within 2 quarters" },
      { value: "~10%", label: "revenue uplift per airline customer" },
    ],
    shipped: [
      "Translated customer feedback into new data products, including one-click on-demand scraping, Airbnb pricing intelligence and pricing-difference previews, contributing to a 40% revenue increase over 3 quarters.",
      "Launched geo-located scraping and won customers across the US, EMEA and APAC.",
      "Engineered the DataSURE ML framework, increasing successful-scrape rates from 94% to 98% across 550+ bots and lifting NPS by 25 points within 2 quarters.",
      "As an intern (Jan to Jun 2018), delivered an airline-pricing product from scratch that enabled ~10% revenue uplift per customer.",
    ],
    tags: ["Data", "ML", "B2B", "SaaS", "0 to 1"],
    cover: {
      kind: "picture",
      ratio: "4 / 5",
      picture: {
        src: "/media/shot-rategain-mobile.jpg",
        alt: "RateGain's home page on a phone",
        caption: "RateGain today",
        width: 780,
        height: 1200,
      },
    },
    pictures: [
      { src: "/media/shot-rategain.jpg", alt: "RateGain's home page on a desktop", caption: "RateGain today", width: 1600, height: 1000 },
    ],
    external: { href: "https://rategain.com/", label: "rategain.com" },
  },
  {
    id: "cornell-tech",
    group: "education",
    title: "Cornell Tech",
    orgs: ["cornelltech"],
    role: "MS, Information Systems (Jacobs Technion-Cornell dual MS)",
    dates: "Class of 2021",
    place: "Roosevelt Island, New York City",
    intro: "A master's in Information Systems on Roosevelt Island, and a first startup.",
    summary:
      "Cornell Tech was one of the best learning experiences of my life. During COVID I was able to stay on campus and keep working with other grad students. I failed at my first startup here, built something in every class, and made as many friends as I could.",
    metrics: [],
    shipped: [],
    tags: ["Graduate school", "Product", "Startups"],
    cover: {
      kind: "picture",
      ratio: "3 / 2",
      picture: {
        src: "/media/photo-cornell-tech-campus.jpg",
        alt: "The Cornell Tech campus on Roosevelt Island with the Queensboro Bridge behind it",
        caption: "Cornell Tech, Roosevelt Island",
        width: 1400,
        height: 608,
      },
    },
    badge: "cornelltech",
    pictures: [
      {
        src: "/media/photo-cornell-tech-south.jpg",
        alt: "Cornell Tech buildings seen from the south lawn",
        caption: "The campus from the south",
        width: 1400,
        height: 788,
      },
    ],
    external: { href: "https://tech.cornell.edu/", label: "tech.cornell.edu" },
  },
  {
    id: "fubo",
    group: "project",
    title: "FuboTV × Cornell Tech",
    orgs: ["fubo", "cornelltech"],
    role: "Product and UX research",
    dates: "2019",
    place: "New York City",
    intro: "Research into why cord-cutters skip live TV news, and a product built around viewer control.",
    summary:
      "FuboTV asked a Cornell Tech team why younger viewers were not watching live news. We ran a multi-week ethnographic study across New York City, found that viewers felt held hostage by a single channel's schedule, and designed a multi-source experience that put them in control.",
    metrics: [],
    shipped: [
      "Ran ethnographic research in living rooms, commuter trains and office break rooms rather than surveys.",
      "Designed a multi-source live news experience: switch between channels covering the same story, with a timeline to scrub back to when it broke.",
      "Cut half the features after the first round of testing. Participants described the result as choosing to watch rather than having it on.",
    ],
    tags: ["UX research", "Product design", "Media"],
    cover: {
      kind: "picture",
      ratio: "4 / 3",
      picture: { src: "/media/gen-fubo.jpg", alt: "A dark living room lit by a wall of television screens", caption: "", width: 1200, height: 896 },
    },
    badge: "fubo",
    pictures: [],
  },
  {
    id: "plaza",
    group: "project",
    title: "Plaza",
    orgs: ["cornelltech"],
    role: "Product and go-to-market",
    dates: "2019 to 2021",
    place: "New York City",
    intro: "A Chrome extension that put a comment section on every page of the internet. It failed.",
    summary:
      "Plaza (plaza.app) was a Chrome extension for commenting on any page on the internet, built with classmates at Cornell Tech during the pandemic. We built an elegant product for a problem people would not pay enough to solve. The write-up covers what we built and what I took from it.",
    metrics: [],
    shipped: [
      "Distribution over features: a good product does not overcome a missing go-to-market.",
      "Validate commercial appetite before writing the first line of code, not after.",
      "The startup died; the relationships from that period became the base of my professional network.",
    ],
    tags: ["Startup", "Consumer", "Chrome extension", "Failure"],
    cover: {
      kind: "picture",
      ratio: "1 / 1",
      picture: { src: "/media/gen-plaza.jpg", alt: "Blue and white paper notes pinned over a newspaper page beside a laptop", caption: "", width: 1024, height: 1024 },
    },
    pictures: [],
    external: {
      href: "https://chrome.google.com/webstore/detail/plaza/koaglamlcheihiplknebjibpfdegcfai",
      label: "Plaza on the Chrome Web Store",
    },
  },
  {
    id: "manipal",
    group: "education",
    title: "Manipal University Jaipur",
    orgs: ["manipal"],
    role: "BE, Computer Science",
    dates: "Class of 2017",
    place: "Jaipur",
    intro: "Computer science, a filmmaking society, and the state's biggest student festival.",
    summary:
      "Alongside the basics of computer science engineering, I spent most of my time understanding media. I founded a filmmaking society and led several student bodies, which is what let me put together MUJ Oneiros.",
    metrics: [],
    shipped: [],
    tags: ["Undergraduate", "Media", "Leadership"],
    cover: {
      kind: "picture",
      ratio: "4 / 3",
      picture: { src: "/media/gen-manipal.jpg", alt: "A cinema camera, a clapperboard and a notebook of diagrams on a wooden desk", caption: "", width: 1200, height: 896 },
    },
    badge: "manipal",
    pictures: [],
    external: { href: "https://jaipur.manipal.edu/", label: "jaipur.manipal.edu" },
  },
  {
    id: "oneiros",
    group: "project",
    title: "MUJ Oneiros",
    orgs: ["manipal"],
    role: "Architect and organiser",
    dates: "2013 to 2017",
    place: "Jaipur",
    intro: "Rajasthan's biggest student-run cultural festival by footfall.",
    summary:
      "I architected Rajasthan's biggest student-run cultural festival by footfall in a single iteration, on top of an ecosystem of 300 students producing weekly live events.",
    metrics: [{ value: "300", label: "students producing weekly live events" }],
    shipped: [],
    tags: ["Live events", "Media", "Leadership"],
    cover: {
      kind: "picture",
      ratio: "4 / 5",
      picture: { src: "/media/gen-oneiros.jpg", alt: "A festival crowd at night facing a stage lit in blue and amber", caption: "", width: 928, height: 1152 },
    },
    pictures: [],
    external: {
      href: "https://www.youtube.com/results?search_query=MUJ+Oneiros+aftermovie",
      label: "Watch the aftermovie",
    },
  },
  {
    id: "meditation",
    group: "teaching",
    title: "Breathwork & meditation",
    orgs: [],
    role: "Instructor, 1,000 hours of training",
    dates: "Ongoing",
    place: "India and the US",
    intro: "I teach breathwork and meditation, mostly to people between 18 and 35.",
    summary:
      "Bharat is a breathwork and meditation instructor with 1,000 hours of training. He teaches SKY Campus Happiness in the US, and YES!+ and the Happiness Program of Art of Living in India.",
    metrics: [],
    shipped: [],
    tags: ["Teaching", "Breathwork", "Meditation"],
    cover: {
      kind: "picture",
      ratio: "4 / 5",
      picture: { src: "/media/gen-meditation.jpg", alt: "A meditation cushion on a mat in an empty room at dawn", caption: "", width: 928, height: 1152 },
    },
    pictures: [],
    page: "/meditation",
  },
];

/** Every card: the ones above, then any Markdown files in content/cards. */
export const entries: Entry[] = [...coreEntries, ...extraEntries];

export const entryById = (id: string) => entries.find((entry) => entry.id === id);
export const stops = entries.filter((entry) => entry.group === "work");
export const projects = entries.filter((entry) => entry.group === "project");
export const current = stops[0];

export type Place = { id: string; name: string; picture: Picture };

/** Cities, in the order Bharat lists them. Names only. */
export const places: Place[] = [
  {
    id: "new-york",
    name: "New York",
    picture: { src: "/media/thumb-nyc.jpg", alt: "Midtown Manhattan at night under a full moon", caption: "", width: 176, height: 176, single: true },
  },
  {
    id: "new-delhi",
    name: "New Delhi",
    picture: { src: "/media/thumb-delhi.jpg", alt: "India Gate at dusk under an orange sky", caption: "", width: 176, height: 176, single: true },
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    picture: { src: "/media/thumb-sf.jpg", alt: "The San Francisco skyline at dusk", caption: "", width: 176, height: 176, single: true },
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    picture: { src: "/media/thumb-bengaluru.jpg", alt: "Vidhana Soudha in Bengaluru lit at night", caption: "", width: 176, height: 176, single: true },
  },
  {
    id: "gurugram",
    name: "Gurugram",
    picture: { src: "/media/thumb-gurugram.jpg", alt: "Office towers in Gurugram", caption: "", width: 176, height: 176, single: true },
  },
];

export const education = [
  {
    id: "cornell-tech",
    school: "Cornell Tech, Cornell University",
    degree: "MS, Information Systems",
    note: "Jacobs Technion-Cornell dual MS",
    year: "2021",
    place: "New York, NY",
  },
  {
    id: "manipal",
    school: "Manipal University Jaipur",
    degree: "BE, Computer Science",
    note: "Founded a filmmaking society; led multiple student bodies",
    year: "2017",
    place: "Jaipur, India",
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "AI & data",
    items: [
      "Foundation model integration",
      "Agentic workflows and tool-calling",
      "LLM evaluation",
      "Rapid functional POCs with AI-assisted coding",
      "Cost–latency–quality trade-offs",
      "Voice AI",
      "Conversational AI",
      "Neural search",
      "Information retrieval",
      "Knowledge graphs",
      "SQL",
      "Redash",
      "Tableau",
    ],
  },
  {
    group: "Platform & ecosystems",
    items: [
      "Search and discovery",
      "ML-based personalization",
      "Consumer app surfaces",
      "Developer and creator ecosystems",
      "Content systems",
      "Payments infrastructure",
      "Marketplace platforms",
      "Subscription and pricing models",
      "Experimentation and A/B testing",
      "International expansion",
    ],
  },
  {
    group: "Product leadership",
    items: [
      "0-to-1 incubation",
      "Product vision and roadmaps",
      "Research-to-product translation",
      "Executive communication",
      "Cross-functional alignment",
      "User validation",
      "UX design and wireframing",
      "Go-to-market strategy",
      "Forward deployment",
    ],
  },
];

/**
 * Every skill on the résumé with the other names people search it by.
 * Used only in machine-readable surfaces. The variants are synonyms and
 * spellings of skills he has, never additional skills.
 */
export const skillIndex: { skill: string; alsoKnownAs: string[]; evidence: string }[] = [
  { skill: "AI product management", alsoKnownAs: ["AI product manager", "AI PM", "artificial intelligence product manager", "GenAI product manager", "generative AI product management", "LLM product manager", "applied AI product"], evidence: "District by Zomato, CanvasX AI, Audible" },
  { skill: "Foundation model integration", alsoKnownAs: ["LLM integration", "large language model integration", "GenAI integration", "model integration", "building with foundation models"], evidence: "District contextual search and voice agent; Audible text-to-speech" },
  { skill: "Agentic workflows and tool-calling", alsoKnownAs: ["AI agents", "agentic AI", "LLM agents", "function calling", "tool use", "agent orchestration", "multi-agent workflows", "workflow automation"], evidence: "Sketch at CanvasX AI; District voice navigation agent" },
  { skill: "LLM evaluation", alsoKnownAs: ["model evaluation", "evals", "AI quality evaluation", "prompt evaluation", "offline evaluation"], evidence: "District and CanvasX AI" },
  { skill: "Rapid functional POCs with AI-assisted coding", alsoKnownAs: ["prototyping", "rapid prototyping", "proof of concept", "vibe coding", "AI-assisted development", "hands-on prototyping", "technical product manager"], evidence: "District prototypes built before engineering investment" },
  { skill: "Cost–latency–quality trade-offs", alsoKnownAs: ["inference cost optimisation", "inference cost optimization", "latency optimisation", "model selection", "unit economics of AI"], evidence: "Sketch pricing and Bring Your Own Key design" },
  { skill: "Voice AI", alsoKnownAs: ["voice agents", "voice assistant", "speech interfaces", "text-to-speech", "TTS", "speech synthesis"], evidence: "District voice navigation; Audible LLM text-to-speech production" },
  { skill: "Conversational AI", alsoKnownAs: ["chatbots", "conversational interfaces", "dialogue systems", "natural language interfaces", "AI assistants"], evidence: "District and CanvasX AI" },
  { skill: "Neural search", alsoKnownAs: ["semantic search", "vector search", "AI search", "contextual search", "intent understanding", "query understanding", "search relevance"], evidence: "District contextual search: null results 7% to 1.8%" },
  { skill: "Information retrieval", alsoKnownAs: ["IR", "keyword retrieval", "ranking", "retrieval systems", "search ranking"], evidence: "District search retrieval upgrade" },
  { skill: "Knowledge graphs", alsoKnownAs: ["entity graphs", "ontology", "taxonomy", "content metadata", "structured data"], evidence: "Audible content intelligence" },
  { skill: "SQL, Redash, Tableau", alsoKnownAs: ["data analysis", "product analytics", "dashboards", "business intelligence", "BI", "data-driven decision making"], evidence: "All roles" },
  { skill: "Search and discovery", alsoKnownAs: ["search product manager", "discovery product manager", "search PM", "browse and discovery", "recommendations", "curation"], evidence: "District: owns app-wide search and discovery" },
  { skill: "ML-based personalization", alsoKnownAs: ["personalisation", "personalization", "recommender systems", "recommendation systems", "ranking and recommendations", "homepage personalization", "user segmentation", "customer segmentation"], evidence: "District homepage personalization: inventory views +30%; Audible 36 taste segments" },
  { skill: "Consumer app surfaces", alsoKnownAs: ["consumer product management", "B2C product", "mobile apps", "mobile product manager", "growth", "notifications", "push notifications", "lifecycle"], evidence: "District app, notifications charter" },
  { skill: "Developer and creator ecosystems", alsoKnownAs: ["platform product management", "platform PM", "APIs", "API products", "creator economy", "partner ecosystems"], evidence: "Audible creator-payments API" },
  { skill: "Content systems", alsoKnownAs: ["content platforms", "content operations", "content supply chain", "media product management", "publishing systems", "content intelligence"], evidence: "Audible Originals production and publishing platform" },
  { skill: "Payments infrastructure", alsoKnownAs: ["payments", "payouts", "creator payments"], evidence: "Audible creator-payments API: on-time payments 70% to 93%" },
  { skill: "Marketplace platforms", alsoKnownAs: ["two-sided marketplaces", "marketplace product manager", "rights marketplace", "supply and demand"], evidence: "Audible audiobook-to-TV rights business, ~$7M GMV" },
  { skill: "Subscription and pricing models", alsoKnownAs: ["pricing strategy", "monetization", "monetisation", "usage-based pricing", "credit-based pricing", "packaging"], evidence: "Sketch credit tiers; RateGain pricing data products" },
  { skill: "Experimentation and A/B testing", alsoKnownAs: ["A/B tests", "growth experiments", "experiment design", "hypothesis testing", "conversion optimisation"], evidence: "District notifications: day-0 opt-ins +8%" },
  { skill: "International expansion", alsoKnownAs: ["global launches", "localization", "localisation", "multi-market rollout", "internationalization"], evidence: "Audible across 12 markets; RateGain across US, EMEA and APAC" },
  { skill: "0-to-1 incubation", alsoKnownAs: ["zero to one", "0 to 1", "new product development", "product incubation", "greenfield products", "founding product manager", "first product hire"], evidence: "Every role" },
  { skill: "Product vision and roadmaps", alsoKnownAs: ["product strategy", "roadmapping", "roadmap planning", "prioritization", "prioritisation", "product planning"], evidence: "All roles" },
  { skill: "Research-to-product translation", alsoKnownAs: ["applied research", "productionizing ML", "productionising ML", "ML productization", "research prototype to production"], evidence: "Audible text-to-speech pipeline" },
  { skill: "Executive communication", alsoKnownAs: ["stakeholder management", "executive stakeholder management", "leadership communication", "reporting to the CEO", "written narratives"], evidence: "Reports directly to District's CEO" },
  { skill: "Cross-functional alignment", alsoKnownAs: ["cross-functional collaboration", "cross-functional team collaboration", "team collaboration", "cross-functional leadership", "working with engineering and design", "influencing without authority"], evidence: "All roles" },
  { skill: "User validation", alsoKnownAs: ["user research", "customer discovery", "customer interviews", "usability testing", "ethnographic research", "voice of customer"], evidence: "FuboTV ethnographic study; RateGain customer feedback" },
  { skill: "UX design and wireframing", alsoKnownAs: ["product design", "wireframes", "interaction design", "user experience"], evidence: "FuboTV project; District prototypes" },
  { skill: "Go-to-market strategy", alsoKnownAs: ["GTM", "product launches", "product marketing", "sales pipeline", "growth strategy", "product-led growth", "partnerships"], evidence: "CanvasX AI pipeline including a Fortune 100 prospect" },
  { skill: "Forward deployment", alsoKnownAs: ["forward deployed product manager", "forward deployed engineer adjacent", "solutions", "customer implementation", "enterprise deployment"], evidence: "CanvasX AI retail deployment, 25,000 users" },
  { skill: "Web scraping and data products", alsoKnownAs: ["data products", "data infrastructure", "pricing intelligence", "B2B SaaS product management", "travel tech"], evidence: "RateGain DataSURE: scrape success 94% to 98%" },
];

export const teaching = {
  title: "Breathwork & meditation",
  summary:
    "A 1,000-hour-trained breathwork and meditation instructor. Teaches SKY Campus Happiness in the US, and YES!+ and the Happiness Program of Art of Living in India.",
  href: "/meditation",
  cta: "Teaching and workshops",
};

/** Roles this profile is relevant to. Each maps to a title already held. */
export const relevantRoles = [
  "AI Product Manager",
  "Senior Product Manager, AI",
  "Platform Product Manager",
  "Search, discovery and personalization product manager",
  "Product Manager – Technical",
  "Head of Product or Growth at an early-stage AI company",
];

export const engagements = [
  "Product roles in AI, search and platform",
  "Advisory for startups on growth, go-to-market and product craft",
  "Speaking on AI and product building",
];

export type Article = {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  source: string;
};
