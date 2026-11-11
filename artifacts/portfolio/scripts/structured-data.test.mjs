import assert from "node:assert/strict";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";

const vite = await createServer({
  configFile: fileURLToPath(new URL("../vite.config.ts", import.meta.url)),
  logLevel: "error",
  server: { middlewareMode: true, hmr: false },
});
after(() => vite.close());

const { seoPages, siteOrigin, personId } = await vite.ssrLoadModule("/src/seo.ts");
const content = await vite.ssrLoadModule("/src/v2/content.ts");
const { default: Agents } = await vite.ssrLoadModule("/src/v2/Agents.tsx");

/** Every object in a JSON-LD value, depth first. */
function nodes(value, out = []) {
  if (Array.isArray(value)) value.forEach((item) => nodes(item, out));
  else if (value && typeof value === "object") {
    out.push(value);
    Object.values(value).forEach((item) => nodes(item, out));
  }
  return out;
}

const workCards = content.entries.filter((entry) => entry.group === "work" && !entry.page);

test("there are work cards to check", () => {
  assert.ok(workCards.length > 0);
});

for (const entry of workCards) {
  test(`/work/${entry.id} names its organisation, role and real period`, () => {
    const page = seoPages.find((item) => item.path === `/work/${entry.id}`);
    assert.ok(page, `no SEO page for /work/${entry.id}`);
    const all = nodes(page.structuredData);

    const role = all.find((node) => node["@type"] === "OrganizationRole");
    assert.ok(role, "no OrganizationRole");
    assert.equal(role.roleName, entry.role);
    assert.equal(role.startDate, entry.startDate);
    if (entry.endDate) assert.equal(role.endDate, entry.endDate);
    else assert.ok(!("endDate" in role), "a current role must not have an endDate");
    assert.deepEqual(role.member, { "@id": personId });

    const org = all.find((node) => node["@type"] === "Organization" && node.member === role);
    assert.ok(org, "the role is not attached to an Organization");
    assert.equal(org.name, content.orgs[entry.orgs[0]].name);

    const work = page.structuredData
      .find((node) => node["@type"] === "WebPage")
      .mainEntity;
    assert.equal(work.temporalCoverage, `${entry.startDate}/${entry.endDate ?? ".."}`);
  });
}

test("no page claims publication dates except the writing feed's real ones", () => {
  for (const page of seoPages) {
    for (const node of nodes(page.structuredData)) {
      assert.ok(!("dateModified" in node), `${page.path} has dateModified`);
      if ("datePublished" in node) {
        // Only the Substack/Medium article items carry a date, from the feed.
        assert.equal(node["@type"], "Article", `${page.path}: datePublished on a ${node["@type"]}`);
        assert.match(node.datePublished, /^\d{4}-\d{2}-\d{2}$/);
      }
    }
  }
});

test("every page keeps exactly one WebPage/ProfilePage for its canonical URL", () => {
  for (const page of seoPages) {
    const pageNodes = page.structuredData.filter((node) => ["WebPage", "ProfilePage"].includes(node["@type"]));
    assert.equal(pageNodes.length, 1, page.path);
    assert.equal(pageNodes[0]["@id"], `${page.canonical}#webpage`);
    assert.equal(pageNodes[0].url, page.canonical);
    assert.equal(pageNodes[0].name, page.title);
  }
  assert.equal(new Set(seoPages.map((page) => page.title)).size, seoPages.length);
  assert.equal(new Set(seoPages.map((page) => page.canonical)).size, seoPages.length);
});

/** The visible text of a rendered page, without React's text separators. */
function visibleText(html) {
  return html
    .replace(/<!-- -->/g, "")
    .replace(/<[^>]*>/g, "\n")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

test("/agents FAQPage matches the questions and answers on the page", () => {
  const page = seoPages.find((item) => item.path === "/agents");
  const faq = page.structuredData.find((node) => node["@type"] === "FAQPage");
  assert.ok(faq, "no FAQPage");
  assert.equal(faq["@id"], `${siteOrigin}/agents#questions`);
  assert.equal(faq.mainEntity.length, 3);
  assert.deepEqual(
    faq.mainEntity.map((question) => question.name),
    ["Is Bharat Gandhi an AI product manager?", "Can he work in the United States?", "How do I contact him?"],
  );
  assert.equal(faq.mainEntity[1].acceptedAnswer.text, content.workAuthorization.detail);

  const html = renderToString(React.createElement(Agents));
  const start = html.indexOf('id="questions"');
  const section = html.slice(start, html.lastIndexOf("<h2", html.indexOf('id="files"')));
  const lines = visibleText(section.slice(section.indexOf(">") + 1));
  // Heading, then question / answer pairs, in order.
  assert.deepEqual(
    lines,
    ["Questions and answers", ...faq.mainEntity.flatMap((q) => [q.name, q.acceptedAnswer.text])],
  );
});
