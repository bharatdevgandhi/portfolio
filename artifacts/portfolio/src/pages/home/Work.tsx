import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

interface WorkItem {
  company: string;
  role: string;
  dates: string;
  description: string;
  tags: string[];
  internalUrl?: string;
  url?: string;
}

const workItems: WorkItem[] = [
  {
    company: "District by Zomato",
    role: "Platform Product Manager",
    dates: "Apr 2026 — Present",
    description: "Own search, discovery, personalization, notifications and AI-native products. Launched contextual search that cut null results from 7% to 1.8%, lifted search CTR by 5% and generated a 2% daily GMV uplift. Introduced ML-based homepage personalization that increased inventory views by 30%.",
    tags: ["AI", "Search", "Personalization", "B2C"],
  },
  {
    company: "CanvasX AI",
    role: "Head of Product & Growth (Advisory)",
    dates: "Jan 2025 — Apr 2026",
    description: "Led product strategy, GTM and forward deployment for agentic workflow products. Architected Sketch's product, pricing and deployment model, adopted by 25+ SMB teams in India. Deployed an agentic data-analysis product for a retail client with 25,000 users.",
    tags: ["GTM", "Strategy", "AI"],
  },
  {
    company: "Audible / Amazon",
    role: "Product Manager – Tech, Audible Originals & Content Systems",
    dates: "Aug 2021 — Dec 2024",
    description: "Owned content intelligence, monetization and production platforms across global marketplaces. Built ML segmentation for 20M+ listeners, launched a ~$7M GMV audiobook-to-TV rights business and reduced audiobook time-to-market by 50%.",
    tags: ["0→1", "B2C", "Content", "AI"],
    internalUrl: "/audible",
  },
  {
    company: "RateGain",
    role: "Product Manager",
    dates: "Jan 2018 — Jun 2019",
    description: "Owned scraping infrastructure and travel-pricing data products. Launched products contributing to a 40% revenue increase over 3 quarters. Built DataSURE, improving successful-scrape rates from 94% to 98% across 550+ bots and lifting NPS by 25 points.",
    tags: ["0→1", "B2B", "ML", "Data"],
    internalUrl: "/rategain",
  },
];

export function Work() {
  return (
    <section id="work" className="py-10 md:py-12 max-w-4xl mx-auto px-6 md:px-8 pt-[20px] pb-[20px]">
      <SectionHeading>Selected Work</SectionHeading>
      <div className="flex flex-col gap-12">
        {workItems.map((item, index) => {
          const isInternal = !!item.internalUrl;
          const isExternal = !!item.url;
          const hasLink = isInternal || isExternal;

          const content = (
            <>
              <h3 className="text-xl md:text-2xl font-serif font-medium text-foreground mb-2 group-hover:text-primary transition-colors inline-flex items-center gap-2">
                {item.company}
                {hasLink && (
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                )}
              </h3>
              <p className="font-mono text-xs text-primary mb-2">{item.role}</p>
              {item.dates && (
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">{item.dates}</p>
              )}
              <p className="text-lg md:text-xl text-muted-foreground font-serif leading-snug mb-5 max-w-2xl text-balance">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          );

          const className = "group relative block border-l border-border pl-6 md:pl-8 py-2 transition-colors hover:border-primary";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {isInternal ? (
                <Link href={item.internalUrl!} className={className}>
                  {content}
                </Link>
              ) : isExternal ? (
                <a href={item.url} target="_blank" rel="noreferrer" className={className}>
                  {content}
                </a>
              ) : (
                <div className={className}>
                  {content}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
