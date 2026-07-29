import type { ShareholderData } from "@/lib/kioxiaData";
import type { MarginBalanceData, ShortPositionSource } from "@/lib/liveData";

const OFFICIAL_STOCK_URL =
  "https://www.kioxia-holdings.com/ja-jp/ir/stock/outline.html";
function formatSigned(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toLocaleString()}株`;
}

function formatJapaneseDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

export default function ShareholderShortPanel({
  data,
  margin,
  shortPositions,
}: {
  data: ShareholderData;
  margin: MarginBalanceData;
  shortPositions: ShortPositionSource;
}) {
  const marginDetails = [
    ["信用売り残", `${margin.sellBalance.toLocaleString()}株`, formatSigned(margin.sellChange)],
    ["信用買い残", `${margin.buyBalance.toLocaleString()}株`, formatSigned(margin.buyChange)],
    ["信用倍率", `${margin.ratio.toFixed(2)}倍`, "買残 ÷ 売残"],
  ] as const;

  return (
    <section className="glass-panel p-5" aria-labelledby="supply-heading">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="flex items-center gap-2">
          <h3 id="supply-heading" className="panel-heading">株主・信用・空売りモニター</h3>
          <span className="mono text-[0.58rem] text-[var(--neon-soft)]">OFFICIAL + AUTO</span>
        </div>
        <span className="text-[0.62rem] text-[var(--text-faint)]">各ソースの基準日を表示</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <div>
              <p className="text-xs text-[var(--neon-soft)]">JPX 銘柄別信用取引週末残高</p>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <p className="text-[0.62rem] text-[var(--text-faint)]">
                  {formatJapaneseDate(margin.asOf)}申込現在・前週比
                </p>
                <span className={`mono text-[0.55rem] ${margin.state === "live" ? "text-[var(--neon-soft)]" : "text-[#f6d365]"}`}>
                  {margin.state === "live" ? "AUTO" : "SNAPSHOT"}
                </span>
                {margin.verifiedByJpx && (
                  <span className="mono text-[0.55rem] text-[var(--cyan)]">JPX照合済み</span>
                )}
              </div>
            </div>
            <a href={margin.sourceUrl} target="_blank" rel="noreferrer" className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80">
              {margin.verifiedByJpx ? "JPX原表" : "取得元"} ↗
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
              信用買い残は前週比{Math.abs(margin.buyChangePercent).toFixed(1)}%
              {margin.buyChangePercent >= 0 ? "増" : "減"}、信用売り残は
              {Math.abs(margin.sellChangePercent).toFixed(1)}%
              {margin.sellChangePercent >= 0 ? "増" : "減"}です。信用倍率は約
              {margin.ratio.toFixed(2)}倍です。
            </p>
            <a
              href={margin.historyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex mt-3 text-[0.65rem] text-[var(--cyan)] hover:opacity-80"
            >
              信用残の時系列を確認 ↗
            </a>
            <p className="text-[0.58rem] text-[var(--text-faint)] mt-2 leading-relaxed">
              合計残高はYahoo!ファイナンスの週次時系列から6時間ごとに確認し、同じ基準日のJPX公式PDFと照合しています。
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
              <div>
                <p className="text-xs text-[var(--text)]">機関投資家の空売り残高</p>
                <p className="text-[0.6rem] text-[var(--text-faint)] mt-1">
                  JPX最新公表 {formatJapaneseDate(shortPositions.asOf)}
                  {shortPositions.state === "live" ? "・自動更新" : "・確認用リンク"}
                </p>
              </div>
              <a href={shortPositions.sourceUrl} target="_blank" rel="noreferrer" className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80">
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
