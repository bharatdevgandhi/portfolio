import assert from "node:assert/strict";
import test from "node:test";
import { identifyCrawler } from "../server/crawlers.mjs";
import { createPortfolioServer } from "../server/index.mjs";

test("crawlers are named by their most specific token", () => {
  const cases = [
    ["Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "Googlebot"],
    ["Google-Extended", "Google-Extended"],
    ["Mozilla/5.0 (compatible; Googlebot/2.1) Google-Extended", "Google-Extended"],
    ["Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)", "Bingbot"],
    ["Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot", "GPTBot"],
    ["Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot", "OAI-SearchBot"],
    ["Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot", "ChatGPT-User"],
    ["Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)", "ClaudeBot"],
    ["Mozilla/5.0 (compatible; Claude-User/1.0; +Claude-User@anthropic.com)", "Claude-User"],
    ["Mozilla/5.0 (compatible; Claude-SearchBot/1.0; +searchbot@anthropic.com)", "Claude-SearchBot"],
    ["Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)", "PerplexityBot"],
    ["Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)", "Perplexity-User"],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)", "Applebot"],
    ["Applebot-Extended/0.1", "Applebot-Extended"],
    ["Mozilla/5.0 (compatible; Applebot/0.1) Applebot-Extended", "Applebot-Extended"],
    ["Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot)", "Amazonbot"],
    ["meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)", "meta-externalagent"],
    ["meta-externalfetcher/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)", "meta-externalfetcher"],
    ["CCBot/2.0 (https://commoncrawl.org/faq/)", "CCBot"],
    ["Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; spider-feedback@bytedance.com)", "Bytespider"],
    ["DuckAssistBot/1.2; (+http://duckduckgo.com/duckassistbot.html)", "DuckAssistBot"],
    ["cohere-ai", "cohere-ai"],
    ["Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; MistralAI-User/1.0; +https://docs.mistral.ai/robots)", "MistralAI-User"],
    ["LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)", "LinkedInBot"],
  ];
  for (const [userAgent, name] of cases) assert.equal(identifyCrawler(userAgent), name, userAgent);
});

test("ordinary browsers and missing agents are not crawlers", () => {
  for (const userAgent of [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "curl/8.5.0",
    "",
    undefined,
    null,
  ]) {
    assert.equal(identifyCrawler(userAgent), null, String(userAgent));
  }
});

test("the server logs crawler visits by path only, and nothing for browsers", async () => {
  const lines = [];
  const server = await createPortfolioServer({ log: (line) => lines.push(line), now: () => Date.UTC(2026, 0, 2) });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const settle = () => new Promise((resolve) => setTimeout(resolve, 50));
  try {
    const browser = await fetch(origin + "/agents?utm_source=x", {
      headers: { "user-agent": "Mozilla/5.0 (Macintosh) Safari/605.1.15", cookie: "secret=1" },
    });
    assert.equal(browser.status, 200);
    await browser.text();
    await settle();
    assert.deepEqual(lines, [], "browsers are not logged");

    const bot = await fetch(origin + "/agents?utm_source=chatgpt.com", {
      headers: { "user-agent": "Mozilla/5.0; compatible; GPTBot/1.1; +https://openai.com/gptbot", cookie: "secret=1" },
    });
    assert.equal(bot.status, 200);
    await bot.text();
    await settle();
    assert.equal(lines.length, 1);
    assert.ok(!lines[0].includes("utm_source"), "no query string");
    assert.ok(!lines[0].includes("secret"), "no cookies");
    assert.ok(!lines[0].includes("openai.com"), "no full user agent");
    assert.deepEqual(JSON.parse(lines[0]), {
      event: "crawler_visit", crawler: "GPTBot", path: "/agents", status: 200, time: "2026-01-02T00:00:00.000Z",
    });

    lines.length = 0;
    const llms = await fetch(origin + "/llms.txt", { headers: { "user-agent": "ClaudeBot/1.0" } });
    await llms.text();
    await settle();
    assert.deepEqual(lines.map((line) => JSON.parse(line).path), ["/llms.txt"]);

    lines.length = 0;
    const asset = await fetch(origin + "/favicon.svg", { headers: { "user-agent": "GPTBot/1.1" } });
    await asset.text();
    const head = await fetch(origin + "/agents", { method: "HEAD", headers: { "user-agent": "GPTBot/1.1" } });
    await head.text();
    await settle();
    assert.deepEqual(lines, [], "other files and HEAD requests are not logged");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("a failing logger never changes the response", async () => {
  const server = await createPortfolioServer({ log: () => { throw new Error("log down"); } });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const response = await fetch(origin + "/agents", { headers: { "user-agent": "GPTBot/1.1" } });
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes("<html"));
    const again = await fetch(origin + "/robots.txt", { headers: { "user-agent": "GPTBot/1.1" } });
    assert.equal(again.status, 200);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
