import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Education() {
  return (
    <section id="education" className="py-24 max-w-4xl mx-auto px-6 md:px-8">
      <SectionHeading>Education</SectionHeading>
      
      <div className="flex flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-border pt-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4">
            <h3 className="text-2xl font-serif font-medium text-foreground">Cornell Tech</h3>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-2 sm:mt-0">2019 — 2021</span>
          </div>
          <h4 className="font-mono text-sm text-primary uppercase tracking-wider mb-4">Master's Degree</h4>
          <p className="text-lg text-muted-foreground font-serif max-w-2xl text-balance">
            During COVID, I had the fortune to remain on campus and continue interacting with other grad students. I made as many friends as I could, which was the hardest thing to do during those isolated years.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-border pt-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4">
            <h3 className="text-2xl font-serif font-medium text-foreground">Manipal University</h3>
          </div>
          <h4 className="font-mono text-sm text-primary uppercase tracking-wider mb-4">B.S. Computer Science</h4>
          <p className="text-lg text-muted-foreground font-serif max-w-2xl text-balance">
            Spent most of my time understanding media, circuitry, and long running investments alongside computer science fundamentals.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
