import type { StockData } from "@/lib/stockData";

export default function StatsGrid({ stats }: { stats: StockData["stats"] }) {
  const items: { label: string; value: string }[] = [
    { label: "52週高値", value: `¥${stats.high52w.toLocaleString()}` },
    { label: "52週安値", value: `¥${stats.low52w.toLocaleString()}` },
    { label: "PER", value: `${stats.per.toFixed(1)}倍` },
    { label: "PBR", value: `${stats.pbr.toFixed(2)}倍` },
    { label: "配当利回り", value: `${stats.dividendYield.toFixed(2)}%` },
    { label: "時価総額", value: `${stats.marketCapOku.toLocaleString()}億円` },
    { label: "平均出来高", value: `${Math.round(stats.avgVolume / 1000).toLocaleString()}千株` },
  ];

  return (
    <div className="glass-panel p-5">
      <h3 className="panel-heading mb-4">主要指標</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label}>
            <p className="text-[0.68rem] text-[var(--text-faint)] mb-1">
              {it.label}
            </p>
            <p className="mono text-sm text-[var(--text)]">{it.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
