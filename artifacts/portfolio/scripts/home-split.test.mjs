import assert from "node:assert/strict";
import test from "node:test";
import { chooseHome, createPortfolioServer } from "../server/index.mjs";

test("the comparison is off unless a share is set", () => {
  assert.deepEqual(chooseHome({ share: 0, random: () => 0 }), { variant: "v2", remember: false });
  assert.deepEqual(chooseHome({ share: Number.NaN, random: () => 0 }), { variant: "v2", remember: false });
});

test("new visitors are split by the share and then keep their version", () => {
  assert.deepEqual(chooseHome({ share: 50, random: () => 0.49 }), { variant: "v1", remember: true });
  assert.deepEqual(chooseHome({ share: 50, random: () => 0.5 }), { variant: "v2", remember: true });
  assert.deepEqual(chooseHome({ share: 50, cookie: "a=1; bg_home=v1", random: () => 0.99 }), { variant: "v1", remember: false });
  assert.deepEqual(chooseHome({ share: 50, cookie: "bg_home=v2", random: () => 0 }), { variant: "v2", remember: false });
});

test("crawlers and assistants always get the current home", () => {
  for (const userAgent of ["Googlebot/2.1", "GPTBot/1.0", "ClaudeBot", "PerplexityBot", "LinkedInBot/1.0", "facebookexternalhit/1.1"]) {
    assert.equal(chooseHome({ share: 100, userAgent, random: () => 0 }).variant, "v2", userAgent);
  }
});

test("a version can be picked by hand with ?home=", () => {
  assert.deepEqual(chooseHome({ share: 0, query: "v1" }), { variant: "v1", remember: true });
  assert.deepEqual(chooseHome({ share: 100, query: "v2", random: () => 0 }), { variant: "v2", remember: true });
});

test("the server serves both homes at / and redirects the retired addresses", async () => {
  const server = await createPortfolioServer({ v1Share: 100, random: () => 0 });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = { "user-agent": "Mozilla/5.0 (Macintosh) Safari/605.1.15" };
  try {
    const earlier = await fetch(origin + "/", { headers: browser });
    const earlierHtml = await earlier.text();
    assert.match(earlier.headers.get("set-cookie") ?? "", /bg_home=v1/);
    assert.ok(earlierHtml.includes('data-variant="v1"'));
    assert.ok(earlierHtml.includes("/assets/main-"), "the earlier home loads the app");
    assert.ok(earlierHtml.includes('<link rel="canonical" href="https://www.bharatdevgandhi.com/"'));

    const kept = await fetch(origin + "/", { headers: { ...browser, cookie: "bg_home=v2" } });
    const current = await kept.text();
    assert.equal(kept.headers.get("set-cookie"), null);
    assert.ok(current.includes('data-variant="v2"'));
    assert.ok(!current.includes("/assets/main-"), "the portfolio does not load the app bundle");
    assert.ok(current.includes("v2-gallery"));

    const bot = await (await fetch(origin + "/", { headers: { "user-agent": "Googlebot/2.1" } })).text();
    assert.ok(bot.includes('data-variant="v2"'));

    for (const [from, to] of [["/audible", "/work/audible"], ["/rategain", "/work/rategain"], ["/cornell", "/work/plaza"], ["/fubo", "/work/fubo"], ["/v2", "/"], ["/v2/work/district", "/work/district"]]) {
      const response = await fetch(origin + from, { redirect: "manual" });
      assert.equal(response.status, 308, from);
      assert.equal(response.headers.get("location"), to);
    }
    const preview = await (await fetch(origin + "/v1", { headers: browser })).text();
    assert.ok(preview.includes('content="noindex, follow"'), "the earlier home is never indexed at /v1");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
