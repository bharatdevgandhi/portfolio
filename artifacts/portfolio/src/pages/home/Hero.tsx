import { motion } from "framer-motion";
import { ResumeLink } from "@/components/ResumeLink";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center overflow-hidden pt-[56px]">
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.15] text-primary">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          className="absolute"
        >
          <motion.path
            d="M 0 500 C 150 500, 350 498, 550 495 C 700 492, 800 485, 870 460 C 920 440, 960 390, 1000 300 C 1030 220, 1060 120, 1080 -20"
            fill="none"
            strokeWidth="3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          />
          <motion.circle
            cx="1080"
            cy="-20"
            r="5"
            fill="var(--color-accent)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ delay: 4.4, duration: 0.6, ease: "easeOut" }}
          />
          <motion.circle
            cx="1080"
            cy="-20"
            r="12"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5], opacity: [0.6, 0] }}
            transition={{ delay: 4.4, duration: 1.2, ease: "easeOut" }}
          />
        </svg>
      </div>
      <div className="max-w-4xl mx-auto w-full px-6 md:px-8 relative z-10">
        <h1 className="sm:text-2xl md:text-3xl lg:text-[2.25rem] font-serif tracking-normal text-foreground/85 max-w-4xl text-[28px] font-extralight mb-[80px] text-left">I am Bharat Gandhi. I build AI products and take them to market. Currently, I am a Platform Product Manager at District by Zomato, leading search, discovery, personalization and AI-native products.</h1>

        <div className="flex flex-wrap gap-6 items-center">
          <a
            href="https://x.com/bharaatobama"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors link-underline"
          >
            X.com
          </a>
          <a
            href="https://linkedin.com/in/bdgandhi"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors link-underline"
          >
            LinkedIn
          </a>
          <a
            href="https://bharatgandhi.substack.com"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors link-underline"
          >
            Substack
          </a>
          <a
            href="https://bg445.medium.com/"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors link-underline"
          >
            Medium
          </a>
          <ResumeLink location="hero" />
        </div>
      </div>
    </section>
  );
}
