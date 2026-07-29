import type { AnalystConsensusData } from "@/lib/liveData";

const COVERAGE_URL =
  "https://www.kioxia-holdings.com/ja-jp/ir/stock/analyst-coverage.html";

const CONSENSUS_LINKS = [
  {
    label: "TradingView",
    detail: "別集計の目標価格・予想レンジ",
    href: "https://jp.tradingview.com/symbols/TSE-285A/forecast-price-target/",
  },
  {
    label: "Yahoo!ファイナンス",
    detail: "アイフィス提供のアナリスト予想",
    href: "https://finance.yahoo.co.jp/quote/285A.T",
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

const ratingMeta = [
  ["strongBuy", "強気買い", "#39ff94"],
  ["buy", "買い", "#8df5b7"],
  ["neutral", "中立", "#f6d365"],
  ["sell", "売り", "#ff8a5b"],
  ["strongSell", "強気売り", "#ff3d71"],
] as const;

function formatJapaneseDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

export default function AnalystPanel({
  consensus,
  currentPrice,
}: {
  consensus: AnalystConsensusData;
  currentPrice: number;
}) {
  const hasConsensus =
    consensus.state !== "unavailable" &&
    consensus.targetPrice != null &&
    consensus.previousWeekTargetPrice != null &&
    consensus.ratings != null &&
    consensus.asOf != null;
  const targetGap = hasConsensus ? consensus.targetPrice! - currentPrice : 0;
  const targetGapPercent = hasConsensus && currentPrice > 0 ? (targetGap / currentPrice) * 100 : 0;
  const weeklyChange = hasConsensus
    ? consensus.targetPrice! - consensus.previousWeekTargetPrice!
    : 0;
  const weeklyChangePercent =
    hasConsensus && consensus.previousWeekTargetPrice! > 0
      ? (weeklyChange / consensus.previousWeekTargetPrice!) * 100
      : 0;
  const ratingCount = hasConsensus
    ? Object.values(consensus.ratings!).reduce((sum, value) => sum + value, 0)
    : 0;

  return (
    <section className="glass-panel p-5" aria-labelledby="analyst-heading">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="flex items-center gap-2">
          <h3 id="analyst-heading" className="panel-heading">アナリスト動向</h3>
          <span className="mono text-[0.58rem] text-[var(--neon-soft)]">OFFICIAL + AUTO</span>
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

      {hasConsensus ? (
        <div className="rounded-lg border border-[var(--panel-border-strong)] bg-[rgba(67,232,255,0.035)] p-4 mb-5">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <div className="flex items-center gap-2">
              <p className="text-xs text-[var(--cyan)]">市場コンセンサス</p>
              <span className="mono text-[0.55rem] text-[var(--neon-soft)]">
                {consensus.state === "live" ? "AUTO・6H" : "AUTO・DAILY"}
              </span>
            </div>
            <a
              href={consensus.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[0.62rem] text-[var(--cyan)] hover:opacity-80"
            >
              みんかぶ・{formatJapaneseDate(consensus.asOf!)}時点 ↗
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="rounded border border-[var(--panel-border)] p-3">
              <p className="text-[0.62rem] text-[var(--text-faint)]">コンセンサス</p>
              <p className="text-xl text-[var(--neon)] mt-1">{consensus.consensus}</p>
              <p className="text-[0.6rem] text-[var(--text-faint)] mt-1">評価対象 {ratingCount}名</p>
            </div>
            <div className="rounded border border-[var(--panel-border)] p-3">
              <p className="text-[0.62rem] text-[var(--text-faint)]">平均目標株価</p>
              <p className="mono text-xl text-[var(--text)] mt-1">¥{consensus.targetPrice!.toLocaleString()}</p>
              <p className={`mono text-[0.6rem] mt-1 ${weeklyChange >= 0 ? "text-up" : "text-down"}`}>
                1週間で {weeklyChange >= 0 ? "+" : ""}¥{weeklyChange.toLocaleString()}（{weeklyChangePercent >= 0 ? "+" : ""}{weeklyChangePercent.toFixed(2)}%）
              </p>
            </div>
            <div className="rounded border border-[var(--panel-border)] p-3">
              <p className="text-[0.62rem] text-[var(--text-faint)]">現在株価との差</p>
              <p className={`mono text-xl mt-1 ${targetGap >= 0 ? "text-up" : "text-down"}`}>
                {targetGap >= 0 ? "+" : ""}¥{targetGap.toLocaleString()}
              </p>
              <p className={`mono text-[0.6rem] mt-1 ${targetGapPercent >= 0 ? "text-up" : "text-down"}`}>
                乖離率 {targetGapPercent >= 0 ? "+" : ""}{targetGapPercent.toFixed(2)}%
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-xs text-[var(--text-dim)]">評価の分布</p>
              <p className="text-[0.6rem] text-[var(--text-faint)]">過去3か月の集計</p>
            </div>
            <div className="h-3 flex overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
              {ratingMeta.map(([key, label, color]) => {
                const count = consensus.ratings![key];
                if (count === 0) return null;
                return (
                  <span
                    key={key}
                    title={`${label} ${count}名`}
                    style={{ width: `${(count / ratingCount) * 100}%`, backgroundColor: color }}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
              {ratingMeta.map(([key, label, color]) => (
                <div key={key} className="flex items-center gap-1.5 text-[0.62rem]">
                  <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[var(--text-faint)]">{label}</span>
                  <span className="mono text-[var(--text)]">{consensus.ratings![key]}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[0.58rem] text-[var(--text-faint)] leading-relaxed mt-4">
            情報会社が集計した外部コンセンサスです。平日18:30ごろに更新確認し、基準日付きの最終取得値を表示します。目標株価は将来の成果を保証しません。
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-[rgba(246,211,101,0.35)] bg-[rgba(246,211,101,0.05)] p-4 mb-5">
          <p className="text-xs text-[#f6d365]">コンセンサスデータを取得できませんでした</p>
          <p className="text-[0.68rem] text-[var(--text-faint)] mt-2">古い数値は表示せず、取得元へ直接案内します。</p>
          <a href={consensus.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex mt-3 text-xs text-[var(--cyan)]">
            最新値を確認 ↗
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)] gap-4 mb-4">
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
            <span className="text-[var(--text-dim)]">公式カバレッジ構成</span>
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

      <div className="flex flex-wrap gap-2 mb-4">
        {CONSENSUS_LINKS.map((source) => (
          <a
            key={source.label}
            href={source.href}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-[var(--panel-border)] px-3 py-2 hover:border-[var(--cyan)] transition-colors"
          >
            <span className="text-[0.68rem] text-[var(--text)]">{source.label} ↗</span>
            <span className="text-[0.58rem] text-[var(--text-faint)] ml-2">{source.detail}</span>
          </a>
        ))}
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
