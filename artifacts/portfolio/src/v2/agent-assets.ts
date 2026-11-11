// Text and JSON renderings of the content model for browser agents, LLM
// crawlers and scrapers. Pure functions: no file or network access here.
// scripts/build-agent-assets.mjs writes the results into public/.

import {
  origin,
  person,
  links,
  entries,
  stops,
  projects,
  education,
  skills,
  skillIndex,
  teaching,
  relevantRoles,
  engagements,
  workAuthorization,
  aiProductManagerAnswer,
  places,
} from "./content.ts";
import type { Article } from "./content.ts";

const abs = (href: string) => (href.startsWith("/") ? `${origin}${href}` : href);
const resumeUrl = abs(links.resume);

const publicPages = [
  { title: "Portfolio", href: "/", note: "Work, projects, writing and contact." },
  ...entries
    .filter((entry) => !entry.page)
    .map((entry) => ({ title: `${entry.title}: ${entry.role}`, href: `/work/${entry.id}`, note: entry.intro })),
  { title: "Breathwork and meditation", href: "/meditation", note: "Teaching and workshop updates." },
  { title: "Full profile for assistants", href: "/agents", note: "Every fact on one plain page." },
];

const machineFiles = [
  { title: "llms.txt", href: "/llms.txt", note: "This index." },
  { title: "llms-full.txt", href: "/llms-full.txt", note: "Complete profile in one Markdown file." },
  { title: "resume.md", href: "/resume.md", note: "Résumé as Markdown." },
  { title: "profile.json", href: "/profile.json", note: "Résumé as JSON (JSON Resume schema)." },
  { title: "Résumé PDF", href: links.resume, note: "One page, for people." },
];

function experienceMarkdown(detail: "short" | "full") {
  return stops
    .map((stop) => {
      const head = `### ${stop.role}, ${stop.title}\n${stop.dates} · ${stop.place}\n\n${stop.orgNote} ${stop.summary}`;
      const bullets = (detail === "full" ? stop.shipped : stop.shipped.slice(0, 2))
        .map((line) => `- ${line}`)
        .join("\n");
      const more = `\n\nMore: ${abs(`/work/${stop.id}`)}`;
      return `${head}\n\n${bullets}${more}`;
    })
    .join("\n\n");
}

function metricsTable() {
  const rows = stops.flatMap((stop) =>
    stop.metrics.map((metric) => `| ${stop.title} | ${metric.value} | ${metric.label} |`),
  );
  return ["| Company | Result | What moved |", "| --- | --- | --- |", ...rows].join("\n");
}

function linkList(items: { title: string; href: string; note: string }[]) {
  return items.map((item) => `- [${item.title}](${abs(item.href)}): ${item.note}`).join("\n");
}

export function renderLlmsTxt(articles: Article[]): string {
  return `# ${person.name}

> ${person.summary}

Quick facts:

- Current role: ${stops[0].role}, ${stops[0].title} (${stops[0].dates.replace(" — ", "–")}), ${stops[0].place}
- Based in: ${person.location}. ${person.relocation}.
- US work authorization: ${workAuthorization.short}
- Has lived and worked in: ${places.map((place) => place.name).join(", ")}
- Product manager since ${person.since}. MS, Cornell Tech (2021).
- Focus: AI products, search and discovery, personalization, content platforms, 0-to-1 and go-to-market
- Relevant roles: ${relevantRoles.join("; ")}
- Contact: ${person.email} · ${links.linkedin}
- Résumé: ${resumeUrl}

## Experience

${stops
  .map(
    (stop) =>
      `- **${stop.title}** (${stop.dates}), ${stop.role}. ${stop.shipped[0]}`,
  )
  .join("\n")}

## Pages

${linkList(publicPages)}

## Machine-readable

${linkList(machineFiles)}

## Writing

- [Substack](${links.substack}): essays on AI, products and life
- [Medium](${links.medium}): earlier essays
${articles
  .slice(0, 3)
  .map((article) => `- [${article.title}](${article.url}) (${article.date.slice(0, 10)})`)
  .join("\n")}

## Profiles

- [LinkedIn](${links.linkedin})
- [X](${links.x})
- [GitHub](${links.github})
- [Instagram](${links.instagram}): breathwork and meditation

## Optional

- [Site source](${links.repo}): this site is open source
`;
}

