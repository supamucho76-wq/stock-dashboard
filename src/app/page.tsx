import type { Metadata } from "next";
import { getKioxiaDashboardData } from "@/lib/liveData";
import TodaySummaryCard from "@/components/TodaySummaryCard";
import NandMarketPanel from "@/components/NandMarketPanel";
import EarningsCountdownPanel from "@/components/EarningsCountdownPanel";
import ShareholderShortPanel from "@/components/ShareholderShortPanel";
import MyPositionPanel from "@/components/MyPositionPanel";
import KioxiaMarketPanel from "@/components/KioxiaMarketPanel";
import AnalystPanel from "@/components/AnalystPanel";
import StatsGrid from "@/components/StatsGrid";
import NewsList from "@/components/NewsList";
import OutlookCard from "@/components/OutlookCard";
import DataSourceBar from "@/components/DataSourceBar";
import PtsPanel from "@/components/PtsPanel";

export const metadata: Metadata = {
  title: "KIOXIA HUB | キオクシア(285A) 専用分析ターミナル",
  description:
    "キオクシアホールディングス(285A)保有者向けの専用ダッシュボード。株価チャート・PTS情報・公式IR・決算実績・マイポジションを1画面に集約。",
};

export default async function Home() {
  const { stock, today, earnings, shareholders, margin, shortPositions, meta } =
    await getKioxiaDashboardData();

  return (
    <div className="max-w-[1680px] mx-auto px-3 sm:px-6 xl:px-8 py-6 sm:py-8 flex flex-col gap-6">
      <DataSourceBar meta={meta} />

      <KioxiaMarketPanel stock={stock} isLive={meta.stock.state === "external"} />

      <TodaySummaryCard
        today={today}
        isIrLive={meta.ir.state === "live"}
        isMarketLive={meta.stock.state === "external"}
      />

      <PtsPanel />

      <EarningsCountdownPanel earnings={earnings} />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-start">
        <div className="glass-panel p-5 flex items-center justify-center min-h-[220px] text-center">
          <div>
            <span className="mono text-[0.62rem] text-[#f6d365]">DEMO ANALYSIS</span>
            <p className="mt-3 text-sm text-[var(--text-dim)] max-w-xl">
              値動き要因の自動分析は、再配信可能なニュース・市場データソースを選定後に接続します。
            </p>
          </div>
        </div>
        <AnalystPanel />
      </div>

      <NandMarketPanel />

      <ShareholderShortPanel
        data={shareholders}
        margin={margin}
        shortPositions={shortPositions}
      />

      <MyPositionPanel />

      <StatsGrid stats={stock.stats} isLive={meta.stock.state === "external"} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewsList news={stock.news} />
        <OutlookCard />
      </div>
    </div>
  );
}
