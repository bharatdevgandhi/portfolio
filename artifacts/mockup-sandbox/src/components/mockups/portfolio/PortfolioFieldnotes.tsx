import { useState } from "react";
import "./portfoliofieldnotes.css";

type Section = "index" | "work" | "writing" | "study";

const experiences = [
  {
    period: "NOW · 2024—",
    company: "CanvasAI Labs",
    role: "Head of Growth",
    note: "Taking AI products from first signal to market.",
    mark: "01",
    color: "coral",
    detail:
      "Building the go-to-market engine for CanvasAI Labs — an OpenClaw for business. Working across product, positioning, and the first repeatable paths to adoption.",
  },
  {
    period: "2021—2024",
    company: "Audible / Amazon",
    role: "Product Manager, Technical",
    note: "Built the backbone of Audible Originals.",
    mark: "02",
    color: "blue",
    detail:
      "Led 0→1 product work for Audible Originals, connecting editorial ambition with systems that could scale. The work sat at the intersection of content, technology, and customer experience.",
  },
  {
    period: "EARLIER",
    company: "RateGain",
    role: "Product · Data",
    note: "Built a global hotel-rate intelligence engine.",
    mark: "03",
    color: "gold",
    detail:
      "Helped build one of the world's largest hotel rate-scraping systems: turning messy, distributed market data into useful product decisions.",
  },
  {
    period: "RESEARCH",
    company: "FuboTV × Cornell Tech",
    role: "Product Research",
    note: "Reimagining live news for cord-cutters.",
    mark: "04",
    color: "plum",
    detail:
      "Led user research and product design for a new live-TV news experience. Hundreds of interviews and studies surfaced an agency gap — and a better way to move between sources.",
  },
];

const writing = [
  { topic: "PRODUCT", title: "What a product manager does when the map runs out", source: "Substack" },
  { topic: "BUILDING", title: "Plaza: the beautiful idea that didn't find its moment", source: "The Plaza story" },
  { topic: "NOTES", title: "Observations from the edge of AI and go-to-market", source: "Medium" },
];

