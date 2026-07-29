import type { TodaySummary } from "@/lib/kioxiaData";

export default function TodaySummaryCard({
  today,
  isIrLive,
  isMarketLive,
}: {
  today: TodaySummary;
  isIrLive: boolean;
  isMarketLive: boolean;
}) {
  const isUp = today.change >= 0;

  return (
    <div className="glass-panel glow-border p-6 sm:p-7">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
        <div className="flex items-center gap-2">
          <span className={isIrLive ? "live-dot" : "demo-dot"} />
          <h2 className="panel-heading !text-[var(--neon)]">
            今日のキオクシア
          </h2>
          <span className="mono text-[0.58rem] text-[var(--text-faint)]">
            {isIrLive ? "公式IR LIVE" : "IR FALLBACK"}
          </span>
        </div>
        <span className="text-[0.65rem] text-[var(--text-faint)]">
          <span className="mono">{today.nextEvent.date}</span> 決算まで
          あと<span className="mono">{today.nextEvent.daysUntil}</span>日
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg border border-[var(--panel-border)] p-4 bg-[rgba(57,255,148,0.04)]">
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">現在値</p>
          <p className="mono text-xl text-[var(--text)]">¥{today.price.toLocaleString("ja-JP")}</p>
          <p className="mt-1 text-[0.58rem] text-[var(--text-faint)]">
            {isMarketLive ? "285A・市場により遅延" : "DEMO"}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--panel-border)] p-4 bg-[rgba(255,255,255,0.02)]">
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">前日比</p>
          <p className={`mono text-xl ${isUp ? "text-up" : "text-down"}`}>
            {isUp ? "+" : ""}{today.change.toLocaleString("ja-JP")}円
          </p>
          <p className={`mono text-xs mt-1 ${isUp ? "text-up" : "text-down"}`}>
            {isUp ? "+" : ""}{today.changePercent.toFixed(2)}%
          </p>
        </div>
        <div className="rounded-lg border border-[var(--panel-border)] p-4 bg-[rgba(255,255,255,0.02)]">
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">出来高</p>
          <p className="mono text-xl text-[var(--text)]">
            {today.volume.toLocaleString("ja-JP")}株
          </p>
          <p className="mt-1 text-[0.58rem] text-[var(--text-faint)]">直近取引日</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-[var(--panel-border)] p-4 bg-[rgba(255,255,255,0.02)]">
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-1.5">
            今日の重要ニュース
          </p>
          <p className="text-sm text-[var(--text)] leading-snug">
            {today.topNews}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--panel-border)] p-4 bg-[rgba(255,255,255,0.02)]">
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-1.5">
            次の重要イベント
          </p>
          <p className="text-sm text-[var(--text)] leading-snug">
            {today.nextEvent.name}（<span className="mono">{today.nextEvent.date}</span>
            ・あと<span className="mono">{today.nextEvent.daysUntil}</span>日）
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[var(--panel-border-strong)] p-4 bg-[rgba(57,255,148,0.05)]">
        <p className="text-[0.65rem] text-[var(--neon-soft)] mb-1.5">
          株価の確認
        </p>
        <p className="text-sm text-[var(--text)] leading-relaxed">
          {today.reasonSummary}
        </p>
        <a
          href="#market-data"
          className="inline-flex mt-2 text-xs text-[var(--cyan)] hover:opacity-80"
        >
          株価・チャートを見る ↓
        </a>
      </div>
    </div>
  );
}
