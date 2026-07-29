const STRATEGY_URL =
  "https://www.kioxia-holdings.com/ja-jp/news/2026/20260602-1.html";

const strategyItems = [
  ["事業構成", "データセンター・エンタープライズ向け売上比率を中長期で60%以上へ"],
  ["成長投資", "今後3年間、高成長・高収益分野へ年間約4,700億円の設備投資"],
  ["研究開発", "年間約2,300億円を研究開発へ投資"],
  ["財務", "2026年度第1四半期中のネットキャッシュ達成を見込む"],
  ["株主還元", "財務健全性と成長投資を確保した上で余剰累積FCFから検討"],
] as const;

export default function OutlookCard() {
  return (
    <section className="glass-panel p-5" aria-labelledby="outlook-heading">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <h3 id="outlook-heading" className="panel-heading">会社戦略・今後の展望</h3>
          <span className="mono text-[0.58rem] text-[var(--neon-soft)]">OFFICIAL</span>
        </div>
        <a
          href={STRATEGY_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80"
        >
          公式発表 ↗
        </a>
      </div>

      <div className="divide-y divide-[var(--panel-border)]">
        {strategyItems.map(([label, value]) => (
          <div key={label} className="py-3">
            <p className="text-[0.65rem] text-[var(--neon-soft)]">{label}</p>
            <p className="mt-1 text-sm text-[var(--text-dim)] leading-relaxed">{value}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[0.62rem] text-[var(--text-faint)] leading-relaxed">
        2026年6月2日時点の会社方針です。市場予想や本サイト独自の業績予測ではありません。
      </p>
    </section>
  );
}
