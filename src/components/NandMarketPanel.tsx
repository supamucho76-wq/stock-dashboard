const INVESTOR_DAY_URL =
  "https://www.kioxia-holdings.com/content/dam/kioxia-hd/shared/ir/library/event/asset/Kioxia-Investor-Day-2026-ja.pdf";
const INVESTOR_DAY_NEWS_URL =
  "https://www.kioxia-holdings.com/ja-jp/news/2026/20260602-1.html";

const marketSignals = [
  {
    label: "NANDビット需要",
    value: "20%強",
    unit: "2025-2028 CAGR",
    detail: "AIサーバー容量の増加が市場拡大を牽引",
  },
  {
    label: "データセンター向け",
    value: "46%",
    unit: "CAGR",
    detail: "フラッシュメモリ需要で最も高い成長領域",
  },
  {
    label: "推論AI向け",
    value: "86%",
    unit: "CAGR",
    detail: "データセンター需要の成長ドライバー",
  },
  {
    label: "PC・スマホ向け",
    value: "横ばい〜微減",
    unit: "2026年見通し",
    detail: "会社説明では足元を調整局面と認識",
  },
] as const;

const checkpoints = [
  ["需給バランス", "2027年までタイトな状態が続く見込み"],
  ["NAND価格", "上昇傾向との会社説明"],
  ["設備投資", "今後3年間、年平均約4,700億円を計画"],
  ["前工程GBコスト", "平均で年率10%台の改善を計画"],
  ["第10世代BiCS FLASH", "2026年夏ごろサンプル出荷開始予定"],
] as const;

export default function NandMarketPanel() {
  return (
    <section className="glass-panel p-5" aria-labelledby="nand-heading">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="flex items-center gap-2">
          <h3 id="nand-heading" className="panel-heading">NAND・フラッシュ市場見通し</h3>
          <span className="mono text-[0.58rem] text-[var(--neon-soft)]">OFFICIAL IR</span>
        </div>
        <a
          href={INVESTOR_DAY_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80"
        >
          Investor Day資料 ↗
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        {marketSignals.map((signal) => (
          <div key={signal.label} className="rounded-lg border border-[var(--panel-border)] p-4 bg-[rgba(57,255,148,0.035)]">
            <p className="text-[0.65rem] text-[var(--text-faint)]">{signal.label}</p>
            <p className="mono text-xl text-[var(--text)] mt-1">{signal.value}</p>
            <p className="text-[0.62rem] text-[var(--neon-soft)] mt-0.5">{signal.unit}</p>
            <p className="text-xs text-[var(--text-dim)] mt-3 leading-relaxed">{signal.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-lg border border-[var(--panel-border)] p-4">
          <p className="text-xs text-[var(--neon-soft)] mb-3">投資家が追うべき公式チェックポイント</p>
          <div className="divide-y divide-[var(--panel-border)]">
            {checkpoints.map(([label, value]) => (
              <div key={label} className="py-2.5 flex items-start justify-between gap-4 text-sm">
                <span className="text-[var(--text-faint)] shrink-0">{label}</span>
                <span className="text-[var(--text-dim)] text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--panel-border-strong)] p-4 bg-[rgba(67,232,255,0.035)]">
          <p className="text-xs text-[var(--cyan)] mb-2">キオクシアへの意味</p>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">
            会社は、スマートフォン・PCの事業基盤を維持しながら、AI・データセンター向けSSDへ経営資源を重点配分する方針です。中長期ではデータセンター・エンタープライズ向け売上比率60%以上を目標としています。
          </p>
          <a
            href={INVESTOR_DAY_NEWS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-4 text-xs text-[var(--cyan)] hover:opacity-80"
          >
            公式発表を確認 ↗
          </a>
        </div>
      </div>

      <p className="mt-4 text-[0.62rem] text-[var(--text-faint)] leading-relaxed">
        2026年6月2日のInvestor Day資料に掲載された会社説明および同資料が引用するTechInsightsの予測です。リアルタイム価格指数ではありません。
      </p>
    </section>
  );
}
