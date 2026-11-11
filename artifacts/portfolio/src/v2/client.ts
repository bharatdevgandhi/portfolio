// The only script the v2 pages load. They are complete without it; this adds
// analytics and one convenience, in a few hundred bytes instead of the app.
import "./v2.css";
import { trackEvent, trackLinkClick } from "@/lib/analytics";

function showRecruiters() {
  const option = document.getElementById("group-recruiters") as HTMLInputElement | null;
  if (!option) return;
  option.checked = true;
  document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function onClick(event: MouseEvent) {
  if (event.type === "auxclick" && event.button !== 1) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  const link = target.closest<HTMLAnchorElement>("a[href]");
  if (!link) return;
  if (link.hasAttribute("data-show-recruiters") && document.getElementById("group-recruiters")) {
    event.preventDefault();
    showRecruiters();
    return;
  }
  try {
    const resume = link.getAttribute("data-resume");
    if (resume) trackEvent("resume_download_clicked", { location: resume });
    else trackLinkClick(link);
  } catch {
    // Analytics must never get in the way of a click.
  }
}

document.addEventListener("click", onClick, true);
document.addEventListener("auxclick", onClick, true);
if (window.location.hash === "#recruiters") showRecruiters();
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#recruiters") showRecruiters();
});
