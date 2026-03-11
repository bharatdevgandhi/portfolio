import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";

export function Projects() {
  return (
    <section id="projects" className="py-24 max-w-4xl mx-auto px-6 md:px-8 bg-muted/30">
      <SectionHeading>Other Endeavors</SectionHeading>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="group"
        >
          <Link href="/cornell" className="block h-full bg-background border border-border p-8 hover:border-primary hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))] transition-all duration-300">
            <div className="mb-6">
              <Tag className="mb-4">STARTUP / FAIL</Tag>
              <h3 className="text-2xl font-serif font-medium text-foreground group-hover:text-primary transition-colors flex justify-between items-start">
                Cornell Tech Startup
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </h3>
            </div>
            <p className="text-muted-foreground font-serif text-lg">
              During grad school, I failed at a startup. I tried to invent something new every chance I got. Read the story of what we built and why it didn't work.
            </p>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="group"
        >
          <a href="https://www.youtube.com/results?search_query=MUJ+Oneiros+aftermovie" target="_blank" rel="noreferrer" className="block h-full bg-background border border-border p-8 hover:border-accent hover:shadow-[4px_4px_0px_0px_hsl(var(--accent))] transition-all duration-300">
            <div className="mb-6">
              <Tag className="mb-4">MEDIA / EVENTS</Tag>
              <h3 className="text-2xl font-serif font-medium text-foreground group-hover:text-accent transition-colors flex justify-between items-start">
                MUJ Oneiros
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </h3>
            </div>
            <p className="text-muted-foreground font-serif text-lg">
              Architected Rajasthan's biggest student-run cultural festival by footfall. Built an ecosystem of 300 students producing weekly live events.
            </p>
            <div className="mt-6 font-mono text-xs text-muted-foreground uppercase tracking-widest group-hover:text-accent transition-colors">
              Watch Aftermovie →
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
