import type { NewsItem } from "@/lib/stockData";

const SENTIMENT_DOT: Record<NewsItem["sentiment"], string> = {
  positive: "bg-[var(--up)]",
  neutral: "bg-[#f6d365]",
  negative: "bg-[var(--down)]",
};

export default function NewsList({ news }: { news: NewsItem[] }) {
  return (
    <div className="glass-panel p-5">
      <h3 className="panel-heading mb-4">関連ニュース</h3>
      <div className="flex flex-col divide-y divide-[var(--panel-border)]">
        {news.map((n, i) => (
          <div key={i} className="py-3 flex items-start gap-3">
            <span
              className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                SENTIMENT_DOT[n.sentiment]
              }`}
            />
            <div className="min-w-0">
              <p className="text-sm text-[var(--text)] leading-snug">
                {n.title}
              </p>
              <p className="text-[0.68rem] text-[var(--text-faint)] mt-1">
                {n.source} · <span className="mono">{n.time}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
