import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "./Hero";
import { About } from "./About";
import { Work } from "./Work";
import { Writing } from "./Writing";
import { Projects } from "./Projects";
import { Education } from "./Education";
import { Contact } from "./Contact";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30 selection:text-foreground">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <About />
        <Work />
        <Writing />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
