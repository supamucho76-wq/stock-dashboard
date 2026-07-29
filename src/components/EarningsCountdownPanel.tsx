import type { EarningsCountdown } from "@/lib/kioxiaData";

function oku(n: number): string {
  return `${n.toLocaleString()}億円`;
}

const CATEGORY_LABEL: Record<string, string> = {
  kioxia: "キオクシア",
  peer: "競合",
  market: "市況",
  shareholder: "株主",
};

export default function EarningsCountdownPanel({
  earnings,
}: {
  earnings: EarningsCountdown;
}) {
  const g = earnings.companyGuidance;

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
        <h3 className="panel-heading">次回決算・重要イベント</h3>
        <span className="text-xs text-[var(--text-dim)]">{earnings.fiscalPeriod}</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="glass-panel px-5 py-4 flex flex-col items-center border-[var(--panel-border-strong)]">
          <span className="mono text-3xl font-bold neon-text">
            {earnings.daysUntil}
          </span>
          <span className="text-[0.65rem] text-[var(--text-faint)] mt-1">
            決算まであと（日）
          </span>
        </div>
        <div>
          <p className="text-sm text-[var(--text)]">次回決算発表日</p>
          <p className="mono text-lg neon-text">{earnings.nextEarningsDate}</p>
        </div>
      </div>

      {/* 予想 vs 実績 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-[var(--panel-border)] p-4">
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-2">前回実績</p>
          <p className="mono text-sm text-[var(--text)]">
            売上高 {oku(earnings.previousResults.revenueOku)}
          </p>
          <p className="mono text-sm text-[var(--text)]">
            営業利益 {oku(earnings.previousResults.opIncomeOku)}
          </p>
          <p className="text-xs text-[var(--text-dim)] mt-1.5">
            NAND ASP: {earnings.previousResults.nandAsp} / ビット出荷:{" "}
            {earnings.previousResults.bitShipment}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--panel-border)] p-4">
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-2">市場予想</p>
          <p className="mono text-sm text-[var(--text)]">
            売上高 {oku(earnings.marketConsensus.revenueOku)}
          </p>
          <p className="mono text-sm text-[var(--text)]">
            営業利益 {oku(earnings.marketConsensus.opIncomeOku)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--panel-border)] p-4">
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-2">会社予想</p>
          {g ? (
            <>
              <p className="mono text-sm text-[var(--text)]">
                売上高 {oku(g.revenueOku)}
              </p>
              <p className="mono text-sm text-[var(--text)]">
                営業利益 {oku(g.opIncomeOku)}
              </p>
            </>
          ) : (
            <p className="text-xs text-[var(--text-faint)]">非開示</p>
          )}
        </div>
      </div>

      {/* 今回の決算で見るべきポイント */}
      <div className="mb-6">
        <p className="text-xs text-[var(--neon-soft)] mb-2">
          今回の決算で確認すべき3項目
        </p>
        <ul className="flex flex-col gap-1.5">
          {earnings.keyPoints.map((k, i) => (
            <li key={i} className="text-sm text-[var(--text-dim)] flex gap-2">
              <span className="mono text-[var(--neon)] shrink-0">{i + 1}.</span>
              {k}
            </li>
          ))}
        </ul>
      </div>

      {/* 決算後の株価変動履歴 */}
      <div className="mb-6">
        <p className="text-xs text-[var(--text-faint)] mb-2">
          決算発表後の過去の株価変動
        </p>
        <div className="flex gap-3 flex-wrap">
          {earnings.pastReactions.map((r) => (
            <div
              key={r.date}
              className="rounded-lg border border-[var(--panel-border)] px-3 py-2 flex flex-col items-center min-w-[88px]"
            >
              <span className="mono text-[0.65rem] text-[var(--text-faint)]">
                {r.date}
              </span>
              <span
                className={`mono text-sm font-bold ${
                  r.changePercent >= 0 ? "text-up" : "text-down"
                }`}
              >
                {r.changePercent >= 0 ? "+" : ""}
                {r.changePercent.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 重要イベント一覧 */}
      <div>
        <p className="text-xs text-[var(--text-faint)] mb-2.5">重要イベント一覧</p>
        <div className="flex flex-col divide-y divide-[var(--panel-border)]">
          {earnings.upcomingEvents.map((e) => (
            <div
              key={e.name}
              className="py-2.5 flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[0.6rem] px-1.5 py-0.5 rounded border border-[var(--panel-border)] text-[var(--text-faint)] shrink-0">
                  {CATEGORY_LABEL[e.category]}
                </span>
                <span className="text-[var(--text-dim)] truncate">{e.name}</span>
              </div>
              {e.date ? (
                <span className="mono text-xs text-[var(--text-faint)] shrink-0">
                  {e.date}（あと{e.daysUntil}日）
                </span>
              ) : (
                <span className="text-xs text-[var(--text-faint)] shrink-0">
                  随時監視
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
