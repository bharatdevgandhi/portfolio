import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parseCard } from "./build-cards.mjs";

const template = await readFile(new URL("../content/cards/_template.md", import.meta.url), "utf8");

test("the template itself is a valid card", () => {
  const { entry, chapters } = parseCard("my-project", template);
  assert.equal(entry.title, "Name of the thing");
  assert.equal(entry.group, "project");
  assert.deepEqual(entry.tags, ["AI", "Consumer", "0 to 1"]);
  assert.deepEqual(entry.metrics[0], { value: "25%", label: "faster checkout" });
  assert.equal(entry.cover.kind, "picture");
  assert.equal(entry.cover.ratio, "1200 / 1500");
  assert.deepEqual(entry.external, { href: "https://example.com", label: "See it live" });
  assert.equal(chapters.length, 2);
  assert.ok(chapters[0].body.startsWith("Write the story here"));
});

test("a card with only a title still works, and shows its name in type", () => {
  const { entry, chapters } = parseCard("bare", "---\ntitle: Bare\n---\n");
  assert.equal(entry.cover.kind, "type");
  assert.equal(entry.cover.line, "Bare");
  assert.deepEqual(chapters, []);
});

test("mistakes are reported in plain words", () => {
  assert.throws(() => parseCard("x", "title: no header"), /must start with a header/);
  assert.throws(() => parseCard("x", "---\nintro: nothing\n---\n"), /needs a title/);
  assert.throws(() => parseCard("x", "---\ntitle: T\ngroup: misc\n---\n"), /group must be one of/);
  assert.throws(() => parseCard("x", "---\ntitle: T\nresults:\n  - just a number\n---\n"), /one thing \| the other/);
});
