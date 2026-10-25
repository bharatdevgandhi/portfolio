# Meditation campaign: sources and measurement

## Content provenance
- Official event listing: https://www.artofliving.org/in-en/program/1067943
- Official registration: follow the event's Register link. It identifies event 1067943, names Bharat, and displays 9–12 November 2026, weekday 6:30–8:30 PM, English/Hindi and ₹3,000.
- Bharat confirmed the year as 2026 and timezone as IST (Asia/Kolkata). The workshop is online; Gurugram on the listing is not an in-person venue.
- The registration page advertises daily-practice and weekly-session follow-up. Direct participants to the organiser for current terms; do not promise independently run support.
- Bharat's 1,000-hour training, teaching locations and teaching focus are his supplied account, not independently certified by the programme links. No testimonial, certificate, university endorsement or photograph should be added without appropriate evidence and publishing permission.
- Research: https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2814344 . A randomized trial of 129 practising physicians compared a SKY programme with stress management education, with ongoing practice and eight-week follow-up. Do not generalize its self-reported outcomes to all workshops or young adults, claim superiority to every alternative, or describe this as medical treatment.

Sources checked during this work on 25 October 2026. Recheck price, availability and instructions before each promotion.

## What analytics actually measures

Enable analytics in Publishing settings and publish/republish. No tracker keys or scripts are added by app code.

| Event | Meaning | Dimensions |
| --- | --- | --- |
| `workshop_registration_clicked` | Visitor follows the official registration link for an unexpired workshop | Known workshop ID, fixed location, destination hostname/path only |
| `meditation_enquiry_clicked` | Visitor opens the email enquiry link | Method, fixed workshop topic, fixed location |

These are **intent clicks**, not submitted emails, qualified leads, payments or completed registrations. Queries, addresses, subjects, free-form text and health information are not sent. No extra generic link event is emitted for these same actions.

Use pageviews for `/meditation` alongside these events to assess interest. Treat ratios as directional engagement, not a confirmed registration conversion rate.

### Qualified enquiries and registrations
- Maintain a private, access-controlled operational record of actual inbound enquiries and whether each is a relevant workshop enquiry. Do not infer qualification from opening email and do not put personal or health details in analytics or this repository.
- Reconcile completed registrations with an authorised report from the official organiser. This site cannot see payment or registration completion on their separate domain. Any future integration needs permission and a documented matching/attribution method.
- Separate workshop totals, website-attributed registrations (only when proven), clicks and enquiries. Do not attribute every organiser registration to this page.

### AI citations
Keep a dated, manual comparison log of a small consistent set of relevant prompts, answer engine, page cited and citation URL. Results vary by query, time and personalisation; this is observation, not proof that the site caused a recommendation. Do not create synthetic traffic or automated answer-engine requests as a proxy for real participants.

## Expiry and server-hosted publishing
After publishing the approved server-hosted configuration, every page request renders using the server's current time. At the final session's end time, the workshop card, registration button and Event structured data are omitted from `/meditation`, including for non-JavaScript crawlers. HTML is returned with `Cache-Control: no-store` to avoid serving an older event state. Direct saved-HTML aliases redirect to the current page rather than exposing stale build snapshots.

The browser also refreshes workshop status on mount and every minute for an already open page. Registration click events reject ended workshops. The end boundary is 12 November 2026 at 20:30 IST (15:00 UTC).

No rebuild is needed for a scheduled date to pass. New dates, cancellations, changed fees and other source-data changes still require editing and publishing; this is not live organiser inventory or an availability guarantee. Writing feeds also retain their existing publish-time refresh model.

Run `pnpm --filter @workspace/portfolio run build` to build the browser and server bundles and run crawler/HTTP checks. The production process is `node artifacts/portfolio/server/index.mjs`, listening on the configured `PORT`; `/healthz` is its startup probe. No production Vite server is used.

## Publishing check
During this task the published custom domain returned 404 for `/meditation` and its sitemap omitted the route, despite those features being present in the workspace. This is a publishing mismatch, not permission to publish automatically. After publishing, confirm the raw meditation HTML, canonical, official registration link and sitemap entry on the real domain.
