import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAnalytics } from "@/hooks/use-analytics";
import { getSeoPages, socialImage } from "./seo";
import { useEffect, useState } from "react";

import Home from "./pages/home";
import NotFound from "./pages/not-found";
import V2Home from "./v2/V2Home";
import Agents from "./v2/Agents";
import Detail from "./v2/Detail";
import Meditation from "./v2/Meditation";
import { entryById } from "./v2/content";

export type Variant = "v1" | "v2";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router({ renderTime, variant }: { renderTime?: number; variant: Variant }) {
  return (
    <Switch>
      {/* The home is the gallery. The earlier home is served here only to
          visitors the server has placed in the comparison group. */}
      <Route path="/">{variant === "v1" ? <Home /> : <V2Home />}</Route>
      <Route path="/v1" component={Home} />
      <Route path="/work/:id">
        {(params) => {
          const entry = entryById(params.id);
          return entry && !entry.page ? <Detail entry={entry} /> : <NotFound />;
        }}
      </Route>
      <Route path="/meditation"><Meditation initialTime={renderTime} /></Route>
      <Route path="/agents" component={Agents} />
      <Route component={NotFound} />
    </Switch>
  );
}

/** Which home this visitor was given. The server writes it on <html>. */
function currentVariant(): Variant {
  if (typeof document === "undefined") return "v2";
  return document.documentElement.dataset.variant === "v1" ? "v1" : "v2";
}

function SeoManager() {
  const [location] = useLocation();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    if (location.replace(/\/$/, "") !== "/meditation") return;
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, [location]);

  useEffect(() => {
    const seoPages = getSeoPages(now);
    const page =
      seoPages.find((item) => item.path === location.replace(/\/$/, "") || item.path === location) ??
      seoPages[0];
    document.title = page.title;

    const setMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    setMeta('meta[name="description"]', "name", "description", page.description);
    setMeta('meta[property="og:title"]', "property", "og:title", page.title);
    setMeta('meta[property="og:description"]', "property", "og:description", page.description);
    setMeta('meta[property="og:type"]', "property", "og:type", page.ogType);
    setMeta('meta[property="og:url"]', "property", "og:url", page.canonical);
    const image = page.image ?? socialImage;
    setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", page.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", page.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    const robots = document.head.querySelector('meta[name="robots"]');
    if (page.noindex) setMeta('meta[name="robots"]', "name", "robots", "noindex, follow");
    else robots?.remove();

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = page.canonical;

    let schema = document.getElementById("page-structured-data") as HTMLScriptElement | null;
    if (!schema) {
      schema = document.createElement("script");
      schema.id = "page-structured-data";
      schema.type = "application/ld+json";
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": page.structuredData,
    });
  }, [location, now]);

  return null;
}

function App({ ssrPath, renderTime, variant }: { ssrPath?: string; renderTime?: number; variant?: Variant } = {}) {
  useAnalytics();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter
          base={import.meta.env.BASE_URL.replace(/\/$/, "")}
          ssrPath={ssrPath}
        >
          <Router renderTime={renderTime} variant={variant ?? currentVariant()} />
          <SeoManager />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
