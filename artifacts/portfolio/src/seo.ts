import writing from "@/data/writing.json";
import { getWorkshopStatus, meditationFaqs, upcomingMeditationWorkshops } from "@/data/meditation";
import * as v2 from "@/v2/content";

export const siteOrigin = "https://www.bharatdevgandhi.com";
export const personId = `${siteOrigin}/#person`;
export const siteId = `${siteOrigin}/#website`;
export const socialImage = `${siteOrigin}/opengraph.jpg`;

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogType: "website" | "article";
  /** Preview routes: served and crawlable, but kept out of the index and sitemap. */
  noindex?: boolean;
  /** Social preview image, when it differs from the site default. */
  image?: string;
  structuredData: Record<string, unknown>[];
};

const person = {
  "@type": "Person",
  "@id": personId,
  name: "Bharat Gandhi",
  url: siteOrigin,
  jobTitle: "Platform Product Manager",
  description:
    "Bharat Gandhi is a product manager at District by Zomato. His work spans search, discovery, personalization, notifications and AI-native products. Previously, he worked at CanvasX AI, Audible/Amazon and RateGain.",
  sameAs: [
    "https://linkedin.com/in/bdgandhi",
    "https://x.com/bharaatobama",
    "https://bharatgandhi.substack.com",
    "https://bg445.medium.com/",
    "https://github.com/bharatgandhi",
    "https://www.instagram.com/betterbharaat",
  ],
  worksFor: {
    "@type": "Organization",
    name: "District by Zomato",
    parentOrganization: {
      "@type": "Organization",
      name: "Eternal Ltd.",
    },
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Cornell University" },
    { "@type": "CollegeOrUniversity", name: "Manipal University Jaipur" },
  ],
  hasOccupation: [
    {
      "@type": "Occupation",
      name: "Platform Product Manager",
      description:
        "District by Zomato (Eternal Ltd.), April 2026–present. Leads search, discovery, personalization, notifications and AI-native products.",
    },
    {
      "@type": "Occupation",
      name: "Head of Product & Growth (Advisory)",
      description:
        "CanvasX AI, January 2025–April 2026. Led product strategy, go-to-market, partnerships and forward deployment for agentic workflow products.",
    },
    {
      "@type": "Occupation",
      name: "Product Manager – Tech, Audible Originals & Content Systems",
      description:
        "Amazon / Audible, August 2021–December 2024. Owned content intelligence, monetization and production platforms.",
    },
    {
      "@type": "Occupation",
      name: "Product Manager",
      description:
        "RateGain, January 2018–June 2019. Owned travel-pricing data products and scraping infrastructure.",
    },
  ],
  knowsAbout: [
    "Product management",
    "Artificial intelligence",
    "Agentic workflows",
    "Search and discovery",
    "Machine learning",
    "Personalization",
    "Go-to-market strategy",
    "Content systems",
    "Breathwork and meditation",
  ],
};

const website = {
  "@type": "WebSite",
  "@id": siteId,
  name: "Bharat Gandhi",
  url: siteOrigin,
  inLanguage: "en",
  publisher: { "@id": personId },
};

function pageSchema(page: Omit<SeoPage, "structuredData">, mainEntity?: Record<string, unknown>) {
  return {
    "@type": "WebPage",
    "@id": `${page.canonical}#webpage`,
    url: page.canonical,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": siteId },
    about: { "@id": personId },
    ...(mainEntity ? { mainEntity } : {}),
    inLanguage: "en",
  };
}

function creativeWork(
  id: string,
  name: string,
  description: string,
  about?: Record<string, unknown>[],
) {
  return {
    "@type": "CreativeWork",
    "@id": `${siteOrigin}${id}#work`,
    name,
    description,
    url: `${siteOrigin}${id}`,
    author: { "@id": personId },
    ...(about ? { about } : {}),
  };
}

const writingList = {
  "@type": "ItemList",
  name: "Selected writing by Bharat Gandhi",
  itemListElement: writing.articles.map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Article",
      headline: article.title,
      url: article.url,
      author: { "@id": personId },
      publisher: {
        "@type": "Organization",
        name: article.source === "medium" ? "Medium" : "Substack",
      },
      ...(article.date ? { datePublished: article.date.slice(0, 10) } : {}),
    },
  })),
};