export function PortfolioFieldnotes() {
  const [section, setSection] = useState<Section>("index");
  const [openStory, setOpenStory] = useState<(typeof experiences)[number] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (next: Section) => {
    setSection(next);
    setMenuOpen(false);
  };

  return (
    <main className="fieldnotes">
      <div className="fieldnotes-paper">
        <header className="fn-topbar">
          <button className="fn-wordmark" onClick={() => navigate("index")} aria-label="Return to index">
            BG<span>·</span>
          </button>
          <div className="fn-status"><i /> OPEN TO GOOD QUESTIONS</div>
          <button className="fn-menu" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle section menu">
            <span>{menuOpen ? "CLOSE" : "INDEX"}</span>
            <b>{menuOpen ? "−" : "+"}</b>
          </button>
        </header>

        {menuOpen && (
          <nav className="fn-menu-panel" aria-label="Portfolio sections">
            {([
              ["index", "01", "Overview"],
              ["work", "02", "Selected work"],
              ["writing", "03", "Writing"],
              ["study", "04", "Education"],
            ] as [Section, string, string][]).map(([id, number, label]) => (
              <button key={id} onClick={() => navigate(id)} className={section === id ? "active" : ""}>
                <small>{number}</small>{label}<span>↗</span>
              </button>
            ))}
          </nav>
        )}

        <div className="fn-edition">
          <span>INDEPENDENT PRODUCT OPERATOR</span>
          <span>NEW YORK · 2025</span>
        </div>

        {section === "index" && (
          <>
            <section className="fn-intro">
              <div className="fn-signal" aria-hidden="true">
                <span className="fn-orbit orbit-a" /><span className="fn-orbit orbit-b" />
                <span className="fn-signal-core">BG</span><span className="fn-signal-dot" />
              </div>
              <p className="fn-kicker">A PRACTICE IN MAKING THINGS MOVE</p>
              <h1>Bharat<br /><em>Gandhi.</em></h1>
              <p className="fn-summary">I build AI products and take them to market. Currently Head of Growth at CanvasAI Labs. Previously PM-T at Audible / Amazon.</p>
              <div className="fn-socials">
                <a href="https://linkedin.com/in/bdgandhi" target="_blank" rel="noreferrer">LINKEDIN ↗</a>
                <a href="https://x.com/bharaatobama" target="_blank" rel="noreferrer">X ↗</a>
                <a href="https://bharatgandhi.substack.com" target="_blank" rel="noreferrer">SUBSTACK ↗</a>
              </div>
            </section>
            <section className="fn-now">
              <div className="fn-now-index">FIELD NOTE<br />NO. 001</div>
              <div><span className="fn-label">CURRENTLY</span><strong>CanvasAI Labs</strong><p>Product, growth, and the messy middle between them.</p></div>
              <span className="fn-now-arrow">↗</span>
            </section>
            <div className="fn-section-head">
              <div><span className="fn-label">A FEW GOOD RECEIPTS</span><h2>Work, in motion.</h2></div>
              <button className="fn-text-button" onClick={() => navigate("work")}>ALL WORK <span>↗</span></button>
            </div>
            <ExperienceList items={experiences.slice(0, 3)} onOpen={setOpenStory} />
            <section className="fn-plaza">
              <span className="fn-label">SIDE QUEST · STARTUP / FAIL</span>
              <div className="fn-plaza-title">Plaza<span>↗</span></div>
              <p>A universal comment layer for the internet. Built during grad school; learned more from its ending than its launch.</p>
              <button onClick={() => setOpenStory({
                period: "SIDE QUEST",
                company: "Plaza",
                role: "Founder · Cornell Tech",
                note: "A universal comment layer for the internet.",
                mark: "05",
                color: "coral",
                detail: "Plaza was a consumer app for universal comments across the internet. Built during grad school, it was an attempt to make the web feel more connected. It didn't work — the story is about what we built, what we missed, and what I took forward.",
              })}>READ THE POST-MORTEM <span>↗</span></button>
            </section>
            <FooterNav onNavigate={navigate} />
          </>
        )}

        {section === "work" && (
          <section className="fn-subpage">
            <span className="fn-label">02 / CAREER INDEX</span>
            <h1 className="fn-subtitle">Work, in<br /><em>motion.</em></h1>
            <p className="fn-subintro">A few chapters, each with a different kind of problem to solve. Tap into the field notes.</p>
            <ExperienceList items={experiences} onOpen={setOpenStory} />
            <div className="fn-project-teaser">
              <span className="fn-label">INDEPENDENT BUILD</span><h2>Plaza</h2>
              <p>A universal comment layer for the internet. An idea that taught me how much distribution matters.</p>
              <button onClick={() => setOpenStory({
                period: "SIDE QUEST",
                company: "Plaza",
                role: "Founder · Cornell Tech",
                note: "A universal comment layer for the internet.",
                mark: "05",
                color: "coral",
                detail: "Plaza was a consumer app for universal comments across the internet. Built during grad school, it was an attempt to make the web feel more connected. It didn't work — the story is about what we built, what we missed, and what I took forward.",
              })}>OPEN FIELD NOTE ↗</button>
            </div>
          </section>
        )}

        {section === "writing" && (
          <section className="fn-subpage">
            <span className="fn-label">03 / THINKING OUT LOUD</span>
            <h1 className="fn-subtitle">Notes from<br /><em>the work.</em></h1>
            <p className="fn-subintro">A running record of ideas, lessons, and questions worth keeping.</p>
            <div className="fn-writing-list">
              {writing.map((item, index) => (
                <a key={item.title} href={index === 0 ? "https://bharatgandhi.substack.com" : index === 1 ? "/cornell" : "https://bg445.medium.com/"} target={index === 1 ? undefined : "_blank"} rel={index === 1 ? undefined : "noreferrer"}>
                  <span className="fn-writing-count">0{index + 1}</span>
                  <span className="fn-writing-copy"><small>{item.topic} · {item.source}</small><strong>{item.title}</strong></span>
                  <span className="fn-writing-arrow">↗</span>
                </a>
              ))}
            </div>
            <FooterNav onNavigate={navigate} />
          </section>
        )}

        {section === "study" && (
          <section className="fn-subpage">
            <span className="fn-label">04 / FORMATION</span>
            <h1 className="fn-subtitle">Learn by<br /><em>building.</em></h1>
            <div className="fn-education-card">
              <span className="fn-label">CORNELL TECH · NEW YORK</span>
              <h2>Master of Engineering</h2>
              <p>Product-focused graduate study at the intersection of technology, business, and design.</p>
              <div className="fn-edu-rule"><span>PRODUCT</span><span>TECHNOLOGY</span><span>NEW VENTURES</span></div>
            </div>
            <div className="fn-education-card fn-edu-secondary">
              <span className="fn-label">MANIPAL UNIVERSITY JAIPUR</span>
              <h2>Undergraduate years</h2>
              <p>Organized MUJ Oneiros, Rajasthan's biggest student-run cultural festival by footfall — 300 students, weekly live events, and a crash course in making things happen.</p>
            </div>
            <FooterNav onNavigate={navigate} />
          </section>
        )}

        <div className="fn-bottomline"><span>BUILT WITH CURIOSITY</span><span>© BHARAT GANDHI 2025</span></div>
      </div>

      {openStory && (
        <div className="fn-overlay" role="dialog" aria-modal="true" aria-label={`${openStory.company} field note`} onClick={() => setOpenStory(null)}>
          <article className="fn-story-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="fn-sheet-top"><span>FIELD NOTE / {openStory.mark}</span><button onClick={() => setOpenStory(null)} aria-label="Close field note">CLOSE ×</button></div>
            <span className="fn-label">{openStory.period}</span>
            <h2>{openStory.company}</h2>
            <p className="fn-story-role">{openStory.role}</p>
            <div className={`fn-story-stamp ${openStory.color}`}>{openStory.mark}</div>
            <p className="fn-story-detail">{openStory.detail}</p>
            <button className="fn-sheet-return" onClick={() => setOpenStory(null)}>BACK TO THE INDEX <span>↗</span></button>
          </article>
        </div>
      )}
    </main>
  );
}

function ExperienceList({ items, onOpen }: { items: typeof experiences; onOpen: (item: (typeof experiences)[number]) => void }) {
  return (
    <div className="fn-experience-list">
      {items.map((item) => (
        <button key={item.mark} className="fn-experience" onClick={() => onOpen(item)}>
          <span className="fn-exp-mark">{item.mark}</span>
          <span className="fn-exp-main">
            <small>{item.period}</small><strong>{item.company}</strong><span>{item.role}</span><p>{item.note}</p>
          </span>
          <span className={`fn-exp-arrow ${item.color}`}>↗</span>
        </button>
      ))}
    </div>
  );
}

function FooterNav({ onNavigate }: { onNavigate: (section: Section) => void }) {
  return (
    <section className="fn-contact">
      <span className="fn-label">GOOD WORK STARTS WITH A CONVERSATION</span>
      <h2>Have a knotty<br /><em>problem?</em></h2>
      <a href="mailto:hello@bharatgandhi.com">LET'S TALK <span>↗</span></a>
      <div className="fn-footer-switch">
        <button onClick={() => onNavigate("index")}>← INDEX</button>
        <button onClick={() => onNavigate("writing")}>NOTES ↗</button>
      </div>
    </section>
  );
}

export default PortfolioFieldnotes;
