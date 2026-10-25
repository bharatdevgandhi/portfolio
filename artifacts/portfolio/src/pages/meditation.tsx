import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, Clock3, Languages, Mail, MapPin, IndianRupee, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  getWorkshopStatus,
  meditationFaqs,
  meditationGallery,
  meditationProgrammes,
  upcomingMeditationWorkshops,
} from "@/data/meditation";

const instagramUrl = "https://www.instagram.com/betterbharaat";
const enquiryHref = `mailto:bharatgandhi.sf@gmail.com?subject=${encodeURIComponent("Meditation workshop enquiry")}`;
const researchUrl = "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2814344";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function initialRenderTime() {
  // Match the saved HTML on hydration, then refresh from the browser clock.
  const saved = typeof document !== "undefined"
    ? document.getElementById("meditation-page")?.getAttribute("data-rendered-at")
    : null;
  return saved && Number.isFinite(Number(saved)) ? Number(saved) : Date.now();
}

export default function Meditation({ initialTime }: { initialTime?: number } = {}) {
  const [now, setNow] = useState(() => initialTime ?? initialRenderTime());

  useEffect(() => {
    window.scrollTo(0, 0);
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const workshops = useMemo(
    () =>
      upcomingMeditationWorkshops
        .map((w) => ({ w, status: getWorkshopStatus(w, now) }))
        .filter((x) => x.status !== "ended"),
    [now],
  );

  return (
    <div id="meditation-page" data-rendered-at={now} className="min-h-[100dvh] flex flex-col bg-background selection:bg-accent/30 selection:text-foreground">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <motion.header
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative overflow-hidden border-b border-border pb-14 md:pb-20"
          >
            <div className="absolute right-0 top-0 hidden h-44 w-44 rounded-full border border-accent/20 md:block" aria-hidden="true" />
            <div className="absolute right-8 top-8 hidden h-28 w-28 rounded-full border border-accent/30 md:block" aria-hidden="true" />
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-primary">
              Breathwork &amp; meditation
            </p>
            <h1 className="relative max-w-2xl text-5xl font-medium leading-[0.98] tracking-tight text-foreground md:text-7xl">
              <span className="sr-only">Breathwork and meditation with Bharat Gandhi. </span>
              A little more room to <em className="font-normal text-primary">breathe.</em>
            </h1>
            <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-foreground/75 md:text-2xl">
              Practical breathwork and meditation for the pace and pressure of
              being a young adult.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="#workshops"
                data-testid="link-meditation-workshop-details"
                className="inline-flex items-center gap-2 bg-primary px-5 py-3 font-mono text-xs uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-85"
              >
                Workshop details <ChevronDown className="h-4 w-4" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="link-meditation-instagram-hero"
                className="inline-flex items-center gap-2 border-b border-primary/40 pb-1 font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:border-primary hover:text-primary/80"
              >
                Follow along on Instagram <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.header>

          <section id="workshops" aria-labelledby="workshops-heading" className="scroll-mt-28 border-b border-border py-12 md:py-16">
            <div className="mb-8">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Join a session
              </p>
              <h2 id="workshops-heading" className="font-serif text-3xl md:text-4xl">
                Upcoming workshops
              </h2>
            </div>

            {workshops.length > 0 ? (
              <div className="grid gap-5">
                {workshops.map(({ w, status }) => (
                  <article id={w.id} key={w.id} data-testid={`card-workshop-${w.id}`} className="scroll-mt-28 border border-primary/30 bg-muted/20">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-3 md:px-8">
                      <span data-testid={`status-workshop-${w.id}`} className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                        {status === "in-progress"
                          ? "In progress · check availability with the organiser"
                          : "Upcoming · online"}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        Art of Living listing
                      </span>
                    </div>
                    <div className="p-6 md:p-8">
                      <h3 className="font-serif text-2xl md:text-3xl">{w.title}</h3>
                      <dl className="mt-6 grid gap-x-8 gap-y-4 font-mono text-xs text-foreground/80 sm:grid-cols-2">
                        <div className="flex gap-3"><CalendarDays className="h-4 w-4 shrink-0 text-primary" /><div><dt className="text-muted-foreground">Dates</dt><dd>{w.date} · four consecutive weekdays</dd></div></div>
                        <div className="flex gap-3"><Clock3 className="h-4 w-4 shrink-0 text-primary" /><div><dt className="text-muted-foreground">Time</dt><dd>{w.time} · {w.timezone}</dd></div></div>
                        <div className="flex gap-3"><MapPin className="h-4 w-4 shrink-0 text-primary" /><div><dt className="text-muted-foreground">Format</dt><dd>{w.location}</dd></div></div>
                        <div className="flex gap-3"><Languages className="h-4 w-4 shrink-0 text-primary" /><div><dt className="text-muted-foreground">Languages</dt><dd>{w.languages.join(" / ")}</dd></div></div>
                        <div className="flex gap-3"><IndianRupee className="h-4 w-4 shrink-0 text-primary" /><div><dt className="text-muted-foreground">Contribution</dt><dd>{inr(w.contribution)} ({w.currency})</dd></div></div>
                      </dl>
                      <p className="mt-6 max-w-2xl font-serif text-base leading-relaxed text-muted-foreground">
                        The official listing names Bharat as a teacher for this workshop. Registration, payment, availability and terms are handled by the organiser, not this website.
                      </p>
                      <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                        <a
                          href={w.registrationUrl}
                          target="_blank"
                          rel="noreferrer"
                          data-meditation-action="registration"
                          data-workshop-id={w.id}
                          data-testid={`link-register-${w.id}`}
                          className="inline-flex items-center gap-2 bg-primary px-5 py-3 font-mono text-xs uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-85"
                        >
                          Register on Art of Living <ArrowUpRight className="h-4 w-4" />
                        </a>
                        <a
                          href={w.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          data-testid={`link-listing-${w.id}`}
                          className="inline-flex items-center gap-2 border-b border-primary/40 pb-1 font-mono text-xs uppercase tracking-widest text-primary hover:border-primary"
                        >
                          Official listing <ArrowUpRight className="h-4 w-4" />
                        </a>
                        <a
                          href={enquiryHref}
                          data-meditation-action="enquiry"
                          data-enquiry-type="workshop"
                          data-testid={`link-enquiry-${w.id}`}
                          className="inline-flex items-center gap-2 border-b border-primary/40 pb-1 font-mono text-xs uppercase tracking-widest text-primary hover:border-primary"
                        >
                          <Mail className="h-4 w-4" /> Email a question
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div data-testid="status-upcoming-workshops-empty" className="flex flex-col gap-5 border border-border bg-muted/20 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
                <div>
                  <p className="font-serif text-xl">No upcoming workshops are listed right now.</p>
                  <p className="mt-2 max-w-lg font-serif text-base leading-relaxed text-muted-foreground">
                    New dates will appear here once confirmed. Questions are welcome by email.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3">
                  <a
                    href={enquiryHref}
                    data-meditation-action="enquiry"
                    data-enquiry-type="workshop"
                    data-testid="link-workshops-enquiry"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-primary/75"
                  >
                    <Mail className="h-4 w-4" /> Email a question
                  </a>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="link-workshops-instagram"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-primary/75"
                  >
                    Follow for updates <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </section>

          <section aria-labelledby="approach-heading" className="grid gap-10 border-b border-border py-12 md:grid-cols-[1fr_1.3fr] md:gap-16 md:py-16">
            <div>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Teaching background · shared by Bharat
              </p>
              <h2 id="approach-heading" className="max-w-sm font-serif text-3xl leading-tight md:text-4xl">
                Simple tools, learned together.
              </h2>
            </div>
            <div className="space-y-5 font-serif text-lg leading-relaxed text-foreground/75">
              <p>
                Bharat describes himself as a 1,000-hour-trained breathwork and
                meditation instructor with SKY Campus Happiness. He teaches SKY
                Campus Happiness in the US, and YES!+ and the Happiness Program
                of Art of Living in India.
              </p>
              <p>
                His focus is helping young adults ages 18–35 learn breathwork
                and meditation through guided, accessible practice. He has
                taught at Columbia University and in the New York and New Jersey
                area, San Francisco State University and San Francisco, and
                across the Delhi-NCR region.
              </p>
              <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                This background is shared by Bharat. The workshop listing above
                independently confirms his engagement as a teacher for that event.
              </p>
              <div>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Official programme pages</p>
                <ul className="space-y-2">
                  {meditationProgrammes.map((p) => (
                    <li key={p.url}>
                      <a href={p.url} target="_blank" rel="noreferrer" data-testid={`link-programme-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="inline-flex items-center gap-2 text-primary hover:text-primary/75">
                        {p.name} <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  These describe the programmes; they are not certification records.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="research-heading" className="border-b border-border py-12 md:py-16">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">A note on research</p>
            <h2 id="research-heading" className="font-serif text-3xl md:text-4xl">What one trial found</h2>
            <div className="mt-6 max-w-2xl space-y-4 font-serif text-lg leading-relaxed text-foreground/75">
              <p>
                A randomized trial published in <em>JAMA Network Open</em> compared
                a SKY breathing programme with stress management education in 129
                practising physicians. Over eight weeks of follow-up, the SKY group
                reported improvements in self-reported stress, depression and some
                wellbeing measures.
              </p>
              <p className="text-base text-muted-foreground">
                The studied programme included ongoing practice. These findings do
                not show that the November workshop, or young adults, will see the
                same outcomes, or that SKY is better than every alternative. This is
                not a replacement for medical or mental-health care.
              </p>
              <a href={researchUrl} target="_blank" rel="noreferrer" data-testid="link-research-jama" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-primary/75">
                Read the study <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </section>

          <section id="participant-questions" aria-labelledby="faq-heading" className="border-b border-border py-12 md:py-16">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Before you register</p>
            <h2 id="faq-heading" className="mb-8 font-serif text-3xl md:text-4xl">Participant questions</h2>
            <div className="border-t border-border">
              {meditationFaqs.map((f, i) => (
                <details key={f.question} data-testid={`faq-item-${i}`} className="group border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-xl [&::-webkit-details-marker]:hidden">
                    {f.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="max-w-2xl pb-6 font-serif text-base leading-relaxed text-foreground/70">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section aria-labelledby="gallery-heading" className="py-12 md:py-16">
            <div className="mb-8">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                From the room
              </p>
              <h2 id="gallery-heading" className="font-serif text-3xl md:text-4xl">
                Past workshops
              </h2>
            </div>
            {meditationGallery.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {meditationGallery.map((item) => (
                  <figure key={item.id} data-testid={`gallery-item-${item.id}`} className="overflow-hidden border border-border bg-muted/20">
                    <img src={item.src} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    <figcaption className="px-4 py-3 font-serif text-base text-muted-foreground">{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div data-testid="status-gallery-empty" className="grid gap-5 border border-border bg-[#f3eee5] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
                <div>
                  <p className="font-serif text-xl">Workshop moments will find their way here.</p>
                  <p className="mt-2 max-w-lg font-serif text-base leading-relaxed text-foreground/65">
                    The gallery is waiting for photographs from past sessions.
                    For moments shared in the meantime, visit Instagram.
                  </p>
                </div>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="link-gallery-instagram"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-primary/75"
                >
                  See past moments <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
