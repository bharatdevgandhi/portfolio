---
name: Canonical host choice
description: Why public metadata uses www and the apex redirects there.
---

Keep `www.bharatdevgandhi.com` as the canonical host, with the bare host redirecting there while preserving the path and query.

**Why:** The verified, working publication was on `www`; the bare domain had no DNS address and could not complete TLS. Canonical metadata should not point visitors or crawlers at an unconnected host.

**How to apply:** Both domain variants must remain usable once domain ownership, DNS and TLS are configured. A server redirect does not replace those prerequisites. Keep Instagram entry paths and tracking parameters intact.
