import type { EarningsCountdown } from "@/lib/kioxiaData";

const RESULTS_URL =
  "https://www2.jpx.co.jp/disc/285A0/140120260515537803.pdf";
const IR_HIGHLIGHTS_URL =
  "https://www.kioxia-holdings.com/ja-jp/ir/earnings/highlights.html";
const IR_CALENDAR_URL =
  "https://www.kioxia-holdings.com/ja-jp/ir/calendar.html";

const results = [
  { label: "売上収益", previous: 17_065, latest: 23_376, yoy: 37.0 },
  { label: "営業利益", previous: 4_517, latest: 8_704, yoy: 92.7 },
  { label: "当期利益", previous: 2_723, latest: 5_545, yoy: 103.6 },
];

const segments = [
  { label: "SSD & ストレージ", previous: 9_911, latest: 13_626, yoy: 37.5 },
  { label: "スマートデバイス", previous: 5_011, latest: 7_600, yoy: 51.6 },
  { label: "その他", previous: 2_142, latest: 2_150, yoy: 0.4 },
];

function oku(value: number) {
  return `${value.toLocaleString()}億円`;
}

export default function EarningsCountdownPanel({
  earnings,
}: {
  earnings: EarningsCountdown;
}) {
  return (
    <section className="glass-panel p-5" aria-labelledby="earnings-heading">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <h3 id="earnings-heading" className="panel-heading">
            決算実績・次回決算
          </h3>
          <span className="mono text-[0.58rem] text-[var(--neon-soft)]">OFFICIAL</span>
        </div>
        <span className="text-xs text-[var(--text-dim)]">{earnings.fiscalPeriod}</span>
      </div>

      <div className="flex items-center gap-4 mb-7">
        <div className="glass-panel px-5 py-4 flex flex-col items-center border-[var(--panel-border-strong)]">
          <span className="mono text-3xl font-bold neon-text">{earnings.daysUntil}</span>
          <span className="text-[0.65rem] text-[var(--text-faint)] mt-1">
            決算まであと（日）
          </span>
        </div>
        <div>
          <p className="text-sm text-[var(--text)]">次回決算発表日</p>
          <p className="mono text-lg neon-text">{earnings.nextEarningsDate}</p>
          <a
            href={IR_CALENDAR_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80"
          >
            公式IRカレンダー ↗
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <div>
          <p className="text-xs text-[var(--neon-soft)]">2026年3月期 通期実績</p>
          <p className="text-[0.65rem] text-[var(--text-faint)] mt-1">
            2026年5月15日発表・IFRS連結
          </p>
        </div>
        <a
          href={RESULTS_URL}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[var(--cyan)] hover:opacity-80"
        >
          公式決算短信を見る ↗
        </a>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--panel-border)] mb-6">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-[rgba(57,255,148,0.05)] text-[var(--text-faint)]">
            <tr>
              <th className="text-left font-normal px-4 py-3">指標</th>
              <th className="text-right font-normal px-4 py-3">2025年3月期</th>
              <th className="text-right font-normal px-4 py-3">2026年3月期</th>
              <th className="text-right font-normal px-4 py-3">前期比</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--panel-border)]">
            {results.map((item) => (
              <tr key={item.label}>
                <th className="text-left font-normal px-4 py-3 text-[var(--text-dim)]">
                  {item.label}
                </th>
                <td className="mono text-right px-4 py-3 text-[var(--text-faint)]">
                  {oku(item.previous)}
                </td>
                <td className="mono text-right px-4 py-3 text-[var(--text)]">
                  {oku(item.latest)}
                </td>
                <td className="mono text-right px-4 py-3 text-up">+{item.yoy.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {segments.map((segment) => (
          <div key={segment.label} className="rounded-lg border border-[var(--panel-border)] p-4">
            <p className="text-[0.65rem] text-[var(--text-faint)]">{segment.label}</p>
            <p className="mono text-lg text-[var(--text)] mt-1">{oku(segment.latest)}</p>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              前期 {oku(segment.previous)} / <span className="text-up">+{segment.yoy.toFixed(1)}%</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-[var(--panel-border)] p-4">
          <p className="text-xs text-[var(--neon-soft)] mb-2">実績から分かること</p>
          <ul className="text-sm text-[var(--text-dim)] space-y-1.5">
            <li>・売上収益は前期比37.0%増</li>
            <li>・営業利益は前期比92.7%増、営業利益率は約37.2%</li>
            <li>・スマートデバイス売上が前期比51.6%増</li>
          </ul>
        </div>
        <div className="rounded-lg border border-[var(--panel-border)] p-4">
          <p className="text-xs text-[var(--neon-soft)] mb-2">次回決算で確認する項目</p>
          <ul className="text-sm text-[var(--text-dim)] space-y-1.5">
            <li>・NAND ASPとビット出荷量の前四半期比</li>
            <li>・データセンター／エンタープライズSSD需要</li>
            <li>・設備投資、生産計画、通期見通しの更新</li>
          </ul>
        </div>
      </div>

      <a
        href={IR_HIGHLIGHTS_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex mt-4 text-xs text-[var(--cyan)] hover:opacity-80"
      >
        キオクシア公式「業績ハイライト」へ ↗
      </a>
    </section>
  );
}
