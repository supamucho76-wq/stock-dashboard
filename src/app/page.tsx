import type { Metadata } from "next";
import { generateKioxiaBundle } from "@/lib/kioxiaData";
import TodaySummaryCard from "@/components/TodaySummaryCard";
import NandMarketPanel from "@/components/NandMarketPanel";
import EarningsCountdownPanel from "@/components/EarningsCountdownPanel";
import ShareholderShortPanel from "@/components/ShareholderShortPanel";
import MyPositionPanel from "@/components/MyPositionPanel";
import StockHeader from "@/components/StockHeader";
import PriceChart from "@/components/PriceChart";
import AnalystPanel from "@/components/AnalystPanel";
import StatsGrid from "@/components/StatsGrid";
import NewsList from "@/components/NewsList";
import OutlookCard from "@/components/OutlookCard";

export const metadata: Metadata = {
  title: "KIOXIA HUB | キオクシア(285A) 専用分析ターミナル",
  description:
    "キオクシアホールディングス(285A)保有者向けの専用ダッシュボード。今日の状況・NAND市況・決算カウントダウン・株主/信用需給・マイポジションを1画面に集約。",
};

export default function Home() {
  const { stock, today, nand, earnings, shareholders } = generateKioxiaBundle();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-6">
      <TodaySummaryCard today={today} />

      <StockHeader data={stock} />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-start">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="panel-heading">
              株価チャート — ローソク足 / ボリンジャーバンド(±2σ) / 出来高
            </h3>
            <div className="flex items-center gap-4 text-[0.65rem] text-[var(--text-faint)]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full inline-block bg-[var(--up)]" />
                陽線
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full inline-block bg-[var(--down)]" />
                陰線
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-[10px] border-t border-[var(--cyan)] inline-block" />
                BB±2σ
              </span>
            </div>
          </div>
          <PriceChart
            candles={stock.candles}
            volumes={stock.volumes}
            bollinger={stock.bollinger}
          />
        </div>

        <AnalystPanel analysts={stock.analysts} price={stock.price} />
      </div>

      <NandMarketPanel nand={nand} />

      <EarningsCountdownPanel earnings={earnings} />

      <ShareholderShortPanel data={shareholders} />

      <MyPositionPanel currentPrice={stock.price} />

      <StatsGrid stats={stock.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewsList news={stock.news} />
        <OutlookCard outlook={stock.outlook} />
      </div>
    </div>
  );
}
