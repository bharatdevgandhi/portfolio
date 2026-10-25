import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";


export function Education() {
  return (
    <section id="education" className="py-10 md:py-12 max-w-4xl mx-auto px-6 md:px-8">
      <SectionHeading>Education</SectionHeading>
      
      <div className="flex flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-border pt-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4">
            <h3 className="text-2xl font-serif font-medium text-foreground">Cornell University</h3>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-2 sm:mt-0">2019 — 2021</span>
          </div>
          <h4 className="font-mono text-sm text-primary uppercase tracking-wider mb-4">MS, Information Systems — Jacobs Technion-Cornell dual MS</h4>
          <p className="text-lg text-muted-foreground font-serif max-w-2xl text-balance">
            Cornell Tech was one of the best learning experiences of my life. During COVID, I had the fortune to remain on campus and continue interacting with other grad students unlike most students at the time. Here, I failed at my first startup, built something in every class, and made as many friends as I could.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-border pt-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4">
            <h3 className="text-2xl font-serif font-medium text-foreground">Manipal University Jaipur</h3>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mt-2 sm:mt-0">2013 — 2017</span>
          </div>
          <h4 className="font-mono text-sm text-primary uppercase tracking-wider mb-4">Bachelor of Engineering, Computer Science</h4>
          <p className="text-lg text-muted-foreground font-serif max-w-2xl text-balance">
            Alongside learning the basics of CS Engineering, I spent most of my time understanding media, founded a filmmaking society, led and dounded multiple student bodies that ultimately allowed me to architect Rajasthan's biggest student-run cultural festival by footfall. (in a single iteration)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
