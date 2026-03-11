import { motion } from "framer-motion";

export function Contact() {
  return (
    <section id="contact" className="py-32 bg-primary text-primary-foreground text-center">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-5xl md:text-7xl font-medium mb-6">Let's build.</h2>
          <p className="font-serif text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-xl mx-auto text-balance">
            Always open to talking about products, investments, and well-designed software.
          </p>
          
          <a
            href="mailto:hello@bharatgandhi.com"
            className="inline-block bg-background text-foreground font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-none hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
          >
            Get In Touch
          </a>
          
          <p className="mt-12 font-mono text-xs text-primary-foreground/60 uppercase tracking-widest">
            (Agent integration coming soon)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
