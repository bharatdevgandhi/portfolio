import { ReactNode } from "react";
import { motion } from "framer-motion";

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12 flex items-center gap-4"
    >
      <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-primary">
        {children}
      </h2>
      <div className="h-[1px] flex-grow bg-border/60" />
    </motion.div>
  );
}