const pageDefinitions: Omit<SeoPage, "structuredData">[] = [
  {
    path: "/",
    title: "Bharat Gandhi — Product Manager, AI & Platform",
    description:
      "Bharat Gandhi is a Platform Product Manager at District by Zomato, building search, discovery, personalization and AI products. Explore his work, writing and meditation teaching.",
    canonical: `${siteOrigin}/`,
    ogType: "website",
  },
  {
    path: "/cornell",
    title: "Cornell Tech Startup — What We Built and Why It Failed",
    description:
      "Bharat Gandhi reflects on a startup built during Cornell Tech graduate school, why the business did not work, and lessons on distribution and validation.",
    canonical: `${siteOrigin}/cornell`,
    ogType: "article",
  },
  {
    path: "/audible",
    title: "Audible Originals — Product Case Study by Bharat Gandhi",
    description:
      "Bharat Gandhi's Audible/Amazon case study covers listener segmentation, content operations, creator payments, audiobook localization and TV rights.",
    canonical: `${siteOrigin}/audible`,
    ogType: "article",
  },
  {
    path: "/rategain",
    title: "RateGain Travel Pricing — Product Case Study",
    description:
      "Bharat Gandhi's RateGain case study covers travel-pricing products, the DataSURE scraping framework and product work from 2018 to 2019.",
    canonical: `${siteOrigin}/rategain`,
    ogType: "article",
  },
  {
    path: "/fubo",
    title: "FuboTV × Cornell Tech — Live TV News Project",
    description:
      "A Cornell Tech project by Bharat Gandhi on UX research and product design for a multi-source live TV news experience with FuboTV.",
    canonical: `${siteOrigin}/fubo`,
    ogType: "article",
  },
  {
    path: "/meditation",
    title: "Meditation & Breathwork with Bharat Gandhi",
    description:
      "Bharat Gandhi teaches breathwork and meditation for young adults. Learn about his teaching, the programs he teaches and workshop updates.",
    canonical: `${siteOrigin}/meditation`,
    ogType: "website",
  },
];

// ---- v2 preview routes -------------------------------------------------
// The redesign lives under /v2 until it is approved. These pages are noindex
// and absent from the sitemap, so the live site's search presence does not
// change. Promoting v2 means moving these definitions to "/", "/work/:id"
// and "/agents" and dropping `noindex`.
export const v2SocialImage = `${siteOrigin}/opengraph-v2.jpg`;

const v2Home: Omit<SeoPage, "structuredData"> = {
  path: "/v2",
  title: "Bharat Gandhi: AI Product Manager | Search, Personalization & Platform",
  description:
    "Bharat Gandhi is an AI product manager: Platform PM at District by Zomato, previously Audible/Amazon and CanvasX AI. Work in AI search, personalization, agentic products and content platforms.",
  canonical: `${siteOrigin}/v2`,
  ogType: "website",
  noindex: true,
  image: v2SocialImage,
};

const v2Agents: Omit<SeoPage, "structuredData"> = {
  path: "/v2/agents",
  title: "Bharat Gandhi, AI Product Manager: Full Profile, Skills and Results",
  description:
    "Complete profile of AI product manager Bharat Gandhi: current role, measured results, experience, every skill with its common names, education, work authorization, résumé and contact.",
  canonical: `${siteOrigin}/v2/agents`,
  ogType: "website",
  noindex: true,
  image: v2SocialImage,
};

const v2EntryPages: Omit<SeoPage, "structuredData">[] = v2.entries.map((entry) => ({
  path: `/v2/work/${entry.id}`,
  title: `${entry.title}: ${entry.role} | Bharat Gandhi`,
  description: `${entry.intro} ${entry.summary}`.slice(0, 280),
  canonical: `${siteOrigin}/v2/work/${entry.id}`,
  ogType: "article" as const,
  noindex: true,
  image: v2SocialImage,
}));

