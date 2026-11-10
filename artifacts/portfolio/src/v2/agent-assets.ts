// Text and JSON renderings of the content model for browser agents, LLM
// crawlers and scrapers. Pure functions: no file or network access here.
// scripts/build-agent-assets.mjs writes the results into public/.

import {
  origin,
  person,
  links,
  stops,
  projects,
  education,
  skills,
  teaching,
  relevantRoles,
  engagements,
} from "./content.ts";
import type { Article } from "./content.ts";

const abs = (href: string) => (href.startsWith("/") ? `${origin}${href}` : href);
const resumeUrl = abs(links.resume);

const publicPages = [
  { title: "Portfolio", href: "/", note: "Work, projects, writing and contact." },
  { title: "Audible / Amazon case study", href: "/audible", note: "Listener segmentation, content operations, creator payments, TV rights, TTS localization." },
  { title: "RateGain case study", href: "/rategain", note: "Travel-pricing products and the DataSURE scraping framework." },
  { title: "Plaza: the Cornell Tech startup", href: "/cornell", note: "First-person account of a failed grad-school startup." },
  { title: "FuboTV × Cornell Tech", href: "/fubo", note: "UX research and product design for live TV news." },
  { title: "Breathwork and meditation", href: "/meditation", note: "Teaching and workshop updates." },
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
      const head = `### ${stop.role}, ${stop.company}\n${stop.dates.replace(" — ", "–")} · ${stop.place}\n\n${stop.companyNote} ${stop.summary}`;
      const bullets = (detail === "full" ? stop.shipped : stop.shipped.slice(0, 2))
        .map((line) => `- ${line}`)
        .join("\n");
      const more = stop.caseStudy ? `\n\nCase study: ${abs(stop.caseStudy.href)}` : "";
      return `${head}\n\n${bullets}${more}`;
    })
    .join("\n\n");
}

function metricsTable() {
  const rows = stops.flatMap((stop) =>
    stop.metrics.map((metric) => `| ${stop.company} | ${metric.value} | ${metric.label} |`),
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

- Current role: ${stops[0].role}, ${stops[0].company} (${stops[0].dates.replace(" — ", "–")}), ${stops[0].place}
- Based in: ${person.location}. ${person.relocation}.
- Product manager since ${person.since}. MS, Cornell Tech (2021).
- Focus: AI products, search and discovery, personalization, content platforms, 0-to-1 and go-to-market
- Relevant roles: ${relevantRoles.join("; ")}
- Contact: ${person.email} · ${links.linkedin}
- Résumé: ${resumeUrl}

## Experience

${stops
  .map(
    (stop) =>
      `- **${stop.company}** (${stop.dates.replace(" — ", "–")}), ${stop.role}. ${stop.shipped[0]}`,
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
- Current role: ${stops[0].role}, ${stops[0].company} (${stops[0].dates.replace(" — ", "–")})
- Location: ${person.location}. ${person.relocation}.
- Product manager since: ${person.since}
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
  .map((project) => `- **${project.title}** (${project.kind}, ${project.year}). ${project.summary} ${abs(project.href)}`)
  .join("\n")}

## Education

${education
  .map((item) => `- **${item.school}**, ${item.degree} (${item.note}), ${item.year}. ${item.place}.`)
  .join("\n")}

## Skills

${skills.map((group) => `- **${group.group}:** ${group.items.join(", ")}`).join("\n")}

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
${stops.map((stop) => `At ${stop.company}: ${stop.headline.label} ${stop.headline.value}.`).join(" ")} Full list under Results above.

**What kind of product work is he strongest in?**
0-to-1 AI products (contextual search, voice agents, LLM text-to-speech production, agentic workflows), search and personalization on consumer platforms, content and marketplace systems, and go-to-market for early products.

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
        { network: "GitHub", username: "bharatgandhi", url: links.github },
        { network: "Substack", username: "bharatgandhi", url: links.substack },
        { network: "Medium", username: "bg445", url: links.medium },
      ],
    },
    work: stops.map((stop) => ({
      name: stop.company,
      position: stop.role,
      location: stop.place,
      description: stop.companyNote,
      startDate: stop.startDate,
      ...(stop.endDate ? { endDate: stop.endDate } : {}),
      summary: stop.summary,
      highlights: stop.shipped,
      ...(stop.caseStudy ? { url: abs(stop.caseStudy.href) } : {}),
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
      type: project.kind,
      url: abs(project.href),
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
      source: "Generated from the site's content model; figures from the September 2026 résumé.",
    },
  };
  return `${JSON.stringify(profile, null, 2)}\n`;
}
