import {
  getWorkshopStatus,
  meditationFaqs,
  meditationGallery,
  meditationProgrammes,
  upcomingMeditationWorkshops,
} from "@/data/meditation";
import { entryById, links, person } from "./content";
import { CardShell } from "./Detail";
import { Tags, external } from "./V2Home";
import "./v2.css";

// The breathwork and meditation page in the v2 design. It carries every part
// of the current /meditation page: the workshop cards with their expiry, the
// teaching background, the research note, participant questions and the
// gallery. The wording of those parts is deliberate (see
// docs/meditation-campaign.md) and is kept as it is. Analytics attributes
// and test ids match the current page so the same events fire.

const enquiryHref = `mailto:${person.email}?subject=${encodeURIComponent("Meditation workshop enquiry")}`;
const researchUrl = "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2814344";
const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export default function Meditation({ initialTime }: { initialTime?: number } = {}) {
  const now = initialTime ?? Date.now();
  const entry = entryById("meditation")!;
  const workshops = upcomingMeditationWorkshops
    .map((workshop) => ({ workshop, status: getWorkshopStatus(workshop, now) }))
    .filter((item) => item.status !== "ended");

  return (
    <CardShell entry={entry} backLabel="See Bharat's work" id="meditation-page" renderedAt={now}>
      <Tags entry={entry} />
      <h1>
        <span className="v2-sr">Breathwork and meditation with Bharat Gandhi. </span>A little more room to breathe.
      </h1>
      <p className="v2-card__lede">
        Practical breathwork and meditation for the pace and pressure of being a young adult.
      </p>
      <div className="v2-card__links v2-card__links--top">
        <a className="v2-btn v2-btn--solid" href="#workshops" data-testid="link-meditation-workshop-details">
          Workshop details
        </a>
        <a className="v2-btn" href={links.instagram} data-testid="link-meditation-instagram-hero" {...external}>
          Follow along on Instagram
        </a>
      </div>

      <section id="workshops" aria-labelledby="workshops-heading">
        <h2 id="workshops-heading">Upcoming workshops</h2>
        {workshops.length > 0 ? (
          workshops.map(({ workshop, status }) => (
            <article className="v2-workshop" id={workshop.id} key={workshop.id} data-testid={`card-workshop-${workshop.id}`}>
              <p className="v2-workshop__status" data-testid={`status-workshop-${workshop.id}`}>
                {status === "in-progress" ? "In progress. Check availability with the organiser." : "Upcoming, online"}
              </p>
              <h3>{workshop.title}</h3>
              <dl className="v2-card__facts v2-card__facts--pairs">
                <div>
                  <dt>Dates</dt>
                  <dd>{workshop.date}, four consecutive weekdays</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>
                    {workshop.time}, {workshop.timezone}
                  </dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>{workshop.location}</dd>
                </div>
                <div>
                  <dt>Languages</dt>
                  <dd>{workshop.languages.join(" / ")}</dd>
                </div>
                <div>
                  <dt>Contribution</dt>
                  <dd>
                    {inr(workshop.contribution)} ({workshop.currency})
                  </dd>
                </div>
              </dl>
              <p className="v2-small">
                The official listing names Bharat as a teacher for this workshop. Registration, payment, availability
                and terms are handled by the organiser, not this website.
              </p>
              <div className="v2-card__links">
                <a
                  className="v2-btn v2-btn--solid"
                  href={workshop.registrationUrl}
                  data-meditation-action="registration"
                  data-workshop-id={workshop.id}
                  data-testid={`link-register-${workshop.id}`}
                  {...external}
                >
                  Register on Art of Living
                </a>
                <a className="v2-btn" href={workshop.sourceUrl} data-testid={`link-listing-${workshop.id}`} {...external}>
                  Official listing
                </a>
                <a
                  className="v2-btn"
                  href={enquiryHref}
                  data-meditation-action="enquiry"
                  data-enquiry-type="workshop"
                  data-testid={`link-enquiry-${workshop.id}`}
                >
                  Email a question
                </a>
              </div>
            </article>
          ))
        ) : (
          <div className="v2-workshop" data-testid="status-upcoming-workshops-empty">
            <h3>No upcoming workshops are listed right now.</h3>
            <p>New dates will appear here once confirmed. Questions are welcome by email.</p>
            <div className="v2-card__links">
              <a
                className="v2-btn"
                href={enquiryHref}
                data-meditation-action="enquiry"
                data-enquiry-type="workshop"
                data-testid="link-workshops-enquiry"
              >
                Email a question
              </a>
              <a className="v2-btn" href={links.instagram} data-testid="link-workshops-instagram" {...external}>
                Follow for updates
              </a>
            </div>
          </div>
        )}
      </section>

      <section className="v2-chapter" aria-labelledby="approach-heading">
        <h2 id="approach-heading">Simple tools, learned together.</h2>
        <p>
          Bharat describes himself as a 1,000-hour-trained breathwork and meditation instructor with SKY Campus
          Happiness. He teaches SKY Campus Happiness in the US, and YES!+ and the Happiness Program of Art of Living
          in India.
        </p>
        <p>
          His focus is helping young adults ages 18–35 learn breathwork and meditation through guided, accessible
          practice. He has taught at Columbia University and in the New York and New Jersey area, San Francisco State
          University and San Francisco, and across the Delhi-NCR region.
        </p>
        <p className="v2-small">
          This background is shared by Bharat. The workshop listing above independently confirms his engagement as a
          teacher for that event.
        </p>
        <h3>Official programme pages</h3>
        <ul className="v2-linklist">
          {meditationProgrammes.map((programme) => (
            <li key={programme.url}>
              <a
                href={programme.url}
                data-testid={`link-programme-${programme.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                {...external}
              >
                {programme.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="v2-small">These describe the programmes; they are not certification records.</p>
      </section>

      <section className="v2-chapter" aria-labelledby="research-heading">
        <h2 id="research-heading">What one trial found</h2>
        <p>
          A randomized trial published in <cite>JAMA Network Open</cite> compared a SKY breathing programme with stress
          management education in 129 practising physicians. Over eight weeks of follow-up, the SKY group reported
          improvements in self-reported stress, depression and some wellbeing measures.
        </p>
        <p className="v2-small">
          The studied programme included ongoing practice. These findings do not show that the November workshop, or
          young adults, will see the same outcomes, or that SKY is better than every alternative. This is not a
          replacement for medical or mental-health care.
        </p>
        <p>
          <a href={researchUrl} data-testid="link-research-jama" {...external}>
            Read the study
          </a>
        </p>
      </section>

      <section id="participant-questions" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Participant questions</h2>
        <div className="v2-faq">
          {meditationFaqs.map((item, index) => (
            <details key={item.question} data-testid={`faq-item-${index}`}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="v2-chapter" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading">Past workshops</h2>
        {meditationGallery.length > 0 ? (
          <div className="v2-pastshots">
            {meditationGallery.map((item) => (
              <figure key={item.id} data-testid={`gallery-item-${item.id}`}>
                <img src={item.src} alt={item.alt} loading="lazy" />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div data-testid="status-gallery-empty">
            <p>
              Workshop moments will find their way here. The gallery is waiting for photographs from past sessions.
              For moments shared in the meantime, visit Instagram.
            </p>
            <p>
              <a href={links.instagram} data-testid="link-gallery-instagram" {...external}>
                See past moments
              </a>
            </p>
          </div>
        )}
      </section>
    </CardShell>
  );
}