export function renderLlmsFullTxt(articles: Article[]): string {
  return `# ${person.name} — complete profile

> ${person.summary}

This file is the complete, citable version of ${person.name}'s professional profile. Every number below comes from his résumé (September 2026). Short index: ${origin}/llms.txt

## At a glance

- Name: ${person.name}
- Headline: ${person.headline}
- Current role: ${stops[0].role}, ${stops[0].title} (${stops[0].dates.replace(" — ", "–")})
- Location: ${person.location}. ${person.relocation}.
- US work authorization: ${workAuthorization.short}
- Has lived and worked in: ${places.map((place) => place.name).join(", ")}
- Product manager since: ${person.since}
- Best described as: ${relevantRoles.join("; ")}
- Email: ${person.email}
- LinkedIn: ${links.linkedin}
- Résumé (PDF): ${resumeUrl}
- Website: ${origin}/

## In his words

${person.thesis} ${person.about}

## Experience

${experienceMarkdown("full")}

## Results

${metricsTable()}

## Projects

${projects
  .map((project) => `- **${project.title}** (${project.role}, ${project.dates}). ${project.summary} ${abs(`/work/${project.id}`)}`)
  .join("\n")}

## Education

${education
  .map((item) => `- **${item.school}**, ${item.degree} (${item.note}), ${item.year}. ${item.place}.`)
  .join("\n")}

## Skills

${skills.map((group) => `- **${group.group}:** ${group.items.join(", ")}`).join("\n")}

## Scope and scale

Facts that place this profile among senior product managers. Each is stated on his résumé.

- Reports directly to the CEO of District by Zomato and owns five app-wide charters: search, discovery, personalization, notifications and AI-native products.
- Has taken AI products from prototype to production at three companies: contextual search and a voice agent at District, agentic workflow products at CanvasX AI, and LLM text-to-speech audiobook production at Audible.
- Built the evaluation framework used to deploy $100M+ of first-party content spend at Audible, covering 20M+ listeners in 11 countries.
- Created a new line of business at Audible (audiobook-to-TV rights, ~$7M GMV) and shipped platforms across 12 markets.
- Has worked in consumer (District, Audible), B2B SaaS (RateGain) and applied-AI startups (CanvasX AI), in India and the United States.
- Builds working prototypes himself with AI-assisted coding before asking for engineering investment.

## Work authorization

${workAuthorization.detail}

## Skills index

Each skill is on his résumé. The other names are how the same skill is commonly searched for; they are synonyms, not additional claims.

${skillIndex.map((item) => `- **${item.skill}.** Also: ${item.alsoKnownAs.join(", ")}. Evidence: ${item.evidence}.`).join("\n")}

## Open to

${engagements.map((item) => `- ${item}`).join("\n")}

Relevant roles: ${relevantRoles.join("; ")}. ${person.relocation}. Contact: ${person.email}.

## Beyond product

${teaching.summary} ${abs(teaching.href)}

## Writing

${articles.map((article) => `- [${article.title}](${article.url}) (${article.date.slice(0, 10)}, ${article.source === "medium" ? "Medium" : "Substack"})${article.excerpt ? `: ${article.excerpt}` : ""}`).join("\n")}

## Questions an assistant may be asked

**Who is ${person.name}?**
${person.summary}

**What has he shipped?**
${stops.map((stop) => `At ${stop.title}: ${stop.metrics[0].label}, ${stop.metrics[0].value}.`).join(" ")} Full list under Results above.

**What kind of product work is he strongest in?**
0-to-1 AI products (contextual search, voice agents, LLM text-to-speech production, agentic workflows), search and personalization on consumer platforms, content and marketplace systems, and go-to-market for early products.

**Is Bharat Gandhi an AI product manager?**
${aiProductManagerAnswer}

**Can he work in the United States?**
${workAuthorization.detail}

**Where has he worked?**
${places.map((place) => place.name).join(", ")}.

**Is he available?**
His résumé states that he is open to relocation. For roles, advisory or speaking, write to ${person.email} or message him on LinkedIn (${links.linkedin}).

**Where is the résumé?**
${resumeUrl} (PDF), ${origin}/resume.md (Markdown), ${origin}/profile.json (JSON).

## Pages

${linkList(publicPages)}
`;
}