// A fuller Person for the profile pages: what a recruiter's search or an
// assistant answering "who is an AI product manager with search experience"
// needs to match.
const profilePerson = {
  ...person,
  jobTitle: ["Platform Product Manager", "AI Product Manager"],
  givenName: v2.person.givenName,
  familyName: v2.person.familyName,
  description: v2.person.summary,
  image: v2SocialImage,
  email: `mailto:${v2.person.email}`,
  address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
  homeLocation: { "@type": "City", name: "New Delhi" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Cornell Tech, Cornell University", sameAs: "https://tech.cornell.edu/" },
    { "@type": "CollegeOrUniversity", name: "Manipal University Jaipur", sameAs: "https://jaipur.manipal.edu/" },
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "MS, Information Systems (Jacobs Technion-Cornell dual MS)",
      credentialCategory: "degree",
      educationalLevel: "Master's degree",
      recognizedBy: { "@type": "CollegeOrUniversity", name: "Cornell University" },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "BE, Computer Science",
      credentialCategory: "degree",
      educationalLevel: "Bachelor's degree",
      recognizedBy: { "@type": "CollegeOrUniversity", name: "Manipal University Jaipur" },
    },
  ],
  hasOccupation: v2.stops.map((stop) => ({
    "@type": "Occupation",
    name: stop.role,
    description: `${stop.title}, ${stop.dates}. ${stop.intro}`,
    occupationLocation: { "@type": "Place", name: stop.place },
    skills: stop.tags.join(", "),
  })),
  knowsAbout: v2.skillIndex.map((item) => item.skill),
  subjectOf: [
    { "@type": "DigitalDocument", name: "Résumé (PDF)", url: `${siteOrigin}${v2.links.resume}`, encodingFormat: "application/pdf" },
    { "@type": "DigitalDocument", name: "Profile (JSON Resume)", url: `${siteOrigin}/profile.json`, encodingFormat: "application/json" },
    { "@type": "DigitalDocument", name: "Full profile (Markdown)", url: `${siteOrigin}/llms-full.txt`, encodingFormat: "text/plain" },
  ],
};

const v2WorkList = {
  "@type": "ItemList",
  name: "Product work by Bharat Gandhi",
  itemListElement: v2.entries.map((entry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "CreativeWork",
      name: `${entry.title}: ${entry.role}`,
      description: entry.intro,
      url: `${siteOrigin}/v2/work/${entry.id}`,
      author: { "@id": personId },
    },
  })),
};

function v2Profile(page: Omit<SeoPage, "structuredData">, agents: boolean) {
  return [
    agents
      ? {
          ...profilePerson,
          // Stated for machines only; the human pages do not show it.
          disambiguatingDescription: v2.workAuthorization.short,
          knowsAbout: v2.skillIndex.flatMap((item) => [item.skill, ...item.alsoKnownAs]),
        }
      : profilePerson,
    {
      "@type": "ProfilePage",
      "@id": `${page.canonical}#webpage`,
      url: page.canonical,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": siteId },
      about: { "@id": personId },
      mainEntity: { "@id": personId },
      primaryImageOfPage: v2SocialImage,
      inLanguage: "en",
      ...(agents ? {} : { hasPart: [v2WorkList, writingList] }),
    },
  ];
}

