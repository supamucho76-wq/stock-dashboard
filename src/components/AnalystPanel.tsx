const COVERAGE_URL =
  "https://www.kioxia-holdings.com/ja-jp/ir/stock/analyst-coverage.html";

const CONSENSUS_LINKS = [
  {
    label: "TradingView",
    detail: "目標価格・予想レンジ・評価",
    href: "https://jp.tradingview.com/symbols/TSE-285A/forecast/",
  },
  {
    label: "Yahoo!ファイナンス",
    detail: "アイフィス提供のアナリスト予想",
    href: "https://finance.yahoo.co.jp/quote/285A.T",
  },
  {
    label: "みんかぶ",
    detail: "評価内訳・目標株価の変化",
    href: "https://minkabu.jp/stock/285A/analyst_consensus",
  },
] as const;

const CHECKPOINTS = [
  {
    number: "01",
    title: "目標株価の方向",
    detail: "平均値だけでなく、決算後に上方・下方修正がどちらへ増えたかを見る",
  },
  {
    number: "02",
    title: "評価の分布",
    detail: "買い・中立・売りの人数変化から、市場の見方の偏りを確認する",
  },
  {
    number: "03",
    title: "業績予想の修正",
    detail: "売上高・EPS予想と、NAND ASPやデータセンター需要の前提を確認する",
  },
] as const;

const analysts = [
  ["Aletheia Capital Limited", "Warren Lau"],
  ["Arete Research LLC", "Nam Hyung Kim"],
  ["BNP Paribas S.A.", "Alex Chang"],
  ["BofA証券株式会社", "平川 幹夫"],
  ["China Renaissance Securities (HK) Ltd", "Jack Zhou"],
  ["シティグループ証券株式会社", "藤原 毅郎"],
  ["CLSA証券株式会社", "吉田 優"],
  ["Daiwa Securities Capital Markets Korea", "SK (Sung Kyu) Kim"],
  ["ゴールドマン・サックス証券株式会社", "中村 修平"],
  ["岩井コスモ証券株式会社", "斎藤 和嘉"],
  ["J.P. Morgan Securities, Seoul Branch", "Jay Kwon"],
  ["JPモルガン証券株式会社", "鹿内 美欧"],
  ["モルガン・スタンレーMUFG証券株式会社", "吉川 和夫"],
  ["Morningstar, Inc.", "Yu Jing Jie"],
  ["MST Financial Services Pty Limited", "David Gibson"],
  ["野村證券株式会社", "王 バージニア"],
  ["フィリップ証券株式会社", "和泉 美治"],
  ["Sanford C. Bernstein (Hong Kong) Ltd.", "Mark Li"],
  ["SMBC日興証券株式会社", "花屋 武"],
] as const;

const domesticCount = 10;
const internationalCount = analysts.length - domesticCount;
const domesticShare = Math.round((domesticCount / analysts.length) * 100);

export default function AnalystPanel() {
  return (
    <section className="glass-panel p-5" aria-labelledby="analyst-heading">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="flex items-center gap-2">
          <h3 id="analyst-heading" className="panel-heading">アナリスト動向</h3>
          <span className="mono text-[0.58rem] text-[var(--neon-soft)]">OFFICIAL + EXTERNAL</span>
        </div>
        <a
          href={COVERAGE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80"
        >
          公式カバレッジ一覧 ↗
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)] gap-4 mb-5">
        <div className="rounded-lg border border-[var(--panel-border-strong)] bg-[rgba(57,255,148,0.035)] p-4">
          <p className="text-[0.65rem] text-[var(--text-faint)]">公式掲載アナリスト</p>
          <div className="flex items-end gap-2 mt-1">
            <p className="mono text-3xl neon-text">{analysts.length}</p>
            <p className="text-xs text-[var(--text-dim)] pb-1">名</p>
          </div>
          <p className="text-[0.62rem] text-[var(--text-faint)] mt-2">更新日 2026年6月30日</p>
        </div>

        <div className="rounded-lg border border-[var(--panel-border)] p-4">
          <div className="flex items-center justify-between gap-3 text-xs mb-3">
            <span className="text-[var(--text-dim)]">カバレッジ構成</span>
            <span className="text-[var(--text-faint)]">当サイト分類</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-[rgba(255,255,255,0.05)] flex">
            <span className="bg-[var(--neon)]" style={{ width: `${domesticShare}%` }} />
            <span className="bg-[var(--cyan)]" style={{ width: `${100 - domesticShare}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <p className="mono text-lg text-[var(--text)]">{domesticCount}<span className="text-xs ml-1">社</span></p>
              <p className="text-[0.62rem] text-[var(--text-faint)]">国内法人</p>
            </div>
            <div>
              <p className="mono text-lg text-[var(--text)]">{internationalCount}<span className="text-xs ml-1">社</span></p>
              <p className="text-[0.62rem] text-[var(--text-faint)]">海外法人・海外拠点</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-xs text-[var(--neon-soft)]">決算後に確認する3つの変化</p>
          <span className="text-[0.62rem] text-[var(--text-faint)]">発表前後で比較</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CHECKPOINTS.map((item) => (
            <div key={item.number} className="rounded-lg border border-[var(--panel-border)] p-3 bg-[rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-2">
                <span className="mono text-[0.6rem] text-[var(--cyan)]">{item.number}</span>
                <p className="text-xs text-[var(--text)]">{item.title}</p>
              </div>
              <p className="text-[0.68rem] text-[var(--text-faint)] leading-relaxed mt-2">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--panel-border-strong)] p-4 bg-[rgba(67,232,255,0.035)] mb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <p className="text-xs text-[var(--cyan)]">最新コンセンサスを確認</p>
          <span className="mono text-[0.58rem] text-[var(--text-faint)]">EXTERNAL DATA</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {CONSENSUS_LINKS.map((source) => (
            <a
              key={source.label}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-[var(--panel-border)] px-3 py-2.5 hover:border-[var(--cyan)] transition-colors"
            >
              <span className="text-xs text-[var(--text)]">{source.label} ↗</span>
              <span className="block text-[0.6rem] text-[var(--text-faint)] mt-1">{source.detail}</span>
            </a>
          ))}
        </div>
        <p className="text-[0.6rem] text-[var(--text-faint)] leading-relaxed mt-3">
          目標株価・評価は各サービスの更新時点や集計対象により異なります。本サイトでは固定値を転載せず、最新表示へ直接案内します。
        </p>
      </div>

      <details className="group rounded-lg border border-[var(--panel-border)]">
        <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between gap-3 text-xs text-[var(--text-dim)]">
          <span>担当証券会社・アナリスト19名を見る</span>
          <span className="text-[var(--cyan)] group-open:rotate-45 transition-transform">＋</span>
        </summary>
        <div className="max-h-[360px] overflow-y-auto divide-y divide-[var(--panel-border)] border-t border-[var(--panel-border)] px-4">
          {analysts.map(([firm, analyst]) => (
            <div key={`${firm}-${analyst}`} className="py-2.5 flex items-start justify-between gap-3 text-sm">
              <span className="text-[var(--text-dim)]">{firm}</span>
              <span className="text-[var(--text)] text-right shrink-0">{analyst}</span>
            </div>
          ))}
        </div>
      </details>

      <p className="mt-4 text-[0.62rem] text-[var(--text-faint)] leading-relaxed">
        公式一覧はレポート発行を確認した担当者を示すもので、会社による投資判断・目標株価・推奨ではありません。
      </p>
    </section>
  );
}
