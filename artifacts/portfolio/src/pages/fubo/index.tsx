import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function FuboStory() {
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
              Reinventing Live TV News — FuboTV × Cornell Tech
            </h1>
            
            <div className="flex gap-4 mb-16 pb-8 border-b border-border">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Timeline</span>
                <span className="font-serif text-lg">2019</span>
              </div>
              <div className="w-[1px] bg-border h-auto" />
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Role</span>
                <span className="font-serif text-lg">Product & UX Research</span>
              </div>
            </div>

            <div className="prose prose-lg md:prose-xl prose-p:font-serif prose-headings:font-serif prose-headings:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-none text-foreground/90">
              
              <p className="lead text-2xl text-foreground mb-8">
                FuboTV had a hypothesis: live TV news was broken for the cord-cutting generation. They partnered with Cornell Tech to find out why — and what a better product might look like.
              </p>

              <img
                src="https://bharatdevgandhi.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F2d8a93e8-7255-4b4b-b4a2-cb8983df95e7%2FIMG_20191104_162953_456.jpg?table=block&id=79f7a3b1-8072-4b84-b8ff-22b0e4da1035&spaceId=d50b4f03-6ef9-4766-bea2-6f8bd16ba923&width=1460&userId=&cache=v2"
                alt="Cornell Tech campus on Roosevelt Island, New York City"
                className="w-full rounded-sm my-12"
                loading="lazy"
              />

              <h2 className="text-3xl mt-12 mb-6">Discovery</h2>
              <p>
                The brief from FuboTV was deceptively simple: figure out why younger demographics weren't watching live news, and design an experience that might change that. Straightforward on paper. Messy in reality.
              </p>
              <p>
                We started where good product work always starts — with users, not with wireframes. We ran a multi-week ethnographic study across diverse demographics in New York City, observing real viewing behavior in living rooms, commuter trains, and office break rooms. The goal wasn't to ask people what they wanted. It was to watch what they actually did.
              </p>
              <p>
                Three patterns emerged fast. First, news consumption had already migrated to social feeds and short-form video — the TV was competing with the phone, and losing. Second, the lean-back experience of traditional TV news felt passive and outdated to viewers who expected interactivity. Third, trust was fractured; younger viewers didn't trust any single source, and the inability to cross-reference in real-time was a dealbreaker.
              </p>

              <div className="my-12 p-8 bg-muted/30 border-l-2 border-accent">
                <p className="font-serif text-xl italic m-0 text-muted-foreground text-balance">
                  "I watch news because my husband has a habit of it... I would never turn it on myself. It feels like something that happens to me, not something I choose."
                </p>
              </div>

              <p>
                That quote from a participant in her 30s crystallized the core insight: live TV news had a consent problem. Viewers felt like hostages to the broadcast schedule and editorial decisions of a single channel. The UX wasn't just suboptimal — it was adversarial to how modern audiences consume information.
              </p>

              <h2 className="text-3xl mt-12 mb-6">Product</h2>
              <p>
                Armed with these insights, we made a deliberate product bet: don't fix the TV news interface. Reimagine the information architecture around user agency.
              </p>
              <p>
                We designed a multi-source live news experience that let viewers toggle between channels covering the same story in real-time, surface contextual data alongside the broadcast, and control the depth of their engagement — from a headline glance to a deep-dive with supplementary articles and data visualizations.
              </p>

              <img
                src="https://bharatdevgandhi.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F83d30ef9-119f-4ff2-8b6e-b859abd9dfcb%2FIMG_20191117_185914.jpg?table=block&id=b1341f33-7420-48bc-85f3-adf4d1383892&spaceId=d50b4f03-6ef9-4766-bea2-6f8bd16ba923&width=860&userId=&cache=v2"
                alt="Participant study — user watching FuboTV during research session"
                className="w-full rounded-sm my-12"
                loading="lazy"
              />

              <p>
                The key design decisions were ruthlessly prioritized. We killed features that added complexity without adding agency. The interactive timeline — which let users scrub back through a live broadcast to the moment a story broke — survived every round of cuts because it directly addressed the "hostage" problem. The social sentiment overlay did not, because in testing it distracted more than it informed.
              </p>
              <p>
                We prototyped in high fidelity and tested with the same participants from our discovery phase. The results were encouraging: engagement time increased, and more importantly, participants described the experience as "choosing to watch" rather than "having it on." That shift in language was the metric that mattered.
              </p>

              <h2 className="text-3xl mt-12 mb-6">Learnings</h2>
              <p>
                This project taught me something I carry into every product decision today: the most dangerous assumption in product work is that your users' problem is a feature gap. FuboTV didn't need a better remote control for live news. They needed to rethink who holds the remote.
              </p>

              <img
                src="https://bharatdevgandhi.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F4f5cc6ff-db40-462f-b35c-a9f9c77a65e5%2FTeam_25_Poster.jpg?table=block&id=2cf4f07d-ebcc-4cc0-b2ab-97d1d52194cf&spaceId=d50b4f03-6ef9-4766-bea2-6f8bd16ba923&width=860&userId=&cache=v2"
                alt="Team 25 project poster presentation at Cornell Tech"
                className="w-full rounded-sm my-12"
                loading="lazy"
              />

              <h3 className="text-2xl mt-10 mb-4">Key Takeaways</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong>Ethnography beats surveys:</strong> Watching users in their actual environment revealed insights that no questionnaire would have surfaced. The "consent problem" only became visible through observation.</li>
                <li><strong>Agency is the product:</strong> In a world of infinite content, the differentiator isn't what you show people — it's how much control you give them over the experience.</li>
                <li><strong>Kill your darlings early:</strong> We cut half our features after the first round of testing. The product got better every time we removed something. Complexity is the enemy of adoption.</li>
                <li><strong>Corporate partnerships sharpen thinking:</strong> Working with FuboTV's product team forced us to ground every recommendation in business reality. Academic rigor plus commercial constraints produces better work than either alone.</li>
              </ul>

              <p className="mt-12">
                This project sits at the intersection of media, UX research, and product strategy — three domains I keep returning to. The core lesson — that great products give users agency, not just features — continues to shape how I approach every zero-to-one problem.
              </p>
            </div>
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
