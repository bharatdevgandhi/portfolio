import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";

const projects = [
  {
    tag: "STARTUP / FAIL",
    title: "Plaza — Startup during grad school",
    description:
      "Built Plaza during grad school — a consumer app for universal comments across the internet. Tried to invent something new every chance I got. Read the story of what we built and why it didn't work.",
    href: "/cornell",
    internal: true,
    accent: "primary" as const,
  },
  {
    tag: "MEDIA / EVENTS",
    title: "MUJ Oneiros",
    description:
      "Architected Rajasthan's biggest student-run cultural festival by footfall. Built an ecosystem of 300 students producing weekly live events.",
    href: "https://www.youtube.com/results?search_query=MUJ+Oneiros+aftermovie",
    internal: false,
    accent: "accent" as const,
    cta: "Watch Aftermovie →",
  },
  {
    tag: "UX / RESEARCH",
    title: "Reinventing Live TV News — FuboTV × Cornell Tech",
    description:
      "Led UX research and product design to reimagine live TV news for cord-cutters. Ran ethnographic studies, identified the \"agency gap,\" and designed a multi-source viewing experience.",
    href: "/fubo",
    internal: true,
    accent: "primary" as const,
  },
];

export function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
    return undefined;
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>("[data-card]")?.offsetWidth ?? 400;
    el.scrollBy({ left: direction === "left" ? -cardWidth - 32 : cardWidth + 32, behavior: "smooth" });
  };

  return (
    <section id="projects" className="py-10 md:py-12 max-w-4xl mx-auto px-6 md:px-8 bg-muted/30 pt-[20px] pb-[20px]">
      <SectionHeading>Projects</SectionHeading>
      <div className="flex justify-end gap-2 mb-6 -mt-4">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="p-2 border border-border rounded-sm hover:border-primary hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="p-2 border border-border rounded-sm hover:border-primary hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {projects.map((project, i) => {
          const isPrimary = project.accent === "primary";
          const cardContent = (
            <div data-card className={`min-w-[340px] w-[340px] md:min-w-[380px] md:w-[380px] snap-start flex-shrink-0 bg-background border border-border p-8 transition-all duration-300 h-full flex flex-col ${isPrimary ? "hover:border-primary hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))]" : "hover:border-accent hover:shadow-[4px_4px_0px_0px_hsl(var(--accent))]"}`}>
              <div className="mb-6">
                <Tag className="mb-4">{project.tag}</Tag>
                <h3 className={`text-2xl font-serif font-medium text-foreground transition-colors flex justify-between items-start ${isPrimary ? "group-hover:text-primary" : "group-hover:text-accent"}`}>
                  {project.title}
                  <ArrowUpRight className={`w-5 h-5 flex-shrink-0 ml-2 text-muted-foreground transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${isPrimary ? "group-hover:text-primary" : "group-hover:text-accent"}`} />
                </h3>
              </div>
              <p className="text-muted-foreground font-serif text-lg flex-grow">
                {project.description}
              </p>
              {project.cta && (
                <div className={`mt-6 font-mono text-xs text-muted-foreground uppercase tracking-widest transition-colors ${isPrimary ? "group-hover:text-primary" : "group-hover:text-accent"}`}>
                  {project.cta}
                </div>
              )}
            </div>
          );

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group flex-shrink-0"
            >
              {project.internal ? (
                <Link href={project.href} className="block h-full">
                  {cardContent}
                </Link>
              ) : (
                <a href={project.href} target="_blank" rel="noreferrer" className="block h-full">
                  {cardContent}
                </a>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
