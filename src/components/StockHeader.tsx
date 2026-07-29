import type { StockData } from "@/lib/stockData";

export default function StockHeader({ data }: { data: StockData }) {
  const isUp = data.change >= 0;
  return (
    <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="mono text-sm text-[var(--neon-soft)] border border-[var(--panel-border-strong)] rounded px-2 py-0.5">
            {data.code}
          </span>
          <span className="text-xs text-[var(--text-faint)]">
            {data.market} · {data.sector}
          </span>
        </div>
        <h1 className="font-bold text-2xl sm:text-3xl mt-2 tracking-tight">
          {data.name}
        </h1>
      </div>

      <div className="flex items-end gap-4">
        <span className="mono text-4xl sm:text-5xl font-bold neon-text">
          ¥{data.price.toLocaleString()}
        </span>
        <div
          className={`mono text-sm sm:text-base pb-1.5 ${
            isUp ? "text-up" : "text-down"
          }`}
        >
          <div>
            {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
            {data.change.toLocaleString()}
          </div>
          <div>
            ({isUp ? "+" : ""}
            {data.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
    </div>
  );
}
