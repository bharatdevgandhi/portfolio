import { SectionHeading } from "@/components/ui/SectionHeading";
import aboutPhoto from "@assets/IMG_4782_optimized.jpeg";
import { Link } from "wouter";

export function About() {
  return (
    <section id="about" className="py-10 md:py-12 max-w-4xl mx-auto px-6 md:px-8 pt-[20px] pb-[20px]">
      <SectionHeading>About</SectionHeading>
      <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
        <div className="w-full md:w-2/5 flex-shrink-0">
          <img
            src={aboutPhoto}
            alt="Bharat Gandhi"
            width={800}
            height={1067}
            loading="lazy"
            className="w-full h-auto rounded-sm"
            style={{
              filter: "saturate(0.8) sepia(0.08) brightness(1.02)",
            }}
          />
        </div>

        <div className="prose prose-lg md:prose-xl font-serif text-foreground/90 leading-relaxed max-w-none flex-1">
          <p className="text-[18px]">
            I enjoy growing and building things from the ground up. At District by Zomato,
            I own app-wide search, discovery, personalization, notifications and AI-native
            products, reporting directly to the CEO. My work spans contextual search,
            voice-driven agents and new ways to discover going-out experiences.
          </p>
          <p className="text-[18px]">
            Previously, I led product and growth in an advisory role at CanvasX AI,
            taking agentic workflow products from prototypes to production and helping bring{" "}
            <a
              href="https://getsketch.ai"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 decoration-primary/30"
            >
              getsketch.ai
            </a>{" "}
            to 25+ SMB teams in India. At Audible/Amazon, I built content intelligence,
            production and monetization platforms across global marketplaces. At RateGain,
            I built travel-pricing data products and ML-powered scraping infrastructure.
            I also do speaking engagements on AI and product building. If you are a startup struggling with growth, GTM and product craft, I would love to help you. I also teach{" "}
            <Link
              href="/meditation"
              data-testid="link-about-meditation"
              className="text-primary underline underline-offset-4 decoration-primary/30 transition-colors hover:text-primary/80"
            >
              meditation
            </Link>{" "}
            and write.
          </p>
        </div>
      </div>
    </section>
  );
}
