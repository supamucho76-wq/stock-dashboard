import type { StockData } from "@/lib/stockData";

const RESULTS_URL =
  "https://www2.jpx.co.jp/disc/285A0/140120260515537803.pdf";

export default function StatsGrid({
  stats,
  isLive,
}: {
  stats: StockData["stats"];
  isLive: boolean;
}) {
  const items: { label: string; value: string; unit?: string }[] = [
    { label: "52週高値", value: `¥${stats.high52w.toLocaleString()}` },
    { label: "52週安値", value: `¥${stats.low52w.toLocaleString()}` },
    { label: "PER", value: stats.per.toFixed(1), unit: "倍" },
    { label: "PBR", value: stats.pbr.toFixed(2), unit: "倍" },
    { label: "配当利回り", value: `${stats.dividendYield.toFixed(2)}%` },
    { label: "時価総額", value: stats.marketCapOku.toLocaleString(), unit: "億円" },
    {
      label: "平均出来高",
      value: Math.round(stats.avgVolume / 1000).toLocaleString(),
      unit: "千株",
    },
  ];

  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <h3 className="panel-heading">主要指標</h3>
          <span className={`mono text-[0.58rem] ${isLive ? "text-[var(--neon-soft)]" : "text-[#f6d365]"}`}>
            {isLive ? "285A + OFFICIAL FY2026" : "DEMO"}
          </span>
        </div>
        {isLive && (
          <a
            href={RESULTS_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80"
          >
            算定元の公式決算短信 ↗
          </a>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label}>
            <p className="text-[0.68rem] text-[var(--text-faint)] mb-1">
              {it.label}
            </p>
            <p className="text-sm text-[var(--text)]">
              <span className="mono">{it.value}</span>
              {it.unit}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[0.62rem] text-[var(--text-faint)] leading-relaxed">
        {isLive
          ? "PER・PBR・時価総額は、現在株価と2026年3月期の基本的EPS（1,024.07円）、1株当たり親会社所有者帰属持分（2,561.74円）、期末発行済株式数を用いて算定しています。"
          : "外部株価を取得できなかったため、主要指標はUI確認用のデモ値です。"}
      </p>
    </div>
  );
}
