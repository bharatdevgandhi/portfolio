import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAnalytics } from "@/hooks/use-analytics";
import { getSeoPages, socialImage } from "./seo";
import { useEffect, useState } from "react";

import Home from "./pages/home";
import CornellStory from "./pages/cornell";
import AudibleStory from "./pages/audible";
import RateGainStory from "./pages/rategain";
import FuboStory from "./pages/fubo";
import Meditation from "./pages/meditation";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router({ renderTime }: { renderTime?: number }) {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cornell" component={CornellStory} />
      <Route path="/audible" component={AudibleStory} />
      <Route path="/rategain" component={RateGainStory} />
      <Route path="/fubo" component={FuboStory} />
      <Route path="/meditation"><Meditation initialTime={renderTime} /></Route>
      <Route component={NotFound} />
    </Switch>
  );
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
    setMeta('meta[property="og:image"]', "property", "og:image", socialImage);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", page.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", page.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", socialImage);

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

function App({ ssrPath, renderTime }: { ssrPath?: string; renderTime?: number } = {}) {
  useAnalytics();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter
          base={import.meta.env.BASE_URL.replace(/\/$/, "")}
          ssrPath={ssrPath}
        >
          <Router renderTime={renderTime} />
          <SeoManager />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
