import assert from "node:assert/strict";
import { test } from "node:test";
import { createPortfolioServer } from "../server/index.mjs";

test("production HTTP server removes expired content and schema without a rebuild", async () => {
  let now = Date.parse("2026-11-09T12:59:59Z");
  const server = await createPortfolioServer({ now: () => now });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const request = async (pathname, init) => {
    const response = await fetch(origin + pathname, init);
    return { response, text: await response.text() };
  };
  const graph = (html) => JSON.parse(html.match(
    /<script id="page-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )[1])["@graph"];
  try {
    let result = await request("/meditation");
    assert.equal(result.response.status, 200);
    assert.equal(result.response.headers.get("cache-control"), "no-store");
    assert.ok(result.text.includes('data-meditation-action="registration"'));
    assert.ok(result.text.includes("Upcoming · online"));
    assert.ok(graph(result.text).some((item) => item["@type"] === "Event"));
    assert.ok(result.text.includes(`data-rendered-at="${now}"`));

    now = Date.parse("2026-11-09T13:00:00Z"); // 18:30 IST, exact start.
    result = await request("/meditation");
    assert.ok(result.text.includes("In progress · check availability"));

    now = Date.parse("2026-11-12T15:00:00Z"); // 20:30 IST, exact end.
    result = await request("/meditation");
    assert.ok(result.text.includes("No upcoming workshops are listed right now."));
    assert.ok(!result.text.includes('data-meditation-action="registration"'));
    assert.ok(!graph(result.text).some((item) => item["@type"] === "Event"));
    const webPage = graph(result.text).find((item) => item["@type"] === "WebPage");
    assert.ok(!webPage.hasPart.some((item) => item["@id"].includes("aol-1067943")));

    const crawler = await request("/meditation", { headers: { "user-agent": "Googlebot" } });
    assert.equal(crawler.text, result.text);
    const head = await request("/meditation", { method: "HEAD" });
    assert.equal(head.response.status, 200);
    assert.equal(head.text, "");
    for (const path of ["/meditation/", "/meditation/index.html"]) {
      const alias = await request(path, { redirect: "manual" });
      assert.equal(alias.response.status, 308);
      assert.equal(alias.response.headers.get("location"), "/meditation");
    }
    for (const route of ["/", "/cornell", "/audible", "/rategain", "/fubo"]) {
      const page = await request(route);
      assert.equal(page.response.status, 200);
      assert.ok(page.text.includes('<link rel="canonical"'));
    }
    const sitemap = await request("/sitemap.xml");
    assert.equal(sitemap.response.status, 200);
    assert.ok(sitemap.text.includes("/meditation</loc>"));
    assert.equal((await request("/robots.txt")).response.status, 200);
    const image = await fetch(origin + "/opengraph.jpg");
    assert.equal(image.status, 200);
    assert.equal(image.headers.get("content-type"), "image/jpeg");
    assert.equal((await request("/healthz")).response.status, 200);
    assert.equal((await request("/not-a-page")).response.status, 404);
    assert.equal((await request("/assets/missing.js")).response.status, 404);
    assert.equal((await request("/%ZZ")).response.status, 400);
    assert.equal((await request("/%2e%2e%2fpackage.json")).response.status, 403);
    assert.equal((await request("/meditation", { method: "POST" })).response.status, 405);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
