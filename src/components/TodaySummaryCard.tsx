import type { TodaySummary } from "@/lib/kioxiaData";

export default function TodaySummaryCard({
  today,
  isLive,
}: {
  today: TodaySummary;
  isLive: boolean;
}) {
  return (
    <div className="glass-panel glow-border p-6 sm:p-7">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
        <div className="flex items-center gap-2">
          <span className={isLive ? "live-dot" : "demo-dot"} />
          <h2 className="panel-heading !text-[var(--neon)]">
            今日のキオクシア
          </h2>
          <span className="mono text-[0.58rem] text-[var(--text-faint)]">
            {isLive ? "公式IR LIVE" : "IR FALLBACK"}
          </span>
        </div>
        <span className="text-[0.65rem] text-[var(--text-faint)]">
          <span className="mono">{today.nextEvent.date}</span> 決算まで
          あと<span className="mono">{today.nextEvent.daysUntil}</span>日
        </span>
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
