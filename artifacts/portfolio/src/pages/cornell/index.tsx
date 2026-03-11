import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function CornellStory() {
  // Scroll to top on mount
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
              The Cornell Tech Attempt: What We Built and Why It Failed
            </h1>
            
            <div className="flex gap-4 mb-16 pb-8 border-b border-border">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Timeline</span>
                <span className="font-serif text-lg">2019 — 2021</span>
              </div>
              <div className="w-[1px] bg-border h-auto" />
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Role</span>
                <span className="font-serif text-lg">Product & Strategy</span>
              </div>
            </div>

            <div className="prose prose-lg md:prose-xl prose-p:font-serif prose-headings:font-serif prose-headings:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none text-foreground/90">
              
              <p className="lead text-2xl text-foreground mb-8">
                Grad school during a global pandemic is a strange environment. 
                While the world shut down, a few of us remained on campus, using the isolation as an incubator.
              </p>

              <p>
                The premise was simple: we wanted to invent something new. Every chance we got, we were prototyping, testing, and discarding ideas. It was an exercise in extreme velocity constrained by extreme circumstances.
              </p>

              <h2 className="text-3xl mt-12 mb-6">The Thesis</h2>
              <p>
                We noticed a gap in how data was being aggregated and utilized in a specific niche. 
                Our hypothesis was that if we could streamline the ingestion pipeline and provide a more intuitive interface, we could capture a significant portion of the early-stage market.
              </p>

              <div className="my-12 p-8 bg-muted/30 border-l-2 border-accent">
                <p className="font-serif text-xl italic m-0 text-muted-foreground text-balance">
                  "We built an incredibly elegant solution for a problem that, ultimately, people weren't willing to pay enough to solve."
                </p>
              </div>

              <h2 className="text-3xl mt-12 mb-6">The Build</h2>
              <p>
                We spent months architecting the core product. I focused heavily on the GTM motion while actively contributing to product design decisions. We mapped out user journeys, ran what few remote user interviews we could, and shipped v1.
              </p>

              <h2 className="text-3xl mt-12 mb-6">The Reality</h2>
              <p>
                Here is the hard truth about building zero-to-one: a good product doesn't overcome a lack of distribution or a misjudged willingness to pay. 
              </p>
              <p>
                We failed. But failing in a controlled environment with brilliant peers provides a concentrated dose of reality that no textbook can offer. 
              </p>

              <h3 className="text-2xl mt-10 mb-4">Key Takeaways</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong>Distribution over Features:</strong> You can build the most beautiful software in the world, but if your GTM strategy is an afterthought, you are dead on arrival.</li>
                <li><strong>Validation Velocity:</strong> We should have validated the commercial appetite before writing the first line of code, not after.</li>
                <li><strong>The Value of Teams:</strong> The startup died, but the relationships forged during that intensely stressful period became the foundation of my professional network.</li>
              </ul>

              <p className="mt-12">
                This failure deeply informs how I build products today—whether at Amazon, RateGain, or advising AI startups. I look for the friction points early, and I prioritize commercial viability alongside design craft.
              </p>
            </div>
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
