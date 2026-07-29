const COVERAGE_URL =
  "https://www.kioxia-holdings.com/ja-jp/ir/stock/analyst-coverage.html";

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
  ["JPモルガン証券株式会社", "鹿内 美欧"],
  ["モルガン・スタンレーMUFG証券株式会社", "吉川 和夫"],
  ["Morningstar, Inc.", "Yu Jing Jie"],
  ["MST Financial Services Pty Limited", "David Gibson"],
  ["野村證券株式会社", "王 バージニア"],
  ["フィリップ証券株式会社", "和泉 美治"],
  ["Sanford C. Bernstein (Hong Kong) Ltd.", "Mark Li"],
  ["SMBC日興証券株式会社", "花屋 武"],
] as const;

export default function AnalystPanel() {
  return (
    <section className="glass-panel p-5" aria-labelledby="analyst-heading">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <h3 id="analyst-heading" className="panel-heading">アナリストカバレッジ</h3>
          <span className="mono text-[0.58rem] text-[var(--neon-soft)]">OFFICIAL</span>
        </div>
        <a
          href={COVERAGE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80"
        >
          公式一覧 ↗
        </a>
      </div>

      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="mono text-3xl neon-text">{analysts.length}</p>
          <p className="text-[0.65rem] text-[var(--text-faint)]">掲載アナリスト数</p>
        </div>
        <p className="text-[0.65rem] text-[var(--text-faint)]">更新日 2026年6月30日</p>
      </div>

      <div className="max-h-[430px] overflow-y-auto divide-y divide-[var(--panel-border)] pr-1">
        {analysts.map(([firm, analyst]) => (
          <div key={`${firm}-${analyst}`} className="py-2.5 flex items-start justify-between gap-3 text-sm">
            <span className="text-[var(--text-dim)]">{firm}</span>
            <span className="text-[var(--text)] text-right shrink-0">{analyst}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[0.62rem] text-[var(--text-faint)] leading-relaxed">
        公式サイトがレポート発行を確認した担当者の一覧です。投資判断・目標株価・推奨を示すものではありません。
      </p>
    </section>
  );
}