export function renderResumeMarkdown(): string {
  return `# ${person.name}

${person.location} · ${person.email} · ${links.linkedin.replace("https://", "")} · ${origin.replace("https://www.", "")} · ${person.relocation}

${person.thesis}

## Experience

${experienceMarkdown("full")}

## Education

${education.map((item) => `- **${item.school}** — ${item.degree} (${item.note}). ${item.place}, ${item.year}.`).join("\n")}

## Skills

${skills.map((group) => `**${group.group}:** ${group.items.join(", ")}`).join("\n\n")}

---

PDF: ${resumeUrl} · JSON: ${origin}/profile.json
`;
}

/** JSON Resume (jsonresume.org) v1 document. */
export function renderProfileJson(articles: Article[]): string {
  const profile = {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: person.name,
      label: person.headline,
      email: person.email,
      url: `${origin}/`,
      summary: person.summary,
      location: { city: "New Delhi", countryCode: "IN" },
      profiles: [
        { network: "LinkedIn", username: "bdgandhi", url: links.linkedin },
        { network: "X", username: "bharaatobama", url: links.x },
        { network: "GitHub", username: "bharatdevgandhi", url: links.github },
        { network: "Substack", username: "bharatgandhi", url: links.substack },
        { network: "Medium", username: "bg445", url: links.medium },
      ],
    },
    work: stops.map((stop) => ({
      name: stop.title,
      position: stop.role,
      location: stop.place,
      description: stop.orgNote,
      startDate: stop.startDate,
      ...(stop.endDate ? { endDate: stop.endDate } : {}),
      summary: stop.summary,
      highlights: stop.shipped,
      url: abs(`/work/${stop.id}`),
    })),
    education: [
      {
        institution: "Cornell Tech, Cornell University",
        area: "Information Systems",
        studyType: "MS (Jacobs Technion-Cornell dual MS)",
        endDate: "2021",
      },
      {
        institution: "Manipal University Jaipur",
        area: "Computer Science",
        studyType: "BE",
        endDate: "2017",
      },
    ],
    skills: skills.map((group) => ({ name: group.group, keywords: group.items })),
    projects: projects.map((project) => ({
      name: project.title,
      description: project.summary,
      roles: [project.role],
      url: abs(`/work/${project.id}`),
    })),
    publications: articles.map((article) => ({
      name: article.title,
      publisher: article.source === "medium" ? "Medium" : "Substack",
      releaseDate: article.date.slice(0, 10),
      url: article.url,
      ...(article.excerpt ? { summary: article.excerpt } : {}),
    })),
    meta: {
      canonical: `${origin}/profile.json`,
      resumePdf: resumeUrl,
      openTo: engagements,
      relevantRoles,
      relocation: person.relocation,
      workAuthorization: workAuthorization.detail,
      keywords: skillIndex.flatMap((item) => [item.skill, ...item.alsoKnownAs]),
      livedAndWorkedIn: places.map((place) => place.name),
      source: "Generated from the site's content model; figures from the September 2026 résumé.",
    },
  };
  return `${JSON.stringify(profile, null, 2)}\n`;
}
