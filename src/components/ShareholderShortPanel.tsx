import type { ShareholderData } from "@/lib/kioxiaData";

const OFFICIAL_STOCK_URL =
  "https://www.kioxia-holdings.com/ja-jp/ir/stock/outline.html";
const MARGIN_PDF_URL =
  "https://www.jpx.co.jp/markets/statistics-equities/margin/tvdivq0000001rnl-att/syumatsu2026072400.pdf";
const SHORT_POSITION_URL =
  "https://www.jpx.co.jp/markets/public/short-selling/index.html";

const marginDetails = [
  ["信用売り残", "542,800株", "+164,900株"],
  ["信用買い残", "11,385,700株", "-2,502,200株"],
  ["信用倍率", "21.0倍", "買残 ÷ 売残"],
  ["一般信用・売り", "145,300株", "+59,300株"],
  ["制度信用・売り", "397,500株", "+105,600株"],
  ["一般信用・買い", "3,639,100株", "-1,037,700株"],
  ["制度信用・買い", "7,746,600株", "-1,464,500株"],
] as const;

export default function ShareholderShortPanel({ data }: { data: ShareholderData }) {
  return (
    <section className="glass-panel p-5" aria-labelledby="supply-heading">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="flex items-center gap-2">
          <h3 id="supply-heading" className="panel-heading">株主・信用・空売りモニター</h3>
          <span className="mono text-[0.58rem] text-[var(--neon-soft)]">OFFICIAL</span>
        </div>
        <span className="text-[0.62rem] text-[var(--text-faint)]">各ソースの基準日を表示</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <div>
              <p className="text-xs text-[var(--neon-soft)]">JPX 銘柄別信用取引週末残高</p>
              <p className="text-[0.62rem] text-[var(--text-faint)] mt-1">2026年7月24日申込現在・前週比</p>
            </div>
            <a href={MARGIN_PDF_URL} target="_blank" rel="noreferrer" className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80">
              JPX原表 ↗
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {marginDetails.map(([label, value, change]) => {
              const isNegative = change.startsWith("-");
              const isPositive = change.startsWith("+");
              return (
                <div key={label} className="rounded-lg border border-[var(--panel-border)] p-3 bg-[rgba(255,255,255,0.02)]">
                  <p className="text-[0.62rem] text-[var(--text-faint)]">{label}</p>
                  <p className="mono text-sm text-[var(--text)] mt-1">{value}</p>
                  <p className={`mono text-[0.62rem] mt-1 ${isNegative ? "text-down" : isPositive ? "text-up" : "text-[var(--text-faint)]"}`}>
                    {change}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-[var(--panel-border-strong)] p-4 bg-[rgba(67,232,255,0.035)]">
            <p className="text-xs text-[var(--cyan)]">残高の変化</p>
            <p className="text-sm text-[var(--text-dim)] mt-1 leading-relaxed">
              信用買い残は前週比18.0%減、信用売り残は43.6%増です。信用倍率は約21.0倍です。
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <div>
              <p className="text-xs text-[var(--neon-soft)]">主要株主</p>
              <p className="text-[0.62rem] text-[var(--text-faint)] mt-1">2026年3月31日現在</p>
            </div>
            <a href={OFFICIAL_STOCK_URL} target="_blank" rel="noreferrer" className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80">
              公式株式情報 ↗
            </a>
          </div>
          <div className="max-h-[360px] overflow-y-auto divide-y divide-[var(--panel-border)] pr-1">
            {data.majorShareholders.map((holder) => (
              <div key={holder.name} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--text-dim)] truncate">{holder.name}</span>
                <span className="mono text-[var(--text)] shrink-0">{holder.pct.toFixed(2)}%</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[var(--panel-border)] p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-[var(--text)]">機関投資家の空売り残高</p>
              <a href={SHORT_POSITION_URL} target="_blank" rel="noreferrer" className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80">
                JPX最新公表 ↗
              </a>
            </div>
            <p className="text-xs text-[var(--text-faint)] mt-2 leading-relaxed">
              JPXは残高割合0.5%以上の報告を日次公表しています。現在は285Aの自動集計を未接続のため、推測値を表示せず公式ファイルへのリンクのみ掲載しています。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
