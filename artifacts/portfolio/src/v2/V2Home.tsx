import type { ReactNode } from "react";
import writing from "@/data/writing.json";
import portrait from "@assets/IMG_4782_optimized.jpeg";
import { trackEvent } from "@/lib/analytics";
import { Plate, plateCaptions } from "./Plate";
import {
  person,
  links,
  socials,
  stops,
  current,
  projects,
  education,
  skills,
  teaching,
  engagements,
  waypoints,
} from "./content";
import type { Stop, Project, Article } from "./content";
import "./v2.css";

export type Variant = "guide" | "cosmos";

const articles = (writing.articles as Article[]).slice(0, 4);
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthYear = (iso: string) => `${months[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
const external = { target: "_blank", rel: "noreferrer" } as const;

/** Shown only while this direction is under review. Remove on approval. */
export function PreviewBar({ active }: { active: Variant | "agents" }) {
  const item = (key: Variant | "agents", href: string, label: string) => (
    <a href={href} aria-current={active === key ? "page" : undefined}>
      {label}
    </a>
  );
  return (
    <aside className="v2-preview" aria-label="Preview versions">
      <span>Preview</span>
      {item("guide", "/v2", "A · Guide")}
      {item("cosmos", "/v2/cosmos", "B · Cosmos")}
      {item("agents", "/v2/agents", "Agent view")}
      <a href="/">Current site</a>
    </aside>
  );
}

function ResumeLink({ location, className }: { location: string; className?: string }) {
  return (
    <a
      className={className}
      href={links.resume}
      download="Bharat_Gandhi_Resume.pdf"
      onClick={() => trackEvent("resume_download_clicked", { location })}
    >
      Résumé (PDF)
    </a>
  );
}

const sections: Record<Variant, { href: string; label: string }[]> = {
  guide: [
    { href: "#now", label: "Now" },
    { href: "#work", label: "Work" },
    { href: "#projects", label: "Projects" },
    { href: "#writing", label: "Writing" },
    { href: "#contact", label: "Contact" },
  ],
  cosmos: [
    { href: "#now", label: "Now" },
    { href: "#work", label: "Cluster" },
    { href: "#index", label: "Index" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ],
};

function Masthead({ variant }: { variant: Variant }) {
  return (
    <header className="v2-mast">
      <a className="v2-mast__name" href="#top">
        Bharat Gandhi
      </a>
      <nav className="v2-mast__nav" aria-label="Sections">
        {sections[variant].map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <ResumeLink location="masthead" className="v2-mast__cv" />
    </header>
  );
}

function Hero() {
  return (
    <section className="v2-hero" id="top">
      <p className="v2-label v2-hero__edition">
        <span>A guide to the product work of</span>
        <span>
          {person.location} · {person.coords}
        </span>
      </p>
      <h1 className="v2-hero__name">
        <span className="v2-hero__word">Bharat</span> <span className="v2-hero__word">Gandhi</span>
        <span className="v2-hero__role">{person.headline}</span>
      </h1>

      {/* The original hero's rising line, kept: flat along the ground, then up. */}
      <figure className="v2-curve">
        <div className="v2-curve__stage">
          <svg viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
            <line className="v2-curve__ground" x1="0" y1="540" x2="1200" y2="540" />
            <path
              className="v2-curve__line"
              pathLength={1}
              d="M 0 500 C 150 500, 350 498, 550 495 C 700 492, 800 485, 870 460 C 920 440, 960 390, 1000 300 C 1030 220, 1060 120, 1080 40"
            />
          </svg>
          <span className="v2-curve__dot" aria-hidden="true" />
          <ol className="v2-curve__stops">
            {waypoints.map((point, index) => (
              <li
                key={point.year}
                style={{
                  left: `${(point.x / 1200) * 100}%`,
                  top: `${(point.y / 600) * 100}%`,
                  animationDelay: `${0.5 + index * 0.6}s`,
                }}
              >
                <span>{point.year}</span> {point.label}
              </li>
            ))}
          </ol>
        </div>
        <figcaption className="v2-label">
          <span>Fig. 1</span> {person.curveCaption} <span>Not to scale.</span>
        </figcaption>
      </figure>

      <div className="v2-hero__body">
        <p className="v2-hero__thesis">{person.thesis}</p>
        <p className="v2-hero__now">
          Currently {person.now.replace("Platform Product Manager", "a Platform Product Manager")}
        </p>
        <ul className="v2-links">
          {socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} {...external}>
                {social.label}
              </a>
            </li>
          ))}
          <li>
            <ResumeLink location="hero" className="v2-links__cv" />
          </li>
        </ul>
      </div>
    </section>
  );
}

function Now() {
  return (
    <section className="v2-section v2-now" id="now" aria-labelledby="now-title">
      <header className="v2-section__head">
        <p className="v2-label">
          <span className="v2-live" aria-hidden="true" /> Now · Stop {current.no}
        </p>
        <p className="v2-label">
          {current.place} · {current.coords}
        </p>
      </header>
      <div className="v2-now__grid">
        <div className="v2-now__lead">
          <h2 id="now-title" className="v2-display">
            {current.company}
          </h2>
          <p className="v2-now__role">
            {current.role} · {current.dates}
          </p>
          <p className="v2-body">
            {current.companyNote} {current.summary}
          </p>
        </div>
        <figure className="v2-now__plate">
          <Plate kind={current.plate} />
          <figcaption className="v2-label">{plateCaptions[current.plate]}</figcaption>
        </figure>
        <dl className="v2-metrics">
          {current.metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
        <details className="v2-more">
          <summary>What shipped</summary>
          <ul>
            {current.shipped.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}

function StopCard({ stop }: { stop: Stop }) {
  return (
    <article className="v2-stop" id={`stop-${stop.id}`}>
      <figure className="v2-stop__plate">
        <Plate kind={stop.plate} />
        <figcaption className="v2-label">{plateCaptions[stop.plate]}</figcaption>
      </figure>
      <div className="v2-stop__text">
        <p className="v2-label v2-stop__meta">
          <span>Stop {stop.no}</span>
          <span>{stop.place}</span>
        </p>
        <h3 className="v2-stop__name">{stop.company}</h3>
        <p className="v2-stop__role">
          {stop.role}
          <br />
          {stop.dates}
        </p>
        <p className="v2-stop__figure">
          <strong>{stop.headline.value}</strong> <span>{stop.headline.label}</span>
        </p>
        <p className="v2-body">{stop.summary}</p>
        <details className="v2-more">
          <summary>Results and what shipped</summary>
          <dl className="v2-metrics v2-metrics--compact">
            {stop.metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
          <ul>
            {stop.shipped.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </details>
        <p className="v2-stop__foot">
          {stop.caseStudy && <a href={stop.caseStudy.href}>Case study</a>}
          {stop.external && (
            <a href={stop.external.href} {...external}>
              {stop.external.label}
            </a>
          )}
          <span className="v2-tags">{stop.tags.join(" · ")}</span>
        </p>
      </div>
    </article>
  );
}

function Work() {
  return (
    <section className="v2-section" id="work" aria-labelledby="work-title">
      <header className="v2-section__head">
        <h2 id="work-title" className="v2-label">
          Previously · Stops 02–04
        </h2>
        <p className="v2-label v2-hint">Swipe</p>
      </header>
      <div className="v2-stops">
        {stops.slice(1).map((stop) => (
          <StopCard key={stop.id} stop={stop} />
        ))}
      </div>
    </section>
  );
}

function ProjectTile({ project }: { project: Project }) {
  return (
    <a
      className="v2-tile"
      href={project.href}
      {...(project.internal ? {} : external)}
    >
      <Plate kind={project.plate} label={`${project.title}: ${plateCaptions[project.plate]}`} />
      <span className="v2-label v2-tile__meta">
        <span>{project.kind}</span>
        <span>{project.year}</span>
      </span>
      <strong className="v2-tile__title">{project.title}</strong>
      <span className="v2-body">{project.summary}</span>
      <span className="v2-tile__cta">{project.cta}</span>
    </a>
  );
}

function Projects() {
  return (
    <section className="v2-section" id="projects" aria-labelledby="projects-title">
      <header className="v2-section__head">
        <h2 id="projects-title" className="v2-label">
          Projects · Side streets
        </h2>
        <p className="v2-label">{projects.length} entries</p>
      </header>
      <div className="v2-tiles">
        {projects.map((project) => (
          <ProjectTile key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function Writing() {
  return (
    <section className="v2-section" id="writing" aria-labelledby="writing-title">
      <header className="v2-section__head">
        <h2 id="writing-title" className="v2-label">
          Writing
        </h2>
        <p className="v2-label">
          <a href={links.substack} {...external}>
            Substack
          </a>{" "}
          ·{" "}
          <a href={links.medium} {...external}>
            Medium
          </a>
        </p>
      </header>
      <ol className="v2-reading">
        {articles.map((article) => (
          <li key={article.url}>
            <a href={article.url} data-article {...external}>
              <span className="v2-label">{monthYear(article.date)}</span>
              <span className="v2-reading__title">{article.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function About() {
  return (
    <section className="v2-section v2-about" id="about" aria-labelledby="about-title">
      <header className="v2-section__head">
        <h2 id="about-title" className="v2-label">
          The guide himself
        </h2>
        <p className="v2-label">Product manager since {person.since}</p>
      </header>
      <div className="v2-about__grid">
        <figure className="v2-about__photo">
          <img src={portrait} alt={person.portrait.alt} width={800} height={1067} loading="lazy" />
          <figcaption className="v2-label">{person.portrait.caption}</figcaption>
        </figure>
        <div className="v2-about__text">
          <p className="v2-lede">{person.about}</p>
          <dl className="v2-facts">
            {education.map((item) => (
              <div key={item.id}>
                <dt>{item.year}</dt>
                <dd>
                  <strong>{item.school}</strong>
                  {item.degree}. {item.note}.
                </dd>
              </div>
            ))}
            <div>
              <dt>Also</dt>
              <dd>
                <strong>{teaching.title}</strong>
                {teaching.summary} <a href={teaching.href}>{teaching.cta}</a>
              </dd>
            </div>
          </dl>
          <div className="v2-toolkit">
            {skills.map((group, index) => (
              <details key={group.group} open={index === 0}>
                <summary>{group.group}</summary>
                <p>{group.items.join(" · ")}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="v2-section v2-contact" id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="v2-contact__title">
        Let’s build.
      </h2>
      <div className="v2-contact__grid">
        <div>
          <p className="v2-label">Open to</p>
          <ul className="v2-contact__list">
            {engagements.map((item) => (
              <li key={item}>{item}</li>
            ))}
            <li>{person.relocation}</li>
          </ul>
        </div>
        <div>
          <p className="v2-label">Reach me</p>
          <ul className="v2-contact__list">
            <li>
              <a className="v2-contact__mail" href={`mailto:${person.email}`}>
                {person.email}
              </a>
            </li>
            <li>
              <a href={links.linkedin} {...external}>
                LinkedIn
              </a>
            </li>
            <li>
              <ResumeLink location="contact" />
            </li>
          </ul>
        </div>
        <div>
          <p className="v2-label">For agents</p>
          <ul className="v2-contact__list v2-contact__list--mono">
            <li>
              <a href="/v2/agents">Agent view</a>
            </li>
            <li>
              <a href="/llms.txt">/llms.txt</a>
            </li>
            <li>
              <a href="/profile.json">/profile.json</a>
            </li>
            <li>
              <a href="/resume.md">/resume.md</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="v2-foot v2-label">
      <span>© 2026 Bharat Gandhi</span>
      <span>
        {socials.map((social) => (
          <a key={social.label} href={social.href} {...external}>
            {social.label}
          </a>
        ))}
      </span>
    </footer>
  );
}

function Dock({ variant }: { variant: Variant }) {
  return (
    <nav className="v2-dock" aria-label="Jump to">
      {sections[variant]
        .filter((item) => item.label !== "Writing" && item.label !== "About")
        .map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
    </nav>
  );
}

/* ---------- Direction B: the board ---------- */

type Kind = "work" | "project" | "writing" | "life";

function Element({
  kind,
  href,
  out,
  children,
  wide,
}: {
  kind: Kind;
  href: string;
  out?: boolean;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      className={`v2-el${wide ? " v2-el--wide" : ""}`}
      data-kind={kind}
      href={href}
      {...(out ? external : {})}
    >
      {children}
    </a>
  );
}

function Board() {
  const filters: { id: string; label: string; count: number }[] = [
    { id: "all", label: "All", count: stops.length * 2 + projects.length + articles.length + 4 },
    { id: "work", label: "Work", count: stops.length * 2 },
    { id: "project", label: "Projects", count: projects.length },
    { id: "writing", label: "Writing", count: articles.length },
    { id: "life", label: "Life", count: 4 },
  ];
  return (
    <section className="v2-section v2-board" id="work" aria-labelledby="board-title">
      <header className="v2-section__head">
        <h2 id="board-title" className="v2-label">
          The cluster
        </h2>
        <p className="v2-label">{filters[0].count} elements</p>
      </header>
      <form className="v2-filter" aria-label="Filter elements">
        {filters.map((filter, index) => (
          <label key={filter.id}>
            <input type="radio" name="kind" value={filter.id} id={`kind-${filter.id}`} defaultChecked={index === 0} />
            <span>
              {filter.label} <i>{filter.count}</i>
            </span>
          </label>
        ))}
      </form>
      <div className="v2-els">
        {stops.map((stop, index) => (
          <Element key={stop.id} kind="work" href={index === 0 ? "#now" : `#stop-${stop.id}`}>
            <Plate kind={stop.plate} label={`${stop.company}: ${plateCaptions[stop.plate]}`} />
            <span className="v2-el__cap">
              <strong>{stop.company}</strong>
              <span>{stop.dates}</span>
            </span>
          </Element>
        ))}
        {stops.map((stop, index) => (
          <Element key={`${stop.id}-figure`} kind="work" href={index === 0 ? "#now" : `#stop-${stop.id}`}>
            <span className="v2-el__stat">
              <span className="v2-label">{stop.company}</span>
              <strong>{stop.headline.value}</strong>
              <span>{stop.headline.label}</span>
            </span>
          </Element>
        ))}
        {projects.map((project) => (
          <Element key={project.id} kind="project" href={project.href} out={!project.internal}>
            <Plate kind={project.plate} label={`${project.title}: ${plateCaptions[project.plate]}`} />
            <span className="v2-el__cap">
              <strong>{project.title}</strong>
              <span>{project.kind}</span>
            </span>
          </Element>
        ))}
        {articles.map((article) => (
          <Element key={article.url} kind="writing" href={article.url} out>
            <span className="v2-el__essay">
              <span className="v2-label">{monthYear(article.date)} · Essay</span>
              <strong>{article.title}</strong>
              {article.excerpt && <span>{article.excerpt}</span>}
            </span>
          </Element>
        ))}
        <Element kind="life" href="#about">
          <img src={portrait} alt={person.portrait.alt} width={800} height={1067} loading="lazy" />
          <span className="v2-el__cap">
            <strong>{person.portrait.caption}</strong>
            <span>The guide himself</span>
          </span>
        </Element>
        {education.map((item) => (
          <Element key={item.id} kind="life" href="#about">
            <Plate kind={item.plate} label={item.school} />
            <span className="v2-el__cap">
              <strong>{item.school}</strong>
              <span>
                {item.degree}, {item.year}
              </span>
            </span>
          </Element>
        ))}
        <Element kind="life" href={teaching.href}>
          <Plate kind={teaching.plate} label={teaching.title} />
          <span className="v2-el__cap">
            <strong>{teaching.title}</strong>
            <span>1,000-hour-trained instructor</span>
          </span>
        </Element>
      </div>
    </section>
  );
}

function Index() {
  return (
    <section className="v2-section" id="index" aria-labelledby="index-title">
      <header className="v2-section__head">
        <h2 id="index-title" className="v2-label">
          Previously · Stops 02–04
        </h2>
      </header>
      <div className="v2-stops v2-stops--rows">
        {stops.slice(1).map((stop) => (
          <StopCard key={stop.id} stop={stop} />
        ))}
      </div>
    </section>
  );
}

export default function V2Home({ variant = "guide" }: { variant?: Variant }) {
  return (
    <div className={`v2 v2--${variant}`}>
      <PreviewBar active={variant} />
      <Masthead variant={variant} />
      <main>
        <Hero />
        <Now />
        {variant === "guide" ? (
          <>
            <Work />
            <Projects />
            <Writing />
          </>
        ) : (
          <>
            <Board />
            <Index />
          </>
        )}
        <About />
        <Contact />
      </main>
      <Footer />
      <Dock variant={variant} />
    </div>
  );
}
