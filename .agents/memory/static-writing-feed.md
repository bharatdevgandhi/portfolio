---
name: Writing feed snapshots
description: Why writing uses publish-time snapshots rather than browser proxies or a runtime API.
---

Keep Writing on publish-time snapshots. Use direct publisher fetches during builds and retain last-successful data on feed failures, even with server-hosted page rendering.

**Why:** The third-party RSS intermediary returned Cloudflare 403 challenge pages without browser CORS permission, while both publishers' direct RSS endpoints worked outside the browser. Server-hosted publishing was approved for workshop expiry, not continuous RSS polling.

**How to apply:** Do not restore a browser RSS proxy or silently rely on the development API in published frontend code. Explain that new articles require republishing. Continuous refresh without publishing requires a separate refresh-policy decision.
