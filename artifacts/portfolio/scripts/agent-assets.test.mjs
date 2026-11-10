import assert from "node:assert/strict";
import test from "node:test";
import { stops, person, links } from "../src/v2/content.ts";
import {
  renderLlmsTxt,
  renderLlmsFullTxt,
  renderResumeMarkdown,
  renderProfileJson,
} from "../src/v2/agent-assets.ts";

const articles = [{
  title: "An essay", url: "https://bharatgandhi.substack.com/p/an-essay",
  date: "2026-04-14T00:00:00.000Z", excerpt: "About something.", source: "substack",
}];

test("llms.txt follows the llms.txt shape and carries the contact route", () => {
  const text = renderLlmsTxt(articles);
  assert.ok(text.startsWith(`# ${person.name}\n\n> `));
  for (const needle of [person.email, links.linkedin, "/llms-full.txt", "/profile.json", "Bharat_Gandhi_Resume.pdf"]) {
    assert.ok(text.includes(needle), `llms.txt is missing ${needle}`);
  }
});

test("every result on the site is in the full profile and the Markdown résumé", () => {
  const full = renderLlmsFullTxt(articles);
  const resume = renderResumeMarkdown();
  for (const stop of stops) {
    for (const metric of stop.metrics) {
      assert.ok(full.includes(`| ${stop.company} | ${metric.value} |`), `${stop.company}: ${metric.value}`);
    }
    for (const line of stop.shipped) {
      assert.ok(full.includes(line) && resume.includes(line), `${stop.company} bullet missing`);
    }
  }
});

test("profile.json is valid JSON Resume with one entry per role", () => {
  const profile = JSON.parse(renderProfileJson(articles));
  assert.equal(profile.basics.name, person.name);
  assert.equal(profile.work.length, stops.length);
  assert.equal(profile.work[0].endDate, undefined, "the current role has no end date");
  assert.ok(profile.work.every((role) => /^\d{4}-\d{2}$/.test(role.startDate)));
  assert.equal(profile.publications[0].url, articles[0].url);
});
