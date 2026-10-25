import resumeUrl from "@assets/Bharat_Gandhi_Resume_sep26_1792770271972.pdf?url";
import { trackEvent } from "@/lib/analytics";

export function ResumeLink({ location }: { location: "hero" | "footer" }) {
  return (
    <a
      href={resumeUrl}
      download="Bharat_Gandhi_Resume.pdf"
      onClick={() => trackEvent("resume_download_clicked", { location })}
      className="font-mono text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors link-underline"
    >
      Download resume (PDF)
    </a>
  );
}
