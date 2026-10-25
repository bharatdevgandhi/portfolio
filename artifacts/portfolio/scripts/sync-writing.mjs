import Parser from "rss-parser";
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const output = new URL("../src/data/writing.json", import.meta.url);
const feeds = [
  { source: "substack", url: "https://bharatgandhi.substack.com/feed" },
  { source: "medium", url: "https://bg445.medium.com/feed" },
];

export function normalizeItems(items, source) {
  return items.flatMap((item) => {
    const title = item.title?.trim();
    const date = new Date(item.isoDate || item.pubDate || "");
    let url;
    try {
      url = new URL(item.link);
    } catch {
      return [];
    }
    if (!title || !Number.isFinite(date.getTime()) || url.protocol !== "https:") return [];
    const validHost = source === "substack"
      ? url.hostname === "bharatgandhi.substack.com"
      : url.hostname === "medium.com" || url.hostname.endsWith(".medium.com");
    if (!validHost) return [];
    url.search = "";
    url.hash = "";
    const excerpt = (item.contentSnippet || item.summary || "")
      .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return [{
      title, url: url.href, date: date.toISOString(),
      excerpt: excerpt.length > 200 ? `${excerpt.slice(0, 200)}…` : excerpt,
      source,
    }];
  });
}

export function mergeArticles(articles) {
  const seen = new Set();
  return [...articles]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .filter((article) => {
      const key = article.title.toLowerCase().replace(/\s+/g, " ").trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export async function syncWriting({ fetchFeed, previous } = {}) {
  const parser = new Parser();
  if (!previous) {
    try {
      previous = JSON.parse(await readFile(output, "utf8"));
    } catch {
      previous = { articles: [] };
    }
  }
  const fetchSource = fetchFeed || (async (url) => {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "BharatGandhiPortfolio/1.0", Accept: "application/rss+xml, application/xml" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parser.parseString(await response.text());
  });
  const results = await Promise.all(feeds.map(async ({ source, url }) => {
    try {
      const feed = await fetchSource(url);
      const articles = normalizeItems(feed.items || [], source);
      if (!articles.length) throw new Error("Feed contained no valid articles");
      console.info(`Writing: loaded ${articles.length} ${source} articles`);
      return articles;
    } catch (error) {
      const saved = previous.articles.filter((article) => article.source === source);
      console.warn(`Writing: ${source} refresh failed (${error.message}); keeping ${saved.length} saved articles`);
      return saved;
    }
  }));
  const articles = mergeArticles(results.flat());
  if (!articles.length) throw new Error("No writing available from feeds or saved data; refusing to publish an empty list");
  return { articles };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const data = await syncWriting();
  await mkdir(new URL("../src/data/", import.meta.url), { recursive: true });
  const temporary = `${fileURLToPath(output)}.tmp`;
  await writeFile(temporary, `${JSON.stringify(data, null, 2)}\n`);
  await rename(temporary, output);
  console.info(`Writing: saved ${data.articles.length} articles for the website`);
}
