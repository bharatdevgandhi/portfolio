import type React from "react";
import { orgs, entries } from "./content";
import type { Entry } from "./content";
import { Header, Footer, Frame, CoverArt, Undercurrent, entryHref, external } from "./V2Home";
import "./v2.css";

const listHeading: Record<Entry["group"], string> = {
  work: "What shipped",
  project: "What came of it",
  education: "What I did there",
};

export default function Detail({ entry }: { entry: Entry }) {
  const index = entries.findIndex((item) => item.id === entry.id);
  const next = entries[(index + 1) % entries.length];
  const cover = entry.cover;
  return (
    <div className="v2 v2--detail">
      <Header back />
      <main>
        <article>
          <header className="v2-detail__head">
            <Undercurrent />
            <div className="v2-wrap">
              <ul className="v2-detail__orgs">
                {entry.orgs.map((id) => (
                  <li key={id}>
                    <a href={orgs[id].url} aria-label={orgs[id].name} {...external}>
                      <img src={`/media/logos/${orgs[id].logo}`} alt={`${orgs[id].name} logo`} style={{ "--w": `${Math.round(orgs[id].width * 1.25)}px` } as React.CSSProperties} />
                      {orgs[id].label && <span>{orgs[id].label}</span>}
                    </a>
                  </li>
                ))}
              </ul>
              <h1>{entry.title}</h1>
              <dl className="v2-detail__facts">
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
              <p className="v2-detail__summary">{entry.summary}</p>
            </div>
          </header>

          {entry.metrics.length > 0 && (
            <section className="v2-section" aria-labelledby="results-title">
              <div className="v2-wrap">
                <h2 id="results-title">Results</h2>
                <dl className="v2-results">
                  {entry.metrics.map((metric) => (
                    <div key={metric.label}>
                      <dt>{metric.label}</dt>
                      <dd>{metric.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          )}

          {(cover.kind === "picture" || entry.pictures.length > 0) && (
            <section className="v2-section" aria-labelledby="pictures-title">
              <div className="v2-wrap">
                <h2 id="pictures-title">Reference</h2>
                <div className={`v2-shots${cover.kind === "picture" && cover.picture.video ? " v2-shots--phone" : ""}`}>
                  {cover.kind === "picture" && (
                    <figure>
                      <span className="v2-cover" style={{ aspectRatio: `${cover.picture.width} / ${cover.picture.height}` }}>
                        <Frame picture={cover.picture} sizes="(min-width: 900px) 760px, 100vw" eager />
                      </span>
                      <figcaption>{cover.picture.caption}</figcaption>
                    </figure>
                  )}
                  {entry.pictures.map((picture) => (
                    <figure key={picture.src}>
                      <span className="v2-cover" style={{ aspectRatio: `${picture.width} / ${picture.height}` }}>
                        <Frame picture={picture} sizes="(min-width: 900px) 760px, 100vw" />
                      </span>
                      <figcaption>{picture.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          )}

          {cover.kind !== "picture" && entry.pictures.length === 0 && (
            <section className="v2-section">
              <div className="v2-wrap v2-detail__plate">
                <CoverArt cover={cover} sizes="100vw" />
              </div>
            </section>
          )}

          {entry.shipped.length > 0 && (
            <section className="v2-section" aria-labelledby="shipped-title">
              <div className="v2-wrap">
                <details className="v2-more">
                  <summary>
                    <h2 id="shipped-title">{listHeading[entry.group]}</h2>
                    <span>Show all {entry.shipped.length}</span>
                  </summary>
                  <ul className="v2-shipped">
                    {entry.shipped.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </details>
              </div>
            </section>
          )}

          <section className="v2-section v2-detail__end">
            <div className="v2-wrap">
              <div className="v2-detail__links">
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
                <a className="v2-btn" href="/v2#work">
                  Back to the gallery
                </a>
              </div>
              <a className="v2-next" href={entryHref(next.id)}>
                <span>Next</span>
                <strong>{next.title}</strong>
              </a>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
