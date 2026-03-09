import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";

interface TimelineItem {
  title: string;
  text: string;
}

interface LoveTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const LoveTimeline = ({ items, className }: LoveTimelineProps) => {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-6 py-20", className)}>
      <div className="mb-10 flex items-center gap-3 text-[var(--brand)]">
        <Heart className="h-5 w-5 fill-current" />
        <p className="text-xs font-semibold uppercase tracking-[0.24em] sm:text-sm">
          Unsere Geschichte
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-rose-100/80 bg-white/80 p-6 shadow-sm shadow-rose-100/70 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold text-stone-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
