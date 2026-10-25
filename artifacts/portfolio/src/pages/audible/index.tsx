import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function AudibleStory() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30 selection:text-foreground">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6 md:px-8">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="font-mono text-sm text-accent uppercase tracking-widest mb-6">Case Study</div>
            <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight text-foreground mb-8 text-balance">
              Building the Backbone of Audible Originals
            </h1>

            <div className="flex gap-4 mb-16 pb-8 border-b border-border">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Timeline</span>
                <span className="font-serif text-lg">Aug 2021 — Dec 2024</span>
              </div>
              <div className="w-[1px] bg-border h-auto" />
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Role</span>
                <span className="font-serif text-lg">Product Manager – Tech</span>
              </div>
            </div>

            <div className="prose prose-lg md:prose-xl prose-p:font-serif prose-headings:font-serif prose-headings:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none text-foreground/90">

              <p className="lead text-2xl text-foreground mb-8">
                At Audible, I owned content intelligence, monetization and production platforms for the Originals and Studios businesses across global marketplaces.
              </p>

              <h2 className="text-3xl mt-12 mb-6">Listener Segmentation</h2>
              <p>
                I developed and operationalized ML segmentation of 20M+ listeners into 36 taste categories across Audible and Amazon in 11 countries. It became the standard evaluation framework for deploying $100M+ in first-party content production over 2 years.
              </p>
              <p>
                This brought a shared audience-intelligence framework to content investment decisions across global marketplaces.
              </p>

              <h2 className="text-3xl mt-12 mb-6">Global Data Platform</h2>
              <p>
                I established the global source of truth for production, deals and publishing operations, cutting audiobook time-to-market by 50% and podcast time-to-market by 70% across 12 markets. The platform also powered Audible Brazil's $12M content-acquisition program with an operations suite taken from idea to deployment in 2 weeks.
              </p>

              <h2 className="text-3xl mt-12 mb-6">Seller Payments</h2>
              <p>
                I launched a creator-payments API for the publisher and creator ecosystem, improving error-free, on-time payments from 70% to 93% across 12 markets within 2 quarters.
              </p>

              <h2 className="text-3xl mt-12 mb-6">TV Rights Platform</h2>
              <p>
                I created a new audiobook-to-TV rights business generating approximately $7M GMV, giving global TV producers a platform to discover and acquire first-party content rights.
              </p>

              <h2 className="text-3xl mt-12 mb-6">TTS-Powered Localization</h2>
              <p>
                I built a Text-to-Speech powered audiobook production management solution that reduced localization times by 36% for titles in 3 languages, supporting catalog expansion in 8+ countries.
              </p>

              <div className="my-12 p-8 bg-muted/30 border-l-2 border-accent">
                <p className="font-serif text-xl italic m-0 text-muted-foreground text-balance">
                  "The thread across all of this work was the same: take a complex content operation, find the leverage point, and build tooling that lets it scale without scaling the team."
                </p>
              </div>

            </div>
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
