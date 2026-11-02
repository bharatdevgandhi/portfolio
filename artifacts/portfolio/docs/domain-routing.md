# Public domain and Instagram links

## Canonical URL

Use `https://www.bharatdevgandhi.com` as the canonical origin. The meditation link is
`https://www.bharatdevgandhi.com/meditation`. Do not strip or special-case Instagram
tracking parameters; visitors must reach the same page after hydration and refresh.

The production Node server redirects the bare host to the canonical origin with a
308 response, preserving the path and query. It does not redirect preview hosts,
health checks or unrecognised forwarded hosts. Redirect destinations always use the
fixed canonical origin, never an arbitrary request Host.

## External prerequisites

An application redirect cannot run until the request reaches the application.
The bare domain must have working public DNS, be linked to this Replit publication,
and have a valid TLS certificate.

1. In Replit Publishing → Domains, link `bharatdevgandhi.com` in addition to `www`.
2. In GoDaddy DNS, add the A and TXT records **shown by Replit for that domain**.
   Do not guess an IP or copy verification records from a different domain.
3. Preserve the existing `www` records. Wait for Replit's domain/TLS verification.
4. Publish the server-hosted artifact configuration. The portfolio is registered
   in `.replit`; production build/run/health settings live in its `artifact.toml`.
   Do not restore the old forced Static deployment target: it bypasses the
   Node server's domain redirects and automatic workshop expiry. The root
   `deployment.publicDir` value is retained for the existing Static publishing
   form's validation; it does not select a deployment type. Choose Autoscale
   in Publishing to activate the server configuration.

At diagnosis on 2 November 2026, public DNS had no apex A/AAAA answers, while
the `www` meditation page returned HTTP 200. The missing DNS record must be fixed
at the domain provider, not in the React router. Do not claim the bare URL is
fixed merely because local Host-header tests pass.

## Verification

The build runs `scripts/server.test.mjs`, covering raw Host and forwarded-Host
redirects, Instagram parameters, direct meditation rendering, canonical metadata,
trailing-slash redirects, PDF downloads and workshop expiry.

After DNS verification and publishing, check the real URLs:

```sh
curl -I 'https://bharatdevgandhi.com/meditation?utm_source=instagram'
curl -IL 'https://bharatdevgandhi.com/meditation?utm_source=instagram'
curl -I 'https://www.bharatdevgandhi.com/meditation'
```

Expected: the bare URL redirects to the same path/query on `www`, ending in HTTP
200 with a valid certificate and no redirect loop. In a mobile Instagram browser,
opening and refreshing the URL must keep the meditation content visible.
