import { ResumeLink } from "@/components/ResumeLink";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32 py-12 text-center">
      <div className="max-w-4xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          © {new Date().getFullYear()} Bharat Gandhi.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="https://x.com/bharaatobama" target="_blank" rel="noreferrer" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
            X (TWITTER)
          </a>
          <a href="https://linkedin.com/in/bdgandhi" target="_blank" rel="noreferrer" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
            LINKEDIN
          </a>
          <a href="https://bg445.medium.com/" target="_blank" rel="noreferrer" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
            MEDIUM
          </a>
          <ResumeLink location="footer" />
        </div>
      </div>
    </footer>
  );
}
