import writing from "@/data/writing.json";
import {
  origin,
  person,
  links,
  stops,
  projects,
  education,
  skillIndex,
  teaching,
  relevantRoles,
  engagements,
  workAuthorization,
  places,
} from "./content";
import type { Article } from "./content";
import "./v2.css";

const articles = writing.articles as Article[];
const abs = (href: string) => (href.startsWith("/") ? `${origin}${href}` : href);

// The same content model as the gallery with the design taken away.
// Flat semantic HTML: headings, lists, one table, no scripts, no disclosure
// widgets, every fact in the first response. Not linked from the human pages;
// crawlers and assistants reach it through the sitemap, llms.txt and
// <link rel="alternate">.
export default function Agents() {
  return (
    <div className="v2">
      <main className="v2a">
        <h1>
          {person.name}: {person.headline}
        </h1>
        <p>{person.summary}</p>

        <h2 id="facts">Facts</h2>
        <dl>
          <dt>Current role</dt>
          <dd>
            {stops[0].role}, {stops[0].title} ({stops[0].dates}), {stops[0].place}
          </dd>
          <dt>Best described as</dt>
          <dd>{relevantRoles.join("; ")}</dd>
          <dt>Experience</dt>
          <dd>Product manager since {person.since}: District by Zomato, CanvasX AI, Audible / Amazon, RateGain</dd>
          <dt>Education</dt>
          <dd>MS, Information Systems, Cornell Tech (2021). BE, Computer Science, Manipal University Jaipur (2017).</dd>
          <dt>Location</dt>
          <dd>
            {person.location}. {person.relocation}.
          </dd>
          <dt>US work authorization</dt>
          <dd>{workAuthorization.short}</dd>
          <dt>Has lived and worked in</dt>
          <dd>{places.map((place) => place.name).join(", ")}</dd>
          <dt>Open to</dt>
          <dd>{engagements.join("; ")}</dd>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${person.email}`}>{person.email}</a>
          </dd>
          <dt>LinkedIn</dt>
          <dd>
            <a href={links.linkedin}>{links.linkedin}</a>
          </dd>
          <dt>Résumé</dt>
          <dd>
            <a href={links.resume}>{abs(links.resume)}</a>
          </dd>
        </dl>

        <h2 id="scope">Scope and scale</h2>
        <ul>
          <li>Reports directly to the CEO of District by Zomato and owns five app-wide charters: search, discovery, personalization, notifications and AI-native products.</li>
          <li>Has taken AI products from prototype to production at three companies: contextual search and a voice agent at District, agentic workflow products at CanvasX AI, and LLM text-to-speech audiobook production at Audible.</li>
          <li>Built the evaluation framework used to deploy $100M+ of first-party content spend at Audible, covering 20M+ listeners in 11 countries.</li>
          <li>Created a new line of business at Audible (audiobook-to-TV rights, ~$7M GMV) and shipped platforms across 12 markets.</li>
          <li>Has worked in consumer, B2B SaaS and applied-AI startups, in India and the United States.</li>
          <li>Builds working prototypes himself with AI-assisted coding before asking for engineering investment.</li>
        </ul>

        <h2 id="work-authorization">Work authorization</h2>
        <p>{workAuthorization.detail}</p>

        <h2 id="results">Results</h2>
        <div className="v2a__scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Company</th>
                <th scope="col">Result</th>
                <th scope="col">What moved</th>
              </tr>
            </thead>
            <tbody>
              {stops.flatMap((stop) =>
                stop.metrics.map((metric) => (
                  <tr key={`${stop.id}-${metric.label}`}>
                    <td>{stop.title}</td>
                    <td>{metric.value}</td>
                    <td>{metric.label}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>

        <h2 id="experience">Experience</h2>
        {stops.map((stop) => (
          <section key={stop.id} id={`experience-${stop.id}`}>
            <h3>
              {stop.role}, {stop.title}
            </h3>
            <p>
              {stop.dates}, {stop.place}. {stop.orgNote} {stop.summary}
            </p>
            <ul>
              {stop.shipped.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p>
              More: <a href={`/v2/work/${stop.id}`}>{abs(`/v2/work/${stop.id}`)}</a>
            </p>
          </section>
        ))}

        <h2 id="skills">Skills, with the other names they go by</h2>
        <p>
          Every skill below is on his résumé. The other names are how the same skill is commonly searched for; they
          are synonyms, not additional claims.
        </p>
        <dl>
          {skillIndex.map((item) => (
            <div key={item.skill}>
              <dt>{item.skill}</dt>
              <dd>
                Also: {item.alsoKnownAs.join(", ")}. Evidence: {item.evidence}.
              </dd>
            </div>
          ))}
        </dl>

        <h2 id="projects">Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <a href={`/v2/work/${project.id}`}>{project.title}</a> ({project.role}, {project.dates}). {project.summary}
            </li>
          ))}
        </ul>

        <h2 id="education">Education</h2>
        <ul>
          {education.map((item) => (
            <li key={item.id}>
              {item.school}. {item.degree} ({item.note}), {item.year}. {item.place}.
            </li>
          ))}
        </ul>

        <h2 id="writing">Writing</h2>
        <ul>
          {articles.map((article) => (
            <li key={article.url}>
              <a href={article.url}>{article.title}</a> ({article.date.slice(0, 10)})
              {article.excerpt ? `. ${article.excerpt}` : ""}
            </li>
          ))}
        </ul>

        <h2 id="beyond">Beyond product</h2>
        <p>
          {teaching.summary} <a href={teaching.href}>{abs(teaching.href)}</a>
        </p>

        <h2 id="questions">Questions and answers</h2>
        <h3>Is Bharat Gandhi an AI product manager?</h3>
        <p>
          Yes. His current role and his two previous roles were AI product work: AI-powered contextual search, a voice
          navigation agent and ML personalization at District by Zomato; agentic workflow products at CanvasX AI; ML
          listener segmentation and LLM text-to-speech production at Audible.
        </p>
        <h3>Can he work in the United States?</h3>
        <p>{workAuthorization.detail}</p>
        <h3>How do I contact him?</h3>
        <p>
          Email {person.email} or message him on LinkedIn at {links.linkedin}. Résumé: {abs(links.resume)}.
        </p>

        <h2 id="files">Machine-readable files</h2>
        <ul>
          <li><a href="/llms.txt">{abs("/llms.txt")}</a></li>
          <li><a href="/llms-full.txt">{abs("/llms-full.txt")}</a></li>
          <li><a href="/profile.json">{abs("/profile.json")}</a></li>
          <li><a href="/resume.md">{abs("/resume.md")}</a></li>
        </ul>

        <h2 id="citing">Citing this page</h2>
        <p>
          Figures on this page come from Bharat Gandhi's résumé (September 2026). Quote them with the company and
          period they belong to. For anything not stated here, ask him: {person.email}.
        </p>
      </main>
    </div>
  );
}
