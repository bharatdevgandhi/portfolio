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

const realNow = Date.now;
const before = Date.parse("2026-10-25T12:00:00Z");
Date.now = () => before;
const { upcomingMeditationWorkshops, getWorkshopStatus, meditationFaqs } =
  await vite.ssrLoadModule("/src/data/meditation.ts");
const { trackLinkClick } = await vite.ssrLoadModule("/src/lib/analytics.ts");
const { seoPages } = await vite.ssrLoadModule("/src/seo.ts");
const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
Date.now = realNow;
const workshop = upcomingMeditationWorkshops[0];

test("workshop uses confirmed IST dates, online format and official registration", () => {
  assert.equal(workshop.startDate, "2026-11-09T18:30:00+05:30");
  assert.equal(workshop.endDate, "2026-11-12T20:30:00+05:30");
  assert.equal(workshop.attendanceMode, "online");
  assert.equal(workshop.contribution, 3000);
  assert.deepEqual([...workshop.languages], ["English", "Hindi"]);
  const url = new URL(workshop.registrationUrl);
  assert.equal(url.hostname, "www.artofliving.online");
  assert.equal(url.searchParams.get("event_id"), "1067943");
});

test("workshop lifecycle switches at exact start and end boundaries", () => {
  const start = Date.parse(workshop.startDate);
  const end = Date.parse(workshop.endDate);
  assert.equal(getWorkshopStatus(workshop, start - 1), "upcoming");
  assert.equal(getWorkshopStatus(workshop, start), "in-progress");
  assert.equal(getWorkshopStatus(workshop, end - 1), "in-progress");
  assert.equal(getWorkshopStatus(workshop, end), "ended");
});

function renderAt(now) {
  Date.now = () => now;
  try {
    return renderToString(React.createElement(App, { ssrPath: "/meditation" }));
  } finally {
    Date.now = realNow;
  }
}

test("initial HTML includes the real workshop, sources and all participant answers", () => {
  const html = renderAt(before);
  assert.ok(html.includes("2026"));
  assert.ok(html.includes('data-meditation-action="registration"'));
  assert.ok(html.includes(`id="${workshop.id}"`));
  assert.ok(html.includes("www.artofliving.online/registration.php"));
  assert.ok(html.includes("jamanetwork.com"));
  assert.ok(html.includes("129"));
  assert.ok(html.includes("not a replacement for medical"));
  assert.ok(html.includes("not certification records"));
  assert.equal((html.match(/data-testid="faq-item-/g) || []).length, meditationFaqs.length);
});

test("expired event renders the empty state and no registration button", () => {
  const html = renderAt(Date.parse(workshop.endDate));
  assert.ok(html.includes("No upcoming workshops are listed right now."));
  assert.ok(!html.includes('data-meditation-action="registration"'));
  assert.ok(html.includes('data-meditation-action="enquiry"'));
});

test("event and FAQ structured data match visible content and virtual format", () => {
  const graph = seoPages.find((page) => page.path === "/meditation").structuredData;
  const event = graph.find((item) => item["@type"] === "Event");
  assert.equal(event.startDate, workshop.startDate);
  assert.equal(event.endDate, workshop.endDate);
  assert.equal(event.location["@type"], "VirtualLocation");
  assert.equal(event.offers.url, workshop.registrationUrl);
  assert.equal(event.eventSchedule.scheduleTimezone, "Asia/Kolkata");
  assert.equal(event.eventSchedule.startTime, "18:30:00");
  const faq = graph.find((item) => item["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.length, meditationFaqs.length);
  meditationFaqs.forEach(({ question, answer }, i) => {
    assert.equal(faq.mainEntity[i].name, question);
    assert.equal(faq.mainEntity[i].acceptedAnswer.text, answer);
  });
});

function link(attributes) {
  return {
    getAttribute: (name) => attributes[name] ?? null,
    closest: () => ({ id: "workshops" }),
  };
}

test("analytics separate registration intent from enquiry without queries or PII", () => {
  const events = [];
  globalThis.window = {
    location: { href: "https://example.com/meditation", origin: "https://example.com" },
    umami: { track: (name, data) => { events.push({ name, data }); } },
  };
  Date.now = () => before;
  try {
    trackLinkClick(link({
      href: workshop.registrationUrl,
      "data-meditation-action": "registration",
      "data-workshop-id": workshop.id,
    }));
    trackLinkClick(link({
      href: "mailto:private@example.com?subject=private",
      "data-meditation-action": "enquiry",
    }));
    assert.deepEqual(events.map((e) => e.name), [
      "workshop_registration_clicked", "meditation_enquiry_clicked",
    ]);
    assert.equal(events[0].data.workshop_id, workshop.id);
    const serialized = JSON.stringify(events);
    assert.ok(!serialized.includes("?"));
    assert.ok(!serialized.includes("private"));
    assert.ok(!serialized.includes("greferrer"));
    Date.now = () => Date.parse(workshop.endDate);
    trackLinkClick(link({
      href: workshop.registrationUrl,
      "data-meditation-action": "registration",
      "data-workshop-id": workshop.id,
    }));
    assert.equal(events.length, 2);
    window.umami = undefined;
    assert.doesNotThrow(() => trackLinkClick(link({ href: "mailto:any@example.com" })));
    window.umami = { track: () => { throw new Error("unavailable"); } };
    assert.doesNotThrow(() => trackLinkClick(link({ href: "mailto:any@example.com" })));
  } finally {
    delete globalThis.window;
    Date.now = realNow;
  }
});
