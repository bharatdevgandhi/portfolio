// Fails when a story in chapters.ts states a number the résumé never stated.
//
// The résumé bullets (`shipped`) and the headline results (`metrics`) in
// content.ts are the source of truth. Every number in a chapter body must
// appear there, after normalisation:
//
//   "20 million" == "20M+"      magnitude words and suffixes, "+" dropped
//   "more than 25" == "25+"     hedges ("more than", "about", "~") dropped
//   "three languages" == "3 languages"   number words become digits
//   "half the time" == "50%"    "half" is a percentage
//   "7 in every 100" == "7%"    rates out of 100 are percentages
//   "two quarters" == "2 quarters"       durations must match value AND unit
//
// Numbers keep a kind (percent, money, count, or duration:<unit>) and only
// match a fact of the same kind, so "8 countries" does not vouch for "8%".
// Calendar years (1900 to 2099) are ignored. "one", "a" and "single" are not
// read as numbers: they are almost always articles, not claims.
//
// Run: node --test scripts/facts.test.mjs

import assert from "node:assert/strict";
import test from "node:test";
import { entries } from "../src/v2/content.ts";
import { chapters } from "../src/v2/chapters.ts";

const WORDS = {
  two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40,
  fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
};
const MAGNITUDE = { thousand: 1e3, million: 1e6, billion: 1e9, k: 1e3, m: 1e6, b: 1e9 };
const DURATION = /^(year|month|week|day|quarter|hour)s?$/i;

const NUMBER = `(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d+)?|${Object.keys(WORDS).join("|")}`;
const HEDGE = "(?:more|fewer|less) than|about|roughly|nearly|around|over|under";
const NOT_UNITS = new Set(["and", "or", "to", "of", "in", "on", "at", "for", "with", "by", "do", "did", "is", "was", "were", "the", "a", "more", "less"]);
const CLAIM = new RegExp(
  "(?<![A-Za-z0-9_.])" +
    `(?:(?<hedge>${HEDGE})\\s+)?` +
    "(?<money>\\$)?" +
    `(?<num>${NUMBER})` +
    "(?:\\s*(?<magWord>thousand|million|billion)\\b|(?<magSuffix>[KMB])(?![A-Za-z]))?" +
    "\\+?" +
    "(?:(?<pct>\\s*%|\\s+percent\\b)|(?<per100>\\s+(?:in|out of)\\s+(?:every\\s+)?100\\b))?" +
    "(?![A-Za-z0-9])" +
    "(?:\\s+(?<unit>[A-Za-z]+))?" +
    "|(?<![A-Za-z])(?<half>half)\\b",
  "gi",
);

/**
 * Every numeric claim in a piece of text, normalised.
 * Returns [{ text, value, kind, key }], where key = `${kind}:${value}`.
 */
export function extractClaims(text) {
  const claims = [];
  for (const m of text.matchAll(CLAIM)) {
    const g = m.groups;
    if (g.half) {
      claims.push(claim(m[0], 50, "percent"));
      continue;
    }
    const raw = g.num.toLowerCase();
    let value = raw in WORDS ? WORDS[raw] : Number(raw.replace(/,/g, ""));
    const mag = (g.magWord || g.magSuffix || "").toLowerCase();
    if (mag) value *= MAGNITUDE[mag];
    let kind;
    if (g.money) kind = "money";
    else if (g.pct || g.per100) kind = "percent";
    else if (g.unit && DURATION.test(g.unit)) kind = `duration:${g.unit.toLowerCase().replace(/s$/, "")}`;
    else kind = "count";
    // Calendar years are dates, not claims.
    if (kind === "count" && !mag && /^\d{4}$/.test(raw) && value >= 1900 && value <= 2099) continue;
    // Quote the claim as written, with its hedge and unit, so a failure reads in plain words.
    let shown = m[0];
    if (g.unit && (kind === "money" || kind === "percent" || NOT_UNITS.has(g.unit.toLowerCase()))) {
      shown = shown.slice(0, shown.length - g.unit.length);
    }
    claims.push(claim(shown.trim(), value, kind));
  }
  return claims;
}

function claim(text, value, kind) {
  const v = Math.round(value * 1000) / 1000;
  return { text, value: v, kind, key: `${kind}:${v}` };
}

/** The set of normalised facts an entry's résumé text supports. */
export function factKeys(entry) {
  const texts = [...entry.shipped, ...entry.metrics.flatMap((m) => [m.value, m.label])];
  return new Set(texts.flatMap(extractClaims).map((c) => c.key));
}

/**
 * Chapter numbers the résumé does not state, as plain-language problems.
 * `allowed` is a list of { entry, heading, claim } that are known paraphrases.
 */
export function findDrift(entry, entryChapters, allowed = []) {
  const facts = factKeys(entry);
  const problems = [];
  for (const chapter of entryChapters) {
    for (const c of extractClaims(chapter.body)) {
      if (facts.has(c.key)) continue;
      const ok = allowed.some((a) => a.entry === entry.id && a.heading === chapter.heading && a.claim === c.text);
      if (ok) continue;
      problems.push(
        `Entry "${entry.id}", chapter "${chapter.heading}": the story says "${c.text}" ` +
          `(read as ${describe(c)}), but no résumé bullet or metric for this entry states that number.`,
      );
    }
  }
  return problems;
}

