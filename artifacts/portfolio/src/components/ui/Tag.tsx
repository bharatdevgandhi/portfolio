import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TagProps {
  children: ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-sm border border-border bg-background",
        "font-mono text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground",
        "transition-colors hover:border-primary/50 hover:text-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
