import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeItems, mergeArticles, syncWriting } from "./sync-writing.mjs";

const item = {
  title: "An article",
  link: "https://bharatgandhi.substack.com/p/an-article?utm_source=rss",
  isoDate: "2026-10-01T12:00:00Z",
  contentSnippet: "A short summary.",
};

test("normalizes dates, excerpts and public links", () => {
  const [article] = normalizeItems([item], "substack");
  assert.equal(article.url, "https://bharatgandhi.substack.com/p/an-article");
  assert.equal(article.date, "2026-10-01T12:00:00.000Z");
  assert.equal(article.source, "substack");
  assert.equal(article.excerpt, "A short summary.");
});

test("rejects unsafe URLs, unexpected domains and invalid dates", () => {
  assert.deepEqual(normalizeItems([
    { ...item, link: "javascript:alert(1)" },
    { ...item, link: "https://other.example/p/test" },
    { ...item, isoDate: "invalid" },
  ], "substack"), []);
});

test("sorts newest first and deduplicates cross-posts by title", () => {
  const [article] = normalizeItems([item], "substack");
  const latest = { ...article, title: "New article", date: "2026-10-20T00:00:00Z" };
  assert.deepEqual(mergeArticles([article, latest, { ...article, title: " AN ARTICLE " }]), [latest, article]);
});

test("preserves both sources' saved articles when feeds fail", async () => {
  const articles = [
    ...normalizeItems([item], "substack"),
    ...normalizeItems([{ ...item, title: "Medium article", link: "https://bg445.medium.com/article" }], "medium"),
  ];
  const result = await syncWriting({
    previous: { articles },
    fetchFeed: async () => { throw new Error("Unavailable"); },
  });
  assert.equal(result.articles.length, 2);
});

test("updates a healthy source while preserving the failed source", async () => {
  const previous = { articles: normalizeItems([item], "substack") };
  const result = await syncWriting({
    previous,
    fetchFeed: async (url) => {
      if (url.includes("substack")) throw new Error("Unavailable");
      return { items: [{ ...item, title: "Medium article", link: "https://bg445.medium.com/article" }] };
    },
  });
  assert.equal(result.articles.length, 2);
  assert(result.articles.some((article) => article.source === "medium"));
  assert(result.articles.some((article) => article.source === "substack"));
});

test("refuses to replace content with an entirely empty snapshot", async () => {
  await assert.rejects(syncWriting({
    previous: { articles: [] },
    fetchFeed: async () => ({ items: [] }),
  }), /No writing available/);
});
