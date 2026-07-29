import Link from "next/link";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import StockHeader from "@/components/StockHeader";
import PriceChart from "@/components/PriceChart";
import AnalystPanel from "@/components/AnalystPanel";
import StatsGrid from "@/components/StatsGrid";
import NewsList from "@/components/NewsList";
import OutlookCard from "@/components/OutlookCard";
import { generateStockData, isLikelyValidCode } from "@/lib/stockData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  if (!isLikelyValidCode(code)) {
    return { title: "銘柄が見つかりません | STOCKGRID" };
  }
  const data = generateStockData(code);
  return {
    title: `${data.name}（${data.code}） | STOCKGRID`,
    description: `${data.name}（${data.code}）の株価チャート・出来高・ボリンジャーバンド・アナリスト目標株価・ニュースをまとめて表示。`,
  };
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  if (!isLikelyValidCode(code)) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="glass-panel p-8">
          <p className="text-down mono text-sm mb-4">
            &quot;{code}&quot; は有効な銘柄コードではありません。
          </p>
          <Link href="/" className="btn-neon inline-block text-sm">
            トップに戻る
          </Link>
        </div>
      </div>
    );
  }

  const data = generateStockData(code);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-6">
      <div className="max-w-md">
        <SearchBar size="sm" />
      </div>

      <StockHeader data={data} />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-start">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="panel-heading">
              株価チャート — ローソク足 / ボリンジャーバンド(±2σ) / 出来高
            </h3>
            <div className="flex items-center gap-4 mono text-[0.65rem] text-[var(--text-faint)]">
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
            candles={data.candles}
            volumes={data.volumes}
            bollinger={data.bollinger}
          />
        </div>

        <AnalystPanel analysts={data.analysts} price={data.price} />
      </div>

      <StatsGrid stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewsList news={data.news} />
        <OutlookCard outlook={data.outlook} />
      </div>
    </div>
  );
}
