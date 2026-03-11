import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="about" className="py-24 max-w-4xl mx-auto px-6 md:px-8">
      <SectionHeading>About</SectionHeading>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="prose prose-lg md:prose-xl font-serif text-foreground/90 leading-relaxed max-w-3xl"
      >
        <p className="mb-6 text-balance">
          I like to do Product, GTM & Strategy. I dabble in Sales & Design. 
          I also invest small checks in startups.
        </p>
        <p className="text-balance text-muted-foreground">
          Right now, I am advising an AI service lab on product and GTM. 
          I believe in building products with precision, care, and an undeniable point of view.
        </p>
      </motion.div>
    </section>
  );
}
