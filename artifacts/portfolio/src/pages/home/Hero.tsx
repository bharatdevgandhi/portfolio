import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { ArrowDown } from "lucide-react";

function StaggeredName({ name, delay }: { name: string; delay: number }) {
  const letters = Array.from(name);

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 30, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 120,
      },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className="inline-flex"
      style={{ perspective: "500px" }}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          variants={child}
          className="inline-block"
          style={{ transformOrigin: "bottom" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.15] text-primary">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          className="absolute"
        >
          <motion.path
            d="M -100 400 L 200 400 L 250 250 L 500 250 L 550 100 L 800 100 L 850 350 L 1300 350"
            fill="none"
            strokeWidth="3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
          <motion.circle
            cx="250"
            cy="250"
            r="6"
            fill="var(--color-accent)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          />
          <motion.circle
            cx="550"
            cy="100"
            r="6"
            fill="var(--color-accent)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          />
          <motion.circle
            cx="850"
            cy="350"
            r="6"
            fill="var(--color-accent)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.5 }}
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 md:px-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium leading-[1.05] tracking-tight text-foreground">
            <StaggeredName name="Bharat Gandhi" delay={2.5} />
          </h1>
        </div>

        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal leading-[1.3] tracking-tight text-foreground/80 mb-10">
            <AnimatedText
              text="I craft software products and do what's needed to bring them to life."
              delay={3.8}
            />
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 5.5 }}
          className="flex flex-wrap gap-6 items-center"
        >
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
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-primary/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
