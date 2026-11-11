// The story of each gallery entry, in Bharat's voice.
//
// This is the copy people read on the detail cards. It is written fresh, in
// plain first person, and edited against the humanizer checklist
// (github.com/blader/humanizer): no dashes, no staged contrasts, no closers
// that repeat the point. Every number matches the résumé; the résumé bullets
// themselves stay in content.ts (`shipped`) for the machine-readable files.
//
// To add a chapter, add an object. To add an entry, see "Adding things" in
// content.ts.

import { extraChapters } from "./cards.generated.ts";

export type Chapter = { heading: string; body: string };

export const chapters: Record<string, Chapter[]> = {
  ...extraChapters,
  district: [
    {
      heading: "What I own",
      body: "District is Zomato's app for going out: dining, movies and live events. I joined in April 2026 as the platform product manager, which here means search, discovery, personalization, notifications and the AI products that run across all of them. I report to the CEO.",
    },
    {
      heading: "Search that understands the question",
      body: "The first thing I shipped was a rebuilt search. We upgraded keyword retrieval and put a model in front of it to work out what someone means when they type something loose, like a mood or an occasion. Before the launch, 7 in every 100 searches came back empty. Now fewer than 2 do. Search click-through is up 5% and daily GMV is up 2%.",
    },
    {
      heading: "Prototypes before roadmaps",
      body: "I build the first version of most ideas myself with AI-assisted coding. A working prototype tells me whether the model is good enough, how slow it feels and what the screen should do, before engineering spends a sprint on it. The voice navigation agent started that way, and so did one-tap movie translation into Indian languages.",
    },
    {
      heading: "The rest of the app",
      body: "The homepage now changes with the person looking at it, which lifted inventory views by 30%. I also run notifications, where a round of growth experiments got 8% more new users to opt in on their first day. Curations, maps and outing planning are the newest surfaces.",
    },
  ],
  canvasx: [
    {
      heading: "Advisory, but hands-on",
      body: "CanvasX AI is an applied-AI lab that builds agentic workflow products for small and mid-sized businesses. I advised as head of product and growth from January 2025 to April 2026, with customers in India, the US and Europe. Most weeks that meant sitting with a customer's team, learning how their work got done, and turning it into an agent that could run in production.",
    },
    {
      heading: "Sketch",
      body: "Sketch is the lab's main product, a workspace where a team and its agents work on the same tasks. I designed how it is packaged, priced and deployed. Customers buy credits and spend them as agents run, or bring their own model keys when they would rather manage inference cost, latency and quality themselves. More than 25 SMB teams in India use it.",
    },
    {
      heading: "Selling it and deploying it",
      body: "There was no sales pipeline when I started, so I built one. It came to include our first Fortune 100 prospect and SMB opportunities in India, Dubai and the EU. I also led the rollout of a data-analysis agent for an omnichannel retailer with 25,000 users. Within 60 days of launch, incentive-achievement rates were up 8%.",
    },
  ],
  audible: [
    {
      heading: "The job",
      body: "I spent a little over three years at Audible in New York as a technical product manager for Originals, the audiobooks and podcasts Audible makes itself. My products were the systems behind that content: the ones that help decide what to commission, get it produced and published, and pay the people who made it.",
    },
    {
      heading: "Knowing who listens to what",
      body: "We used ML to group more than 20 million listeners across 11 countries into 36 taste categories. Content teams began using the segments to judge pitches, and over two years they became the standard way to evaluate more than $100M of first-party production spend.",
    },
    {
      heading: "Getting titles out faster",
      body: "Production, deals and publishing each kept their own records, so I built one source of truth for all three. Audiobooks reached the market in half the time and podcasts 70% faster, across 12 markets. When Audible Brazil needed an operations suite for a $12M content-acquisition program, we took it from idea to deployment in two weeks on the same platform. I also took LLM text-to-speech from a research prototype to a production pipeline, which cut localization timelines by 36% across three languages and opened the catalog to more than eight countries.",
    },
    {
      heading: "Two new lines",
      body: "Only 70% of creator and publisher payments were going out on time and free of errors. A payments API raised that to 93% across 12 markets in two quarters. Separately, I set up a way for TV producers around the world to find and acquire rights to Audible's own stories. That business has generated about $7M in GMV.",
    },
  ],
  rategain: [
    {
      heading: "From intern to product manager",
      body: "RateGain sells travel-pricing intelligence to businesses. I joined as an intern in January 2018 and built an airline-pricing product from scratch that gave customers roughly a 10% revenue uplift. Six months later I was hired as a product manager.",
    },
    {
      heading: "550 bots",
      body: "The product depends on collecting prices from across the web, and I owned that infrastructure: more than 550 scraping bots. I built an ML framework called DataSURE that raised the share of successful scrapes from 94% to 98%, and NPS rose 25 points within two quarters.",
    },
    {
      heading: "What customers asked for",
      body: "Most of the roadmap came out of customer conversations. One-click on-demand scraping, Airbnb pricing data and a preview of pricing differences all started there, and together they contributed to a 40% rise in revenue over three quarters. Scraping by location came next and won customers in the US, EMEA and APAC.",
    },
  ],
  "cornell-tech": [
    {
      heading: "Roosevelt Island",
      body: "Cornell Tech was one of the best learning experiences of my life. I did the Jacobs Technion-Cornell dual master's in Information Systems and graduated in 2021. When COVID emptied most campuses, I was able to stay on the island and keep working alongside other grad students.",
    },
    {
      heading: "What I made there",
      body: "I built something in every class. The largest was Plaza, a startup that did not survive. I also worked on a research project with FuboTV about live TV news. And I made as many friends as I could. Those friendships are now the base of my professional network.",
    },
  ],
  plaza: [
    {
      heading: "The idea",
      body: "Plaza (plaza.app) was a Chrome extension that put a comment section on every page of the internet. Open it on an article, a product page or a video and you could read what other people had said, reply, and vote comments up or down, without leaving the page.",
    },
    {
      heading: "Why it did not work",
      body: "We built it at Cornell Tech during the pandemic and spent months on the product. I worked on go-to-market and on product design. It was an elegant answer to a problem that people were not willing to pay enough to solve, and we had treated distribution as something to figure out later.",
    },
    {
      heading: "What I took from it",
      body: "I now test whether anyone will pay before I build, and I plan distribution alongside the product. The company ended, but the people I built it with are still a large part of my network.",
    },
  ],
  fubo: [
    {
      heading: "The brief",
      body: "FuboTV wanted to know why younger viewers were not watching live news, and asked a Cornell Tech team to find out. I worked on the research and the product design.",
    },
    {
      heading: "What we saw",
      body: "We spent several weeks watching people watch TV across New York City, in living rooms, on commuter trains and in office break rooms. News had already moved to phones and social feeds. People did not trust any single source and had no way to compare coverage as it happened. One participant in her thirties told us she only watched because her husband had it on, and that the news felt like something that happened to her.",
    },
    {
      heading: "What we designed",
      body: "We designed a live news experience with several sources side by side. A viewer could switch between channels covering the same story and scrub back along a timeline to the moment it broke. We cut about half the features after the first round of testing, including a social sentiment overlay that distracted more than it informed. In later sessions, participants described it as choosing to watch.",
    },
  ],
  manipal: [
    {
      heading: "Computer science, on paper",
      body: "I studied computer science engineering at Manipal University Jaipur and graduated in 2017. I learned the basics there, but most of my time went into understanding media.",
    },
    {
      heading: "Outside class",
      body: "I founded a filmmaking society and went on to lead several student bodies. That is what let me put together MUJ Oneiros, which became Rajasthan's biggest student-run cultural festival by footfall.",
    },
  ],
  oneiros: [
    {
      heading: "The festival",
      body: "Oneiros is the cultural festival at Manipal University Jaipur. I architected the edition that became Rajasthan's biggest student-run cultural festival by footfall, and we got there in a single iteration.",
    },
    {
      heading: "How it ran",
      body: "The festival sat on top of something that ran all year: about 300 students producing live events every week. That weekly practice is what the festival was built on.",
    },
  ],
  meditation: [
    {
      heading: "Teaching",
      body: "I am a breathwork and meditation instructor with 1,000 hours of training. I teach SKY Campus Happiness in the US, and YES!+ and the Happiness Program of Art of Living in India.",
    },
    {
      heading: "Who it is for",
      body: "Most of the people I teach are between 18 and 35. The sessions are guided and meant to be easy to follow. Workshop dates, when there are any, are on the teaching page.",
    },
  ],
};
