import { useEffect } from "react";
import { trackLinkClick } from "@/lib/analytics";

export function useAnalytics(): void {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      try {
        trackLinkClick(link);
      } catch {
        // A malformed link or analytics error must not affect the click.
      }
    };
    // Capture runs before mobile navigation closes or client routing unmounts.
    document.addEventListener("click", handleClick, true);
    document.addEventListener("auxclick", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("auxclick", handleClick, true);
    };
  }, []);
}
