import { Router, type IRouter } from "express";

interface Article {
  title: string;
  url: string;
  date: string;
  excerpt?: string;
}

let cachedArticles: Article[] = [];
let lastFetch = 0;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").trim();
}

function parseItem(itemXml: string): Article | null {
  const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/s);
  const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
  const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
  const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/s);

  const title = titleMatch ? (titleMatch[1] || titleMatch[2] || "").trim() : null;
  const url = linkMatch ? linkMatch[1].trim() : null;

  if (!title || !url) return null;

  const date = pubDateMatch ? new Date(pubDateMatch[1].trim()).toISOString() : new Date().toISOString();

  let excerpt: string | undefined;
  if (descMatch) {
    const raw = descMatch[1] || descMatch[2] || "";
    excerpt = stripHtml(raw).substring(0, 200);
    if (stripHtml(raw).length > 200) excerpt += "...";
  }

  return { title, url, date, excerpt };
}

export async function fetchSubstackFeed(): Promise<void> {
  try {
    const res = await fetch("https://bharatgandhi.substack.com/feed");
    if (!res.ok) {
      console.error(`Substack RSS fetch failed: ${res.status}`);
      return;
    }
    const xml = await res.text();

    const items: Article[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const article = parseItem(match[1]);
      if (article) items.push(article);
    }

    cachedArticles = items;
    lastFetch = Date.now();
    console.log(`Fetched ${items.length} articles from Substack RSS`);
  } catch (err) {
    console.error("Error fetching Substack RSS:", err);
  }
}

const router: IRouter = Router();

router.get("/writing", async (_req, res) => {
  if (cachedArticles.length === 0 || Date.now() - lastFetch > 4 * 60 * 60 * 1000) {
    await fetchSubstackFeed();
  }
  res.json({ articles: cachedArticles });
});

export default router;
