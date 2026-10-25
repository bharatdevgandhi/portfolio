import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useWriting } from "@/hooks/use-writing";
import { trackEvent } from "@/lib/analytics";

const PAGE_SIZE = 4;

export function Writing() {
  const { data, isLoading, isError } = useWriting();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const articles = data?.articles || [];
  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <section id="writing" className="py-10 md:py-12 max-w-4xl mx-auto px-6 md:px-8 pt-[20px] pb-[20px]">
      <SectionHeading>Writing</SectionHeading>
      <div className="bg-white/50 border border-border rounded-none p-6 md:p-10 shadow-sm">
        {isLoading ? (
          <div className="flex flex-col gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex flex-col gap-3">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="font-mono text-sm text-destructive">Unable to load recent writing. Check Substack or Medium directly.</p>
        ) : articles.length > 0 ? (
          <>
            <div className="flex flex-col gap-8 md:gap-10">
              {visibleArticles.map((article, index) => (
                <motion.a
                  key={article.url}
                  href={article.url}
                  data-article
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (index % PAGE_SIZE) * 0.1 }}
                  className="group block"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                    <h3 className="text-xl md:text-2xl font-serif font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      {article.title}
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-accent" />
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground shrink-0 uppercase tracking-widest">
                      {new Date(article.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {article.excerpt && (
                    <p className="text-muted-foreground font-serif text-lg line-clamp-2 max-w-2xl">
                      {article.excerpt}
                    </p>
                  )}
                </motion.a>
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    trackEvent("writing_load_more", {
                      visible_before: visibleCount,
                      visible_after: Math.min(visibleCount + PAGE_SIZE, articles.length),
                      total_articles: articles.length,
                    });
                    setVisibleCount((c) => c + PAGE_SIZE);
                  }}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  Load more
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="font-mono text-sm text-muted-foreground">No recent articles found.</p>
        )}

        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-6">
          <a
            href="https://bharatgandhi.substack.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-accent transition-colors group"
          >
            View all on Substack
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://bg445.medium.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-accent transition-colors group"
          >
            Also on Medium
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
