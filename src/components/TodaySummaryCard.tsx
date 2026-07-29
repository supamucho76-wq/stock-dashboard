import type { TodaySummary } from "@/lib/kioxiaData";
import { levelBadgeClass } from "@/lib/levelStyle";

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[0.65rem] text-[var(--text-faint)]">{label}</span>
      <span className={`px-2.5 py-1 rounded text-xs ${levelBadgeClass(value)}`}>
        {value}
      </span>
    </div>
  );
}

export default function TodaySummaryCard({ today }: { today: TodaySummary }) {
  const isUp = today.change >= 0;

  return (
    <div className="glass-panel glow-border p-6 sm:p-7">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <h2 className="panel-heading !text-[var(--neon)]">
            今日のキオクシア
          </h2>
        </div>
        <span className="text-[0.65rem] text-[var(--text-faint)]">
          <span className="mono">{today.nextEvent.date}</span> 決算まで
          あと<span className="mono">{today.nextEvent.daysUntil}</span>日
        </span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="shrink-0">
          <div className="flex items-end gap-3">
            <span className="mono text-4xl sm:text-5xl font-bold neon-text">
              ¥{today.price.toLocaleString()}
            </span>
            <div
              className={`mono text-sm pb-1.5 ${isUp ? "text-up" : "text-down"}`}
            >
              <div>
                {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
                {today.change.toLocaleString()} ({isUp ? "+" : ""}
                {today.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
          <p className="text-xs text-[var(--text-faint)] mt-1.5">
            出来高 <span className="mono">{today.volume.toLocaleString()}</span> 株
          </p>
        </div>

        <div className="flex-1 flex flex-wrap gap-x-6 gap-y-4">
          <StatBadge label="今日の株価トレンド" value={today.trend} />
          <StatBadge label="NAND市況" value={today.nandMarket} />
          <StatBadge label="需給状況" value={today.supplyDemand} />
          <StatBadge label="総合警戒度" value={today.alertLevel} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          なぜ動いたか（要約）
        </p>
        <p className="text-sm text-[var(--text)] leading-relaxed">
          {today.reasonSummary}
        </p>
      </div>
    </div>
  );
}
