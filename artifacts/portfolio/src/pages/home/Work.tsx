import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { ArrowUpRight } from "lucide-react";

const workItems = [
  {
    company: "Audible / Amazon",
    description: "Built the backbone of Audible Originals.",
    tags: ["0\u21921", "B2C", "Content"],
    url: "https://www.audible.com/ep/originals",
  },
  {
    company: "RateGain",
    description: "Built arguably the world's largest rate scraper for hotels. Invented a new TV remote in the middle of it.",
    tags: ["0\u21921", "B2B", "Hardware", "Data"],
    url: "https://rategain.com",
  },
  {
    company: "AI Service Lab",
    description: "Advising on product and GTM strategy.",
    tags: ["GTM", "Strategy", "AI"],
  }
];

export function Work() {
  return (
    <section id="work" className="py-24 max-w-4xl mx-auto px-6 md:px-8">
      <SectionHeading>Selected Work</SectionHeading>
      
      <div className="flex flex-col gap-12">
        {workItems.map((item, index) => {
          const Wrapper = item.url ? "a" : "div";
          const wrapperProps = item.url
            ? { href: item.url, target: "_blank" as const, rel: "noreferrer" }
            : {};

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Wrapper
                {...wrapperProps}
                className="group relative block border-l border-border pl-6 md:pl-8 py-2 transition-colors hover:border-primary"
              >
                <h3 className="text-xl md:text-2xl font-serif font-medium text-foreground mb-2 group-hover:text-primary transition-colors inline-flex items-center gap-2">
                  {item.company}
                  {item.url && (
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  )}
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground font-serif leading-snug mb-5 max-w-2xl text-balance">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                
                <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Wrapper>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
