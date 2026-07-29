import type { StockData } from "@/lib/stockData";
import PriceChart from "@/components/PriceChart";

const YAHOO_CHART_URL = "https://finance.yahoo.co.jp/quote/285A.T/chart";
const TRADINGVIEW_SYMBOL_URL = "https://jp.tradingview.com/symbols/TSE-285A/";

export default function KioxiaMarketPanel({
  stock,
  isLive,
}: {
  stock: StockData;
  isLive: boolean;
}) {
  const isUp = stock.change >= 0;

  return (
    <section
      id="market-data"
      className="glass-panel overflow-hidden border-[var(--panel-border-strong)] shadow-[0_0_45px_rgba(57,255,148,0.08)]"
      aria-labelledby="market-data-heading"
    >
      <div className="px-4 sm:px-6 pt-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="mono text-[0.62rem] text-[var(--neon-soft)] mb-1">MAIN MARKET VIEW</p>
            <h2 id="market-data-heading" className="panel-heading !text-base sm:!text-lg">
              キオクシアホールディングス（285A）
            </h2>
            <p className="mt-1 text-xs text-[var(--text-faint)]">東証プライム · 電気機器</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`rounded border px-2.5 py-1 text-[0.62rem] mono ${
                isLive
                  ? "border-[rgba(57,255,148,0.35)] text-[var(--neon-soft)]"
                  : "border-[rgba(246,211,101,0.35)] text-[#f6d365]"
              }`}
            >
              {isLive ? "285A DATA" : "DEMO DATA"}
            </span>
            <a
              href={YAHOO_CHART_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-[var(--panel-border-strong)] px-3 py-1.5 text-xs text-[var(--cyan)] hover:bg-[rgba(67,232,255,0.06)]"
            >
              外部チャート ↗
            </a>
          </div>
        </div>

        <div className="mt-5 flex items-end gap-4 flex-wrap border-y border-[var(--panel-border)] py-4">
          <span className="mono text-3xl sm:text-5xl font-bold neon-text">
            ¥{stock.price.toLocaleString("ja-JP")}
          </span>
          <div className={`mono pb-1 ${isUp ? "text-up" : "text-down"}`}>
            <p className="mb-0.5 text-[0.6rem] text-[var(--text-faint)]">前日比</p>
            <p>
              {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
              {stock.change.toLocaleString("ja-JP")}
            </p>
            <p>
              ({isUp ? "+" : ""}
              {stock.changePercent.toFixed(2)}%)
            </p>
          </div>
          <span className="ml-auto text-[0.65rem] text-[var(--text-faint)]">
            {isLive ? "市場により遅延" : "実データではありません"}
          </span>
        </div>
      </div>

      <div className="px-1 sm:px-3 pt-4">
        <PriceChart
          candles={stock.candles}
          volumes={stock.volumes}
          bollinger={stock.bollinger}
        />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap px-4 sm:px-6 pb-4 text-[0.65rem] text-[var(--text-faint)] leading-relaxed">
        <p>
          {isLive
            ? "Yahoo Financeの公開チャートデータをもとに285Aだけを表示しています。表示時刻・遅延条件は外部チャートでご確認ください。"
            : "外部株価データを取得できなかったため、チャートはUI確認用のデモ表示です。"}
        </p>
        <a
          href={TRADINGVIEW_SYMBOL_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--cyan)] hover:underline"
        >
          TradingViewで285Aを確認 ↗
        </a>
      </div>
    </section>
  );
}
