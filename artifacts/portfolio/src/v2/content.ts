// Single source of truth for the v2 portfolio.
//
// Everything a visitor can read — the gallery, the Cosmos board, the agent
// view, llms.txt, llms-full.txt, resume.md, profile.json and JSON-LD — is
// rendered from this file. Facts come from the September 2026 résumé and the
// existing site. Change a fact here once and every surface updates.
//
// Keep this file dependency-free and free of non-erasable TypeScript syntax:
// Node imports it directly (type stripping) when generating agent assets.

export const origin = "https://www.bharatdevgandhi.com";

export type PlateKind =
  | "search"
  | "agents"
  | "taste"
  | "pricing"
  | "threads"
  | "screens"
  | "festival"
  | "source"
  | "breath"
  | "island"
  | "lines";

export type Metric = {
  /** Short display value, e.g. "7% → 1.8%". */
  value: string;
  /** What moved. */
  label: string;
};

export type Stop = {
  id: string;
  /** Position in the guide; reverse-chronological, so 01 is where he is now. */
  no: string;
  company: string;
  /** One-line description of the company, for readers who don't know it. */
  companyNote: string;
  role: string;
  dates: string;
  startDate: string;
  endDate: string | null;
  place: string;
  coords: string;
  headline: Metric;
  /** One sentence, trimmed for a phone screen. */
  summary: string;
  metrics: Metric[];
  /** Full résumé bullets. Shown behind a disclosure and in agent surfaces. */
  shipped: string[];
  tags: string[];
  plate: PlateKind;
  caseStudy?: { href: string; label: string };
  external?: { href: string; label: string };
};

export type Project = {
  id: string;
  title: string;
  kind: string;
  year: string;
  summary: string;
  plate: PlateKind;
  href: string;
  internal: boolean;
  cta: string;
};

export const person = {
  name: "Bharat Gandhi",
  givenName: "Bharat",
  familyName: "Gandhi",
  headline: "AI & Platform Product Manager",
  /** The hero sentence. Preserved from the current site. */
  thesis: "I build AI products and take them to market.",
  now: "Platform Product Manager at District by Zomato, leading search, discovery, personalization and AI-native products.",
  /** The message behind the hero's rising line. */
  curveCaption: "From the ground up: flat for a long time, then not.",
  about:
    "I enjoy growing and building things from the ground up. I own app-wide search, discovery, personalization, notifications and AI-native products at District by Zomato, reporting directly to the CEO. Before that: agentic workflow products at CanvasX AI, content intelligence and production platforms at Audible/Amazon, and travel-pricing data products at RateGain.",
  summary:
    "Bharat Gandhi is a product manager who builds AI products and takes them to market. He is Platform Product Manager at District by Zomato (Eternal Ltd.), where he owns app-wide search, discovery, personalization, notifications and AI-native products and reports directly to the CEO. Previously he led product and growth in an advisory role at CanvasX AI, was Product Manager – Tech for Audible Originals and Content Systems at Amazon, and was a Product Manager at RateGain. He holds an MS in Information Systems from Cornell Tech.",
  location: "New Delhi, India",
  coords: "28.61° N, 77.21° E",
  relocation: "Open to relocation",
  since: "2018",
  email: "bharatgandhi.sf@gmail.com",
  portrait: {
    alt: "Bharat Gandhi standing in a city square at night, in front of a monument lit in blue",
    caption: "Place de la République, Paris",
  },
} as const;

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
  { label: "LinkedIn", href: links.linkedin },
  { label: "X", href: links.x },
  { label: "Substack", href: links.substack },
  { label: "Medium", href: links.medium },
  { label: "GitHub", href: links.github },
];

