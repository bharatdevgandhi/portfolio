import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function RateGainStory() {
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
              RateGain: Travel Pricing Products and Scraping Infrastructure
            </h1>

            <div className="flex gap-4 mb-16 pb-8 border-b border-border">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Timeline</span>
                <span className="font-serif text-lg">Jan 2018 — Jun 2019</span>
              </div>
              <div className="w-[1px] bg-border h-auto" />
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Role</span>
                <span className="font-serif text-lg">Product Manager</span>
              </div>
            </div>

            <div className="prose prose-lg md:prose-xl prose-p:font-serif prose-headings:font-serif prose-headings:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none text-foreground/90">

              <p className="lead text-2xl text-foreground mb-8">
                At RateGain, I went from intern to PM — first building a 0-to-1 airline pricing product, then owning the scraping infrastructure powering the industry's leading travel pricing intelligence platform.
              </p>

              <h2 className="text-3xl mt-12 mb-6">Airline Products (Internship)</h2>
              <p>
                During my Jan–Jun 2018 internship, I delivered an airline-pricing product from scratch that enabled approximately 10% revenue uplift per customer, before converting to a full-time Product Manager role.
              </p>

              <h2 className="text-3xl mt-12 mb-6">DataSURE: ML-Powered Scraping</h2>
              <p>
                I engineered DataSURE, an ML framework that increased successful-scrape rates from 94% to 98% across 550+ bots and lifted NPS by 25 points within 2 quarters.
              </p>

              <h2 className="text-3xl mt-12 mb-6">New Revenue Channels</h2>
              <p>
                I synthesized customer feedback to build new user experiences — one-click on-demand scrape, Airbnb price data, and pricing difference preview — driving a 40% increase in revenue over 3 quarters.
              </p>

              <h2 className="text-3xl mt-12 mb-6">Geo-Location Scraping</h2>
              <p>
                I launched geo-location-based scraping techniques by rebuilding the top 40 bots, unlocking new customers in EMEA, US, and APAC markets.
              </p>

              <div className="my-12 p-8 bg-muted/30 border-l-2 border-accent">
                <p className="font-serif text-xl italic m-0 text-muted-foreground text-balance">
                  "RateGain taught me what it means to own infrastructure at scale — where every percentage point of reliability translates directly into revenue."
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