/** Headline results the résumé bullets do not back up. */
export function findUnsupportedMetrics(entry) {
  const facts = new Set(entry.shipped.flatMap(extractClaims).map((c) => c.key));
  const problems = [];
  for (const metric of entry.metrics) {
    for (const c of extractClaims(metric.value)) {
      if (facts.has(c.key)) continue;
      problems.push(
        `Entry "${entry.id}": the headline result "${metric.value} ${metric.label}" contains "${c.text}" ` +
          `(read as ${describe(c)}), but no résumé bullet for this entry states that number.`,
      );
    }
  }
  return problems;
}

function describe(c) {
  if (c.kind === "percent") return `${c.value}%`;
  if (c.kind === "money") return `$${c.value.toLocaleString("en-US")}`;
  if (c.kind.startsWith("duration:")) return `${c.value} ${c.kind.slice(9)}(s)`;
  return `the count ${c.value.toLocaleString("en-US")}`;
}

// Known, legitimate paraphrases. Each one is a number the story states in
// different words from the bullet that supports it. Add to this list only
// when the meaning is the same; a different number must stay failing.
const KNOWN_PARAPHRASES = [
  {
    // Bullet: "Null-result searches fell from 7% to 1.8%". 1.8 in 100 is fewer than 2.
    entry: "district",
    heading: "Search that understands the question",
    claim: "fewer than 2",
  },
  {
    // Bullet: "As an intern (Jan to Jun 2018) ...". January to June is six months.
    entry: "rategain",
    heading: "From intern to product manager",
    claim: "Six months",
  },
  {
    // Not in the bullets. Derived from the entry's own dates in content.ts,
    // "Aug 2021 to Dec 2024", which is three years and four months.
    entry: "audible",
    heading: "The job",
    claim: "over three years",
  },
];

const checked = entries.filter((e) => (chapters[e.id]?.length ?? 0) > 0 && e.shipped.length > 0);

test("the checker normalises the forms the stories use", () => {
  const keys = (s) => extractClaims(s).map((c) => c.key);
  assert.deepEqual(keys("more than 20 million listeners"), keys("20M+ listeners"));
  assert.deepEqual(keys("more than 25 SMB teams"), keys("25+ SMB teams"));
  assert.deepEqual(keys("three languages"), keys("3 languages"));
  assert.deepEqual(keys("in half the time"), keys("by 50%"));
  assert.deepEqual(keys("two quarters"), keys("2 quarters"));
  assert.deepEqual(keys("about $7M"), keys("~$7M"));
  assert.deepEqual(keys("25,000 users"), ["count:25000"]);
  assert.deepEqual(keys("7 in every 100 searches"), ["percent:7"]);
  assert.deepEqual(keys("I joined in April 2026 and graduated in 2021."), []);
  assert.notDeepEqual(keys("8 countries"), keys("8%"));
  assert.notDeepEqual(keys("three years"), keys("3 languages"));
});

test("self-test: a planted wrong number is caught", () => {
  const entry = {
    id: "planted",
    shipped: ["Ran the push-notifications charter, lifting day-0 opt-ins by 8% through growth experiments."],
    metrics: [{ value: "+8%", label: "day-0 push opt-ins" }],
  };
  const good = [{ heading: "Notifications", body: "A round of experiments got 8% more new users to opt in." }];
  const bad = [{ heading: "Notifications", body: "A round of experiments got 9% more new users to opt in." }];
  assert.deepEqual(findDrift(entry, good), []);
  const problems = findDrift(entry, bad);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /"planted".*"Notifications".*"9%"/);
  assert.deepEqual(findUnsupportedMetrics({ ...entry, metrics: [{ value: "+9%", label: "opt-ins" }] }).length, 1);
});

test("there are stories to check", () => {
  assert.ok(checked.length >= 4, `only ${checked.length} entries have both chapters and résumé bullets`);
});

for (const entry of checked) {
  test(`${entry.id}: every number in the story is on the résumé`, () => {
    const problems = findDrift(entry, chapters[entry.id], KNOWN_PARAPHRASES);
    assert.deepEqual(problems, [], "\n" + problems.join("\n"));
  });
}

for (const entry of entries.filter((e) => e.group === "work")) {
  test(`${entry.id}: every headline result is backed by a résumé bullet`, () => {
    const problems = findUnsupportedMetrics(entry);
    assert.deepEqual(problems, [], "\n" + problems.join("\n"));
  });
}

test("every known paraphrase is still needed", () => {
  for (const a of KNOWN_PARAPHRASES) {
    const entry = entries.find((e) => e.id === a.entry);
    assert.ok(entry, `allow-list names a missing entry "${a.entry}"`);
    const chapter = (chapters[a.entry] ?? []).find((c) => c.heading === a.heading);
    assert.ok(chapter, `allow-list names a missing chapter "${a.heading}" in "${a.entry}"`);
    const stillThere = findDrift(entry, [chapter]).some((p) => p.includes(`"${a.claim}"`));
    assert.ok(stillThere, `allow-list entry "${a.claim}" in "${a.entry}" / "${a.heading}" no longer matches anything; remove it`);
  }
});
