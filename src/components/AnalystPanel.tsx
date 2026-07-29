import type { StockData } from "@/lib/stockData";

function yen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

function ratingBadgeClass(rating: string): string {
  if (rating === "買い") return "badge-buy";
  if (rating === "売り") return "badge-sell";
  return "badge-hold";
}

export default function AnalystPanel({
  analysts,
  price,
}: {
  analysts: StockData["analysts"];
  price: number;
}) {
  const { buy, hold, sell, targetAvg, targetHigh, targetLow, firms } = analysts;
  const total = buy + hold + sell || 1;
  const buyPct = (buy / total) * 100;
  const holdPct = (hold / total) * 100;
  const sellPct = (sell / total) * 100;

  const rangeMin = Math.min(targetLow, price) * 0.97;
  const rangeMax = Math.max(targetHigh, price) * 1.03;
  const span = rangeMax - rangeMin || 1;
  const pricePct = ((price - rangeMin) / span) * 100;
  const lowPct = ((targetLow - rangeMin) / span) * 100;
  const avgPct = ((targetAvg - rangeMin) / span) * 100;
  const highPct = ((targetHigh - rangeMin) / span) * 100;

  const upside = ((targetAvg - price) / price) * 100;

  return (
    <div className="glass-panel p-5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="panel-heading">アナリスト評価</h3>
        <span className="mono text-[0.65rem] text-[var(--text-faint)]">
          {firms.length}社集計
        </span>
      </div>

      {/* 買い/中立/売り 分布 */}
      <div>
        <div className="flex h-2.5 w-full overflow-hidden rounded-full border border-[var(--panel-border)]">
          <div style={{ width: `${buyPct}%` }} className="bg-[var(--up)]" />
          <div style={{ width: `${holdPct}%` }} className="bg-[#f6d365]" />
          <div style={{ width: `${sellPct}%` }} className="bg-[var(--down)]" />
        </div>
        <div className="mt-2.5 flex justify-between mono text-xs">
          <span className="text-up">買い {buy}</span>
          <span className="text-[#f6d365]">中立 {hold}</span>
          <span className="text-down">売り {sell}</span>
        </div>
      </div>

      {/* 目標株価レンジ */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-sm text-[var(--text-dim)]">目標株価コンセンサス</span>
          <span className="mono text-lg neon-text font-bold">{yen(targetAvg)}</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] mt-6 mb-6">
          <div
            className="absolute h-1.5 rounded-full bg-[rgba(57,255,148,0.35)]"
            style={{ left: `${lowPct}%`, width: `${Math.max(highPct - lowPct, 0)}%` }}
          />
          <div
            className="absolute -top-1 h-3.5 w-[2px] bg-[var(--neon)]"
            style={{ left: `${avgPct}%` }}
          />
          <div
            className="absolute -top-6 -translate-x-1/2 mono text-[0.65rem] text-[var(--text-faint)] whitespace-nowrap"
            style={{ left: `${Math.min(Math.max(pricePct, 6), 94)}%` }}
          >
            現在値 {yen(price)}
          </div>
          <div
            className="absolute -top-1.5 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-[var(--cyan)] bg-[#0a120e]"
            style={{ left: `${Math.min(Math.max(pricePct, 0), 100)}%` }}
          />
          <div className="absolute top-3 left-0 mono text-[0.65rem] text-[var(--text-faint)]">
            安値 {yen(targetLow)}
          </div>
          <div className="absolute top-3 right-0 mono text-[0.65rem] text-[var(--text-faint)]">
            高値 {yen(targetHigh)}
          </div>
        </div>
        <p className="mono text-xs text-[var(--text-dim)]">
          現在値からの上昇余地:{" "}
          <span className={upside >= 0 ? "text-up" : "text-down"}>
            {upside >= 0 ? "+" : ""}
            {upside.toFixed(1)}%
          </span>
        </p>
      </div>

      {/* 証券会社別レーティング */}
      <div>
        <h4 className="text-xs text-[var(--text-faint)] mb-2.5 tracking-wide">
          証券会社別レーティング
        </h4>
        <div className="flex flex-col divide-y divide-[var(--panel-border)] max-h-64 overflow-y-auto">
          {firms.map((f) => (
            <div
              key={f.firm}
              className="py-2.5 flex items-center justify-between gap-3 text-sm"
            >
              <span className="text-[var(--text-dim)] truncate">{f.firm}</span>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[0.65rem] mono ${ratingBadgeClass(
                    f.rating
                  )}`}
                >
                  {f.rating}
                </span>
                <span className="mono text-xs w-20 text-right">
                  {yen(f.targetPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