function v2EntryData(page: Omit<SeoPage, "structuredData">, entry: (typeof v2.entries)[number]) {
  return [
    person,
    {
      "@type": "WebPage",
      "@id": `${page.canonical}#webpage`,
      url: page.canonical,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": siteId },
      about: { "@id": personId },
      inLanguage: "en",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteOrigin}/v2` },
          { "@type": "ListItem", position: 2, name: entry.title, item: page.canonical },
        ],
      },
      mainEntity: {
        "@type": "CreativeWork",
        name: `${entry.title}: ${entry.role}`,
        description: entry.summary,
        author: { "@id": personId },
        keywords: entry.tags.join(", "),
        about: entry.orgs.map((id) => ({ "@type": "Organization", name: v2.orgs[id].name, url: v2.orgs[id].url })),
      },
    },
  ];
}

const v2SeoPages: SeoPage[] = [
  { ...v2Home, structuredData: v2Profile(v2Home, false) },
  ...v2EntryPages.map((page, index) => ({ ...page, structuredData: v2EntryData(page, v2.entries[index]) })),
  { ...v2Agents, structuredData: v2Profile(v2Agents, true) },
];

const worksByPath: Record<string, Record<string, unknown>> = {
  "/cornell": creativeWork(
    "/cornell",
    "The Cornell Tech Attempt: What We Built and Why It Failed",
    "A first-person account of building a startup during Cornell Tech graduate school and learning about distribution, commercial validation and product-market fit.",
    [{ "@type": "Organization", name: "Cornell Tech, Cornell University" }],
  ),
  "/audible": creativeWork(
    "/audible",
    "Building the Backbone of Audible Originals",
    "A case study of Bharat Gandhi's product work across Audible Originals content intelligence, monetization and production platforms.",
    [
      { "@type": "Organization", name: "Audible" },
      { "@type": "Organization", name: "Amazon" },
    ],
  ),
  "/rategain": creativeWork(
    "/rategain",
    "RateGain Travel Pricing Products and Scraping Infrastructure",
    "A case study of Bharat Gandhi's travel-pricing product and scraping-infrastructure work at RateGain.",
    [{ "@type": "Organization", name: "RateGain" }],
  ),
  "/fubo": creativeWork(
    "/fubo",
    "Reinventing Live TV News — FuboTV × Cornell Tech",
    "A Cornell Tech project describing UX research and product design for a multi-source live news viewing experience.",
    [
      { "@type": "Organization", name: "FuboTV" },
      { "@type": "Organization", name: "Cornell Tech, Cornell University" },
    ],
  ),
};

function getMeditationEvents(now: number) {
  return upcomingMeditationWorkshops.filter(
  (workshop) => getWorkshopStatus(workshop, now) !== "ended",
).map((workshop) => ({
  "@type": "Event",
  "@id": `${siteOrigin}/meditation#${workshop.id}`,
  name: workshop.title,
  description: `${workshop.date}, ${workshop.time} ${workshop.timezone}. Online workshop with Bharat Gandhi, in ${workshop.languages.join(" and ")}.`,
  url: `${siteOrigin}/meditation#${workshop.id}`,
  startDate: workshop.startDate,
  endDate: workshop.endDate,
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "VirtualLocation",
    url: workshop.sourceUrl,
  },
  eventSchedule: {
    "@type": "Schedule",
    startDate: workshop.startDate.slice(0, 10),
    endDate: workshop.endDate.slice(0, 10),
    startTime: workshop.startDate.slice(11, 19),
    endTime: workshop.endDate.slice(11, 19),
    repeatFrequency: "P1D",
    scheduleTimezone: "Asia/Kolkata",
  },
  inLanguage: workshop.languages.map((name) => name === "Hindi" ? "hi" : "en"),
  organizer: { "@type": "Organization", name: "The Art of Living", url: workshop.sourceUrl },
  performer: { "@id": personId },
  offers: {
    "@type": "Offer",
    url: workshop.registrationUrl,
    price: workshop.contribution,
    priceCurrency: workshop.currency,
    validThrough: workshop.endDate,
  },
}));
}

export function getSeoPages(now = Date.now()): SeoPage[] {
  const meditationEvents = getMeditationEvents(now);
  return [...pageDefinitions.map((page) => {
  const mainEntity =
    worksByPath[page.path] ??
    (page.path === "/meditation"
      ? {
          "@type": "Service",
          name: "Breathwork and meditation teaching",
          serviceType: "Breathwork and meditation instruction",
          description:
            "Bharat Gandhi teaches SKY Campus Happiness in the US, and YES!+ and the Happiness Program of Art of Living in India.",
          provider: { "@id": personId },
          areaServed: ["United States", "India"],
        }
      : { "@id": personId });

  const pageData = {
    ...pageSchema(page, mainEntity),
    ...(page.path === "/" ? { hasPart: writingList } : {}),
    ...(page.path === "/meditation" ? {
      hasPart: [
        ...meditationEvents.map((event) => ({ "@id": event["@id"] })),
        { "@id": `${siteOrigin}/meditation#participant-questions` },
      ],
    } : {}),
  };

  return {
    ...page,
    structuredData: [
      person,
      ...(page.path === "/" ? [website] : []),
      pageData,
      ...(worksByPath[page.path] ? [worksByPath[page.path]] : []),
      ...(page.path === "/meditation" ? [mainEntity] : []),
      ...(page.path === "/meditation" ? [
        ...meditationEvents,
        {
          "@type": "FAQPage",
          "@id": `${siteOrigin}/meditation#participant-questions`,
          mainEntity: meditationFaqs.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        },
      ] : []),
    ],
  };
}), ...v2SeoPages];
}

export const seoPages = getSeoPages();
