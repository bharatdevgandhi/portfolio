import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Work", href: "#work" },
    { name: "Writing", href: "#writing" },
    { name: "Projects", href: "#projects" },
    { name: "Education", href: "#education" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-background/80 backdrop-blur-md border-border py-4" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8 flex justify-between items-center">
        <Link href="/" className="font-mono text-sm font-bold tracking-tighter hover:text-primary transition-colors">
          BG.
        </Link>

        {isHome ? (
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors link-underline pb-1"
              >
                {link.name}
              </a>
            ))}
          </nav>
        ) : (
          <Link href="/" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors link-underline pb-1">
            ← Back Home
          </Link>
        )}
      </div>
    </motion.header>
  );
}
