import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useWriting } from "@/hooks/use-writing";

export function Writing() {
  const { data, isLoading, isError } = useWriting();

  return (
    <section id="writing" className="py-24 max-w-4xl mx-auto px-6 md:px-8">
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
          <p className="font-mono text-sm text-destructive">Unable to load recent writing. Check Substack directly.</p>
        ) : data?.articles && data.articles.length > 0 ? (
          <div className="flex flex-col gap-8 md:gap-10">
            {data.articles.slice(0, 4).map((article, index) => (
              <motion.a
                key={index}
                href={article.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
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
        ) : (
          <p className="font-mono text-sm text-muted-foreground">No recent articles found.</p>
        )}

        <div className="mt-12 pt-8 border-t border-border">
          <a
            href="https://bharatgandhi.substack.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-accent transition-colors group"
          >
            View all on Substack
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
