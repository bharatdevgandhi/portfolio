import type React from "react";
import writing from "@/data/writing.json";
import credits from "./photo-credits.json";
import { trackEvent } from "@/lib/analytics";
import { person, links, socials, orgs, orgRow, entries, places, engagements } from "./content";
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

export function Header({ back }: { back?: boolean }) {
  return (
    <header className="v2-head">
      <div className="v2-wrap v2-head__row">
        {back ? (
          <a className="v2-back" href="/v2#work">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            <span>Back to the gallery</span>
          </a>
        ) : (
          <a className="v2-head__home" href="/v2">
            Home
          </a>
        )}
        <nav className="v2-head__nav" aria-label="Sections">
          {back ? (
            <a href="/v2">Home</a>
          ) : (
            <>
              <a href="#work">Work</a>
              <a href="#places">Places</a>
              <a href="#writing">Writing</a>
            </>
          )}
        </nav>
        <button className="v2-btn" type="button" popoverTarget="recruiters">
          Recruiters
        </button>
      </div>
      <RecruiterPanel />
    </header>
  );
}

function RecruiterPanel() {
  return (
    <div className="v2-panel" id="recruiters" popover="auto" aria-labelledby="recruiters-title">
      <div className="v2-panel__top">
        <h2 id="recruiters-title">For recruiters</h2>
        <button className="v2-panel__close" type="button" popoverTarget="recruiters" popoverTargetAction="hide">
          Close
        </button>
      </div>
      <p className="v2-panel__lede">
        AI product manager, currently Platform Product Manager at District by Zomato. Product manager since{" "}
        {person.since}; MS from Cornell Tech.
      </p>
      <h3>Open to</h3>
      <ul className="v2-panel__list">
        {engagements.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="v2-panel__where">
        Based in {person.location}. {person.relocation}.
      </p>
      <h3>Contact</h3>
      <a className="v2-panel__mail" href={`mailto:${person.email}`}>
        {person.email}
      </a>
      <div className="v2-panel__actions">
        <a className="v2-btn v2-btn--solid" href={`mailto:${person.email}`}>
          Email Bharat
        </a>
        <a className="v2-btn" href={links.linkedin} {...external}>
          LinkedIn
        </a>
        <ResumeLink location="recruiters" className="v2-btn" />
      </div>
    </div>
  );
}

export function Frame({ picture, sizes, eager }: { picture: Picture; sizes: string; eager?: boolean }) {
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
        decoding="async"
      />
      {picture.video && (
        <video autoPlay muted loop playsInline preload="metadata" poster={picture.src} aria-hidden="true" tabIndex={-1}>
          <source src={picture.video.webm} type="video/webm" />
          <source src={picture.video.mp4} type="video/mp4" />
        </video>
      )}
    </span>
  );
}

export function CoverArt({ cover, sizes, eager }: { cover: Cover; sizes: string; eager?: boolean }) {
  if (cover.kind === "picture") {
    return (
      <span className="v2-cover" style={{ aspectRatio: cover.ratio }}>
        <Frame picture={cover.picture} sizes={sizes} eager={eager} />
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

function Tile({ entry, eager }: { entry: Entry; eager?: boolean }) {
  return (
    <a className="v2-tile" data-group={entry.group} href={entryHref(entry.id)}>
      <CoverArt cover={entry.cover} sizes="(min-width: 900px) 380px, 50vw" eager={eager} />
      <span className="v2-tile__text">
        <strong>{entry.title}</strong>
        <span>{entry.intro}</span>
      </span>
    </a>
  );
}

function Gallery() {
  const filters = [
    { id: "all", label: "Everything" },
    { id: "work", label: "Work" },
    { id: "education", label: "Education" },
    { id: "project", label: "Projects" },
  ];
  return (
    <section className="v2-section v2-gallery" id="work" aria-labelledby="work-title">
      <div className="v2-wrap">
        <div className="v2-section__head">
          <h2 id="work-title">Work</h2>
          <form className="v2-filter" aria-label="Show">
            {filters.map((filter, index) => (
              <label key={filter.id}>
                <input type="radio" name="group" value={filter.id} id={`group-${filter.id}`} defaultChecked={index === 0} />
                <span>{filter.label}</span>
              </label>
            ))}
          </form>
        </div>
        <div className="v2-tiles">
          {entries.map((entry, index) => (
            <Tile key={entry.id} entry={entry} eager={index < 3} />
          ))}
          <figure className="v2-tile v2-tile--still" data-group="me">
            <span className="v2-cover" style={{ aspectRatio: "3 / 4" }}>
              <Frame
                picture={{ src: person.portrait.src, alt: person.portrait.alt, caption: "", width: 800, height: 1067 }}
                sizes="(min-width: 900px) 380px, 50vw"
              />
            </span>
            <figcaption className="v2-tile__text">
              <strong>Bharat Gandhi</strong>
              <span>{person.portrait.caption}</span>
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
  const photos = Object.values(credits as Record<string, { page: string; author: string; license: string }>);
  return (
    <footer className="v2-foot">
      <div className="v2-wrap">
        <div className="v2-foot__row">
          <span>© 2026 Bharat Gandhi</span>
          <ul>
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} {...external}>
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="v2-foot__credits" data-credits>
          Photographs from Wikimedia Commons:{" "}
          {photos.map((photo, index) => (
            <span key={photo.page}>
              <a href={photo.page} {...external}>
                {photo.author}
              </a>{" "}
              ({photo.license}){index < photos.length - 1 ? ", " : ". "}
            </span>
          ))}
          Screens are captures of each organisation's public site. Logos belong to their owners.
        </p>
      </div>
    </footer>
  );
}

export default function V2Home() {
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
