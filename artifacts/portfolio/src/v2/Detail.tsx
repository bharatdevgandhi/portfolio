import type React from "react";
import { orgs, entries } from "./content";
import type { Entry } from "./content";
import { chapters } from "./chapters";
import { Footer, Frame, CoverArt, Tags, entryHref, external } from "./V2Home";
import "./v2.css";

/** The card every opened entry sits in: a bar with one way back, pictures, a body, and what is next. */
export function CardShell({
  entry,
  backLabel = "Back to the gallery",
  id,
  renderedAt,
  children,
}: {
  entry: Entry;
  backLabel?: string;
  id?: string;
  renderedAt?: number;
  children: React.ReactNode;
}) {
  const index = entries.findIndex((item) => item.id === entry.id);
  const next = entries[(index + 1) % entries.length];
  return (
    <div className="v2 v2--detail" id={id} data-rendered-at={renderedAt}>
      <main className="v2-stage">
        <article className="v2-card">
          <div className="v2-card__bar">
            <a className="v2-back" href="/#work">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
              <span>{backLabel}</span>
            </a>
          </div>
          <div className="v2-card__grid">
            <div className="v2-card__media">
              <CoverArt cover={entry.cover} sizes="(min-width: 900px) 480px, 270px" eager motionFrom="(min-width: 900px)" />
              {entry.pictures.map((picture, position) => (
                <span key={picture.src} className="v2-cover" style={{ aspectRatio: `${picture.width} / ${picture.height}` }}>
                  <Frame picture={picture} sizes="(min-width: 900px) 480px, 270px" eager={position === 0} />
                </span>
              ))}
            </div>
            <div className="v2-card__body">{children}</div>
          </div>
          <a className="v2-next" href={entryHref(next)}>
            <span>Next</span>
            <strong>{next.title}</strong>
          </a>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export function OrgLogos({ entry }: { entry: Entry }) {
  if (entry.orgs.length === 0) return null;
  return (
    <ul className="v2-card__orgs">
      {entry.orgs.map((id) => (
        <li key={id}>
          <a href={orgs[id].url} aria-label={orgs[id].name} {...external}>
            <img
              src={`/media/logos/${orgs[id].logo}`}
              alt={`${orgs[id].name} logo`}
              style={{ "--w": `${orgs[id].width}px` } as React.CSSProperties}
            />
            {orgs[id].label && <span>{orgs[id].label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

// One gallery entry, opened: pictures on one side, the story on the other.
export default function Detail({ entry }: { entry: Entry }) {
  const story = chapters[entry.id] ?? [];
  const facts = [
    { label: "Role", value: entry.role },
    { label: "When", value: entry.dates },
    { label: "Where", value: entry.place },
  ].filter((fact) => fact.value);
  return (
    <CardShell entry={entry}>
      <OrgLogos entry={entry} />
      <h1>{entry.title}</h1>
      <p className="v2-card__lede">{entry.intro}</p>
      <Tags entry={entry} />
      {facts.length > 0 && (
        <dl className="v2-card__facts">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {entry.metrics.length > 0 && (
        <section aria-labelledby="results-title">
          <h2 id="results-title">Results</h2>
          <dl className="v2-results">
            {entry.metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {story.map((chapter) => (
        <section key={chapter.heading} className="v2-chapter">
          <h2>{chapter.heading}</h2>
          <p>{chapter.body}</p>
        </section>
      ))}

      {(entry.story || entry.external) && (
        <div className="v2-card__links">
          {entry.story && (
            <a className="v2-btn v2-btn--solid" href={entry.story.href}>
              {entry.story.label}
            </a>
          )}
          {entry.external && (
            <a className="v2-btn" href={entry.external.href} {...external}>
              {entry.external.label}
            </a>
          )}
        </div>
      )}
    </CardShell>
  );
}