export const stops: Stop[] = [
  {
    id: "district",
    no: "01",
    company: "District by Zomato",
    companyNote:
      "Zomato's going-out platform spanning dining-out, movies and live events (Eternal Ltd.).",
    role: "Platform Product Manager",
    dates: "Apr 2026 — Present",
    startDate: "2026-04",
    endDate: null,
    place: "Gurugram",
    coords: "28.46° N, 77.03° E",
    headline: { value: "7% → 1.8%", label: "null-result searches" },
    summary:
      "Own search, discovery, personalization, notifications and AI-native products end to end. Report directly to the CEO.",
    metrics: [
      { value: "7% → 1.8%", label: "null-result searches" },
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
    tags: ["AI", "Search", "Personalization", "B2C", "0→1"],
    plate: "search",
  },
  {
    id: "canvasx",
    no: "02",
    company: "CanvasX AI",
    companyNote: "Applied-AI lab building agentic workflow products for SMBs.",
    role: "Head of Product & Growth (Advisory)",
    dates: "Jan 2025 — Apr 2026",
    startDate: "2025-01",
    endDate: "2026-04",
    place: "Remote · India, US, Europe",
    coords: "Remote",
    headline: { value: "25+", label: "SMB teams on Sketch" },
    summary:
      "Led product strategy, go-to-market, partnerships and forward deployment for agentic workflow products.",
    metrics: [
      { value: "25+", label: "SMB teams in India adopted Sketch" },
      { value: "25,000", label: "users on a retail agentic deployment" },
      { value: "+8%", label: "incentive-achievement rate in 60 days" },
    ],
    shipped: [
      "Drove 0-to-1 product strategy and deployment for agentic AI products, translating customer workflows into production implementations across multiple markets.",
      "Architected the product, pricing and deployment model for Sketch, a multiplayer agentic workflow harness with credit-based consumption tiers and Bring Your Own Key options that balance inference cost, latency and output quality. Adopted by 25+ SMB teams in India.",
      "Built the sales pipeline from scratch, including the first Fortune 100 prospect and SMB opportunities across India, Dubai and the EU.",
      "Led forward deployment of an agentic data-analysis product for an omnichannel retail client with 25,000 users, increasing incentive-achievement rates by 8% within 60 days of launch.",
    ],
    tags: ["AI", "Agents", "GTM", "Pricing", "B2B", "0→1"],
    plate: "agents",
    external: { href: "https://getsketch.ai", label: "getsketch.ai" },
  },
  {
    id: "audible",
    no: "03",
    company: "Audible / Amazon",
    companyNote: "Audible Originals and Studios, across global marketplaces.",
    role: "Product Manager – Tech, Audible Originals & Content Systems",
    dates: "Aug 2021 — Dec 2024",
    startDate: "2021-08",
    endDate: "2024-12",
    place: "New York",
    coords: "40.71° N, 74.01° W",
    headline: { value: "20M+", label: "listeners segmented by taste" },
    summary:
      "Owned content intelligence, monetization and production platforms for Audible Originals and Studios.",
    metrics: [
      { value: "20M+", label: "listeners in 36 taste categories, 11 countries" },
      { value: "$100M+", label: "content spend evaluated with the framework" },
      { value: "~$7M", label: "GMV from a new audiobook-to-TV rights business" },
      { value: "−50%", label: "audiobook time-to-market, 12 markets" },
      { value: "70% → 93%", label: "error-free, on-time creator payments" },
    ],
    shipped: [
      "Developed and operationalized ML segmentation of 20M+ listeners into 36 taste categories across Audible and Amazon in 11 countries. It became the standard evaluation framework for deploying $100M+ in first-party content production over 2 years.",
      "Took LLM-based text-to-speech audiobook production from research prototype to production pipeline, reducing localization timelines by 36% across 3 languages and expanding the monetizable catalog into 8+ countries.",
      "Created a new audiobook-to-TV rights business generating ~$7M GMV: a platform for global TV producers to discover and acquire first-party content rights.",
      "Launched a creator-payments API for the publisher and creator ecosystem, improving error-free, on-time payments from 70% to 93% across 12 markets within 2 quarters.",
      "Established the global source of truth for production, deals and publishing operations, cutting audiobook time-to-market by 50% and podcast time-to-market by 70% across 12 markets. It also powered Audible Brazil's $12M content-acquisition program with an operations suite taken from idea to deployment in 2 weeks.",
    ],
    tags: ["AI", "Content", "Marketplace", "Payments", "B2C", "0→1"],
    plate: "taste",
    caseStudy: { href: "/audible", label: "Audible case study" },
  },
  {
    id: "rategain",
    no: "04",
    company: "RateGain",
    companyNote: "B2B SaaS travel-pricing intelligence platform.",
    role: "Product Manager",
    dates: "Jan 2018 — Jun 2019",
    startDate: "2018-01",
    endDate: "2019-06",
    place: "Noida",
    coords: "28.54° N, 77.39° E",
    headline: { value: "+40%", label: "revenue in 3 quarters" },
    summary:
      "Owned scraping infrastructure and travel-pricing data products. Converted from intern to PM.",
    metrics: [
      { value: "+40%", label: "revenue over 3 quarters" },
      { value: "94% → 98%", label: "successful scrapes across 550+ bots" },
      { value: "+25", label: "NPS points in 2 quarters" },
      { value: "~10%", label: "revenue uplift per airline customer" },
    ],
    shipped: [
      "Translated customer feedback into new data products, including one-click on-demand scraping, Airbnb pricing intelligence and pricing-difference previews, contributing to a 40% revenue increase over 3 quarters.",
      "Launched geo-located scraping and won customers across the US, EMEA and APAC.",
      "Engineered the DataSURE ML framework, increasing successful-scrape rates from 94% to 98% across 550+ bots and lifting NPS by 25 points within 2 quarters.",
      "As an intern (Jan–Jun 2018), delivered an airline-pricing product from scratch that enabled ~10% revenue uplift per customer.",
    ],
    tags: ["Data", "ML", "B2B", "SaaS", "0→1"],
    plate: "pricing",
    caseStudy: { href: "/rategain", label: "RateGain case study" },
  },
];

export const current = stops[0];

export const projects: Project[] = [
  {
    id: "plaza",
    title: "Plaza",
    kind: "Startup",
    year: "2019–21",
    summary:
      "A grad-school startup for universal comments across the internet. It failed. What we built, and why it didn't work.",
    plate: "threads",
    href: "/cornell",
    internal: true,
    cta: "Read the story",
  },
  {
    id: "fubo",
    title: "FuboTV × Cornell Tech",
    kind: "UX research",
    year: "2019",
    summary:
      "Ethnographic research into why cord-cutters skip live TV news, and a multi-source viewing experience built around viewer control.",
    plate: "screens",
    href: "/fubo",
    internal: true,
    cta: "Read the case study",
  },
  {
    id: "oneiros",
    title: "MUJ Oneiros",
    kind: "Live events",
    year: "2013–17",
    summary:
      "Architected Rajasthan's biggest student-run cultural festival by footfall, on a 300-student ecosystem producing weekly live events.",
    plate: "festival",
    href: "https://www.youtube.com/results?search_query=MUJ+Oneiros+aftermovie",
    internal: false,
    cta: "Watch the aftermovie",
  },
  {
    id: "this-site",
    title: "This site",
    kind: "Open source",
    year: "2026",
    summary:
      "Built with AI-assisted coding. One content model renders the gallery for people and llms.txt, JSON and structured data for agents and search engines.",
    plate: "source",
    href: links.repo,
    internal: false,
    cta: "View the source",
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
    coords: "40.76° N, 73.96° W",
    plate: "island" as PlateKind,
  },
  {
    id: "manipal",
    school: "Manipal University Jaipur",
    degree: "BE, Computer Science",
    note: "Founded a filmmaking society; led multiple student bodies",
    year: "2017",
    place: "Jaipur, India",
    coords: "26.91° N, 75.79° E",
    plate: "lines" as PlateKind,
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

export const teaching = {
  title: "Breathwork & meditation",
  summary:
    "A 1,000-hour-trained breathwork and meditation instructor. Teaches SKY Campus Happiness in the US, and YES!+ and the Happiness Program of Art of Living in India.",
  href: "/meditation",
  cta: "Teaching and workshops",
  plate: "breath" as PlateKind,
};

/** Roles this profile is relevant to. Each maps to a title already held. */
export const relevantRoles = [
  "AI Product Manager",
  "Platform Product Manager",
  "Search, discovery and personalization product lead",
  "Product Manager – Technical",
  "Head of Product or Growth at an early-stage AI company",
];

export const engagements = [
  "Product roles in AI, search and platform",
  "Advisory for startups on growth, go-to-market and product craft",
  "Speaking on AI and product building",
];

/** Waypoints along the hero curve, in the curve's 1200 × 600 drawing space. */
export const waypoints = [
  { year: "2018", label: "RateGain", x: 150, y: 500 },
  { year: "2019", label: "Cornell Tech", x: 390, y: 498 },
  { year: "2021", label: "Audible", x: 640, y: 493 },
  { year: "2025", label: "CanvasX AI", x: 872, y: 459 },
  { year: "2026", label: "District", x: 1004, y: 290 },
];

export type Article = {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  source: string;
};
