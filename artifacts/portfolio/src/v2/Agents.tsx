import writing from "@/data/writing.json";
import { PreviewBar } from "./V2Home";
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
} from "./content";
import type { Article } from "./content";
import "./v2.css";

const articles = writing.articles as Article[];
const abs = (href: string) => (href.startsWith("/") ? `${origin}${href}` : href);

// The same content model as the gallery, with the design taken away.
// Flat semantic HTML: headings, lists, one table, no scripts required, no
// disclosure widgets, every fact in the first response. Written for browser
// agents, scrapers and anyone who prefers a page they can read in one pass.
export default function Agents() {
  return (
    <div className="v2 v2--agents">
      <PreviewBar active="agents" />
      <main className="v2a">
        <p className="v2a__note">
          Plain version for agents, scrapers and screen readers. <a href="/v2">Designed version</a> ·{" "}
          <a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a> ·{" "}
          <a href="/profile.json">profile.json</a> · <a href="/resume.md">resume.md</a> ·{" "}
          <a href={links.resume}>Résumé PDF</a>
        </p>

        <h1>{person.name}: {person.headline}</h1>
        <p>{person.summary}</p>

        <h2 id="facts">Facts</h2>
        <dl>
          <dt>Current role</dt>
          <dd>
            {stops[0].role}, {stops[0].company} ({stops[0].dates}), {stops[0].place}
          </dd>
          <dt>Location</dt>
          <dd>
            {person.location}. {person.relocation}.
          </dd>
          <dt>Experience</dt>
          <dd>Product manager since {person.since}: District by Zomato, CanvasX AI, Audible / Amazon, RateGain</dd>
          <dt>Education</dt>
          <dd>MS, Information Systems, Cornell Tech (2021). BE, Computer Science, Manipal University Jaipur (2017).</dd>
          <dt>Focus</dt>
          <dd>AI products, search and discovery, personalization, content platforms, 0-to-1, go-to-market</dd>
          <dt>Relevant roles</dt>
          <dd>{relevantRoles.join("; ")}</dd>
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
                    <td>{stop.company}</td>
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
              {stop.role}, {stop.company}
            </h3>
            <p>
              {stop.dates} · {stop.place}. {stop.companyNote} {stop.summary}
            </p>
            <ul>
              {stop.shipped.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {stop.caseStudy && (
              <p>
                Case study: <a href={stop.caseStudy.href}>{abs(stop.caseStudy.href)}</a>
              </p>
            )}
          </section>
        ))}

        <h2 id="projects">Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <a href={project.href}>{project.title}</a> ({project.kind}, {project.year}). {project.summary}
            </li>
          ))}
        </ul>

        <h2 id="skills">Skills</h2>
        <dl>
          {skills.map((group) => (
            <div key={group.group}>
              <dt>{group.group}</dt>
              <dd>{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>

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

        <h2 id="profiles">Profiles</h2>
        <ul>
          <li><a href={links.linkedin}>{links.linkedin}</a></li>
          <li><a href={links.x}>{links.x}</a></li>
          <li><a href={links.github}>{links.github}</a></li>
          <li><a href={links.substack}>{links.substack}</a></li>
          <li><a href={links.medium}>{links.medium}</a></li>
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
