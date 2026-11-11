import type React from "react";
import { useEffect } from "react";
import writing from "@/data/writing.json";
import { trackEvent } from "@/lib/analytics";
import { person, links, socials, orgs, orgRow, entries, places, education } from "./content";
import type { Entry, Picture, Article, Cover } from "./content";
import "./v2.css";

const articles = (writing.articles as Article[]).slice(0, 5);
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthYear = (iso: string) => `${months[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
export const external = { target: "_blank", rel: "noreferrer" } as const;
export const entryHref = (id: string) => `/v2/work/${id}`;

/** Which gallery entry an organisation's logo leads to. */
const orgEntry: Record<string, string> = {
  district: "district",
  sketch: "canvasx",
  audible: "audible",
  amazon: "audible",
  rategain: "rategain",
  cornelltech: "cornell-tech",
  manipal: "manipal",
  fubo: "fubo",
};

export function ResumeLink({ location, className }: { location: string; className?: string }) {
  return (
    <a
      className={className}
      href={links.resume}
      download="Bharat_Gandhi_Resume.pdf"
      onClick={() => trackEvent("resume_download_clicked", { location })}
    >
      Download résumé
    </a>
  );
}

/** The rising line from the original hero. A motif, not a chart: no labels. */
export function Undercurrent() {
  return (
    <div className="v2-current" aria-hidden="true">
      <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
        <path
          pathLength={1}
          d="M 0 500 C 150 500, 350 498, 550 495 C 700 492, 800 485, 870 460 C 920 440, 960 390, 1000 300 C 1030 220, 1060 120, 1080 30"
        />
      </svg>
      <span className="v2-current__end" />
    </div>
  );
}

/** Selects the "For recruiters" option in the gallery and brings it into view. */
function showRecruiters() {
  const option = document.getElementById("group-recruiters") as HTMLInputElement | null;
  if (!option) return;
  option.checked = true;
  document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  return (
    <header className="v2-head">
      <div className="v2-wrap v2-head__row">
        <a className="v2-head__home" href="/v2">
          Home
        </a>
        <nav className="v2-head__nav" aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#places">Places</a>
          <a href="#writing">Writing</a>
        </nav>
        <a
          className="v2-btn"
          href="#recruiters"
          onClick={(event) => {
            event.preventDefault();
            showRecruiters();
          }}
        >
          Recruiters
        </a>
      </div>
    </header>
  );
}

export function Frame({
  picture,
  sizes,
  eager,
  motionFrom,
}: {
  picture: Picture;
  sizes: string;
  eager?: boolean;
  /** Only load the moving version at this width and up, to keep phones fast. */
  motionFrom?: string;
}) {
  const small = picture.src.replace(/\.jpg$/, "-sm.jpg");
  return (
    <span className="v2-frame">
      <img
        src={picture.src}
        srcSet={`${small} ${Math.round(picture.width / 2)}w, ${picture.src} ${picture.width}w`}
        sizes={sizes}
        alt={picture.alt}
        width={picture.width}
        height={picture.height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />
      {picture.video && (
        <video autoPlay muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}>
          <source src={picture.video.webm} type="video/webm" media={motionFrom} />
          <source src={picture.video.mp4} type="video/mp4" media={motionFrom} />
        </video>
      )}
    </span>
  );
}

export function CoverArt({ cover, sizes, eager, motionFrom }: { cover: Cover; sizes: string; eager?: boolean; motionFrom?: string }) {
  if (cover.kind === "picture") {
    return (
      <span className="v2-cover" style={{ aspectRatio: cover.ratio }}>
        <Frame picture={cover.picture} sizes={sizes} eager={eager} motionFrom={motionFrom} />
      </span>
    );
  }
  if (cover.kind === "logo") {
    const org = orgs[cover.org];
    return (
      <span className={`v2-cover v2-cover--plate v2-cover--${cover.tone}`}>
        <img src={`/media/logos/${org.logo}`} alt={`${org.name} logo`} loading="lazy" decoding="async" />
      </span>
    );
  }
  return (
    <span className={`v2-cover v2-cover--plate v2-cover--${cover.tone}`}>
      <span className="v2-cover__word">{cover.line}</span>
    </span>
  );
}

function Badge({ org }: { org: string }) {
  return (
    <span className="v2-badge">
      <img src={`/media/logos/${orgs[org].logo}`} alt={`${orgs[org].name} logo`} loading="lazy" decoding="async" />
    </span>
  );
}

function Tile({ entry, eager }: { entry: Entry; eager?: boolean }) {
  return (
    <a className="v2-tile" data-group={entry.group} href={entryHref(entry.id)}>
      <span className="v2-tile__art">
        <CoverArt cover={entry.cover} sizes="(min-width: 900px) 380px, 50vw" eager={eager} />
        {entry.badge && <Badge org={entry.badge} />}
      </span>
      <span className="v2-tile__text">
        <strong>{entry.title}</strong>
        <span>{entry.intro}</span>
      </span>
    </a>
  );
}

const filters = [
  { id: "all", label: "Everything" },
  { id: "work", label: "Work" },
  { id: "project", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "writing", label: "Writing" },
  { id: "teaching", label: "Beyond work" },
  { id: "recruiters", label: "For recruiters" },
];

/** Shown only when "For recruiters" is selected. */
function RecruiterCards() {
  const workOrgs = ["district", "sketch", "audible", "amazon", "rategain"];
  return (
    <>
      <div className="v2-tile v2-note v2-note--lead" data-group="recruiters">
        <h3>Hiring an AI product manager?</h3>
        <p>
          I am open to product roles in AI, search and platform. I am based in {person.location.split(",")[0]} and open
          to relocation.
        </p>
        <a className="v2-note__mail" href={`mailto:${person.email}`}>
          {person.email}
        </a>
        <div className="v2-note__actions">
          <a className="v2-btn v2-btn--solid" href={`mailto:${person.email}`}>
            Email me
          </a>
          <a className="v2-btn" href={links.linkedin} {...external}>
            LinkedIn
          </a>
          <ResumeLink location="recruiters" className="v2-btn" />
        </div>
      </div>
      <div className="v2-tile v2-note" data-group="recruiters">
        <h3>Where I have worked</h3>
        <ul className="v2-note__logos">
          {workOrgs.map((id) => (
            <li key={id}>
              <img src={`/media/logos/${orgs[id].logo}`} alt={`${orgs[id].name} logo`} style={{ "--w": `${orgs[id].width}px` } as React.CSSProperties} loading="lazy" />
              {orgs[id].label && <span>{orgs[id].label}</span>}
            </li>
          ))}
        </ul>
        <p>Product manager since {person.since}, across consumer apps, B2B SaaS and applied-AI startups.</p>
      </div>
      <div className="v2-tile v2-note" data-group="recruiters">
        <h3>Where I studied</h3>
        <ul className="v2-note__schools">
          <li>
            <img src={`/media/logos/${orgs.cornelltech.logo}`} alt="Cornell Tech logo" style={{ "--w": "150px" } as React.CSSProperties} loading="lazy" />
            <span>
              {education[0].degree}, {education[0].year}
            </span>
          </li>
          <li>
            <img src={`/media/logos/${orgs.manipal.logo}`} alt="Manipal University Jaipur logo" style={{ "--w": "180px" } as React.CSSProperties} loading="lazy" />
            <span>
              {education[1].degree}, {education[1].year}
            </span>
          </li>
        </ul>
      </div>
      <div className="v2-tile v2-note" data-group="recruiters">
        <h3>Also open to</h3>
        <p>Advising startups on growth, go-to-market and product craft, and speaking about AI and building products.</p>
      </div>
    </>
  );
}

function Gallery() {
  return (
    <section className="v2-section v2-gallery" id="work" aria-labelledby="work-title">
      <div className="v2-wrap">
        <div className="v2-section__head">
          <h2 id="work-title">Work</h2>
          <form className="v2-filter" id="recruiters" aria-label="Show">
            {filters.map((filter, index) => (
              <label key={filter.id}>
                <input type="radio" name="group" value={filter.id} id={`group-${filter.id}`} defaultChecked={index === 0} />
                <span>{filter.label}</span>
              </label>
            ))}
          </form>
        </div>
        {/* Work leads, in a row of its own, so the portfolio always opens on it. */}
        <div className="v2-lead">
          {entries
            .filter((entry) => entry.group === "work")
            .map((entry) => (
              <Tile key={entry.id} entry={entry} eager />
            ))}
        </div>
        <div className="v2-tiles">
          <RecruiterCards />
          {entries
            .filter((entry) => entry.group !== "work")
            .map((entry) => (
              <Tile key={entry.id} entry={entry} />
            ))}
          {articles.slice(0, 4).map((article) => (
            <a key={article.url} className="v2-tile v2-essay" data-group="writing" href={article.url} data-article {...external}>
              <span className="v2-essay__date">{monthYear(article.date)}</span>
              <strong>{article.title}</strong>
              {article.excerpt && <span className="v2-essay__excerpt">{article.excerpt}</span>}
              <span className="v2-essay__source">{article.source === "medium" ? "Medium" : "Substack"}</span>
            </a>
          ))}
          <figure className="v2-tile v2-tile--still" data-group="me">
            <span className="v2-cover" style={{ aspectRatio: "3 / 4" }}>
              <Frame
                picture={{ src: person.portrait.src, alt: person.portrait.alt, caption: "", width: 800, height: 1067 }}
                sizes="(min-width: 900px) 380px, 50vw"
              />
            </span>
            <figcaption className="v2-tile__text">
              <strong>{person.name}</strong>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function Places() {
  return (
    <section className="v2-section" id="places" aria-labelledby="places-title">
      <div className="v2-wrap">
        <div className="v2-section__head">
          <h2 id="places-title">Places</h2>
          <p>Where I have lived and worked.</p>
        </div>
        <ul className="v2-places">
          {places.map((place) => (
            <li key={place.id}>
              <span className="v2-cover" style={{ aspectRatio: "3 / 4" }}>
                <Frame picture={place.picture} sizes="(min-width: 900px) 230px, 60vw" />
              </span>
              <strong>{place.name}</strong>
              {place.note && <span>{place.note}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Writing() {
  return (
    <section className="v2-section" id="writing" aria-labelledby="writing-title">
      <div className="v2-wrap">
        <div className="v2-section__head">
          <h2 id="writing-title">Writing</h2>
          <p>
            More on <a href={links.substack} {...external}>Substack</a> and{" "}
            <a href={links.medium} {...external}>Medium</a>.
          </p>
        </div>
        <ol className="v2-reading">
          {articles.map((article) => (
            <li key={article.url}>
              <a href={article.url} data-article {...external}>
                <span className="v2-reading__title">{article.title}</span>
                <span className="v2-reading__date">{monthYear(article.date)}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="v2-foot">
      <div className="v2-wrap v2-foot__row">
        <span>© 2026 Bharat Gandhi</span>
        <ul>
          {socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} {...external}>
                {social.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/credits.txt">Credits</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default function V2Home() {
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === "#recruiters") showRecruiters();
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return (
    <div className="v2">
      <Header />
      <main>
        <section className="v2-hero" id="top">
          <Undercurrent />
          <div className="v2-wrap">
            <h1 className="v2-hero__intro">{person.intro}</h1>
            <ul className="v2-hero__links">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} {...external}>
                    {social.label}
                  </a>
                </li>
              ))}
              <li>
                <ResumeLink location="hero" />
              </li>
            </ul>
          </div>
        </section>
        <section className="v2-orgs" aria-label="Organisations">
          <ul className="v2-wrap">
            {orgRow.map((id) => (
              <li key={id}>
                <a href={entryHref(orgEntry[id])} aria-label={orgs[id].name}>
                  <img
                    src={`/media/logos/${orgs[id].logo}`}
                    alt={`${orgs[id].name} logo`}
                    style={{ "--w": `${orgs[id].width}px` } as React.CSSProperties}
                    loading="lazy"
                    decoding="async"
                  />
                  {orgs[id].label && <span>{orgs[id].label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <Gallery />
        <Places />
        <Writing />
      </main>
      <Footer />
    </div>
  );
}
