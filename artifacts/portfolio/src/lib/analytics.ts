import { upcomingMeditationWorkshops, getWorkshopStatus } from "@/data/meditation";

type AnalyticsData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track(name: string, data?: AnalyticsData): void | Promise<unknown>;
    };
  }
}

export function trackEvent(name: string, data?: AnalyticsData): void {
  if (typeof window === "undefined") return;
  try {
    const result = window.umami?.track(name, data);
    if (result) void Promise.resolve(result).catch(() => {});
  } catch {
    // Analytics must never interrupt navigation or other app behavior.
  }
}

// Only public destination paths are included; never queries, email addresses,
// link text, or user-entered content.
export function trackLinkClick(link: HTMLAnchorElement): void {
  const rawHref = link.getAttribute("href");
  if (!rawHref) return;
  const location =
    link.closest("section[id]")?.id ||
    (link.closest("footer") ? "footer" : link.closest("nav, header") ? "navigation" : "hero");

  const meditationAction = link.getAttribute("data-meditation-action");
  if (meditationAction === "registration") {
    const workshop = upcomingMeditationWorkshops.find(
      (item) => item.id === link.getAttribute("data-workshop-id"),
    );
    if (workshop && getWorkshopStatus(workshop) !== "ended") {
      const target = new URL(rawHref, window.location.href);
      const official = new URL(workshop.registrationUrl);
      if (target.origin === official.origin && target.pathname === official.pathname) {
        trackEvent("workshop_registration_clicked", {
          workshop_id: workshop.id,
          location: "meditation-workshops",
          destination: target.hostname + target.pathname,
        });
      }
    }
    return;
  }
  if (meditationAction === "enquiry" && rawHref.startsWith("mailto:")) {
    trackEvent("meditation_enquiry_clicked", {
      method: "email",
      topic: "workshop",
      location: "meditation",
    });
    return;
  }

  if (rawHref.startsWith("mailto:")) {
    trackEvent("contact_clicked", { method: "email", location });
    return;
  }
  if (rawHref.startsWith("#")) {
    trackEvent("section_navigation", { section: rawHref.slice(1), location });
    return;
  }

  const url = new URL(rawHref, window.location.href);
  if (!["http:", "https:"].includes(url.protocol)) return;
  const destination = url.hostname + url.pathname;
  const internal = url.origin === window.location.origin;
  if (location === "projects" || location === "work") {
    trackEvent(location === "projects" ? "project_clicked" : "work_clicked", {
      destination, internal, location,
    });
  } else if (location === "writing" && link.hasAttribute("data-article")) {
    trackEvent("writing_article_clicked", { destination, platform: url.hostname });
  } else if (!internal) {
    const platforms: Record<string, string> = {
      "x.com": "x",
      "linkedin.com": "linkedin",
      "bharatgandhi.substack.com": "substack",
      "bg445.medium.com": "medium",
      "www.instagram.com": "instagram",
    };
    const platform = platforms[url.hostname];
    trackEvent(platform ? "social_link_clicked" : "external_link_clicked", {
      destination, location, ...(platform ? { platform } : {}),
    });
  }
}
