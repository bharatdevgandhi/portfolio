import type React from "react";
import { orgs, entries } from "./content";
import type { Entry } from "./content";
import { chapters } from "./chapters";
import { Footer, Frame, CoverArt, entryHref, external } from "./V2Home";
import "./v2.css";

// One gallery entry, opened. The page is a single card over a quiet ground:
// pictures on one side, the story on the other, and one way back.
export default function Detail({ entry }: { entry: Entry }) {
  const index = entries.findIndex((item) => item.id === entry.id);
  const next = entries[(index + 1) % entries.length];
  const story = chapters[entry.id] ?? [];
  return (
    <div className="v2 v2--detail">
      <main className="v2-stage">
        <article className="v2-card">
          <div className="v2-card__bar">
            <a className="v2-back" href="/v2#work">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
              <span>Back to the gallery</span>
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
            <div className="v2-card__body">
              {entry.orgs.length > 0 && (
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
              )}
              <h1>{entry.title}</h1>
              <p className="v2-card__lede">{entry.intro}</p>
              <dl className="v2-card__facts">
                <div>
                  <dt>Role</dt>
                  <dd>{entry.role}</dd>
                </div>
                <div>
                  <dt>When</dt>
                  <dd>{entry.dates}</dd>
                </div>
                <div>
                  <dt>Where</dt>
                  <dd>{entry.place}</dd>
                </div>
              </dl>

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
            </div>
          </div>
          <a className="v2-next" href={entryHref(next.id)}>
            <span>Next</span>
            <strong>{next.title}</strong>
          </a>
        </article>
      </main>
      <Footer />
    </div>
  );
}
