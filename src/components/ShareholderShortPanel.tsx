import type { ShareholderData } from "@/lib/kioxiaData";
import { levelBadgeClass } from "@/lib/levelStyle";

const OFFICIAL_STOCK_URL =
  "https://www.kioxia-holdings.com/ja-jp/ir/stock/outline.html";

export default function ShareholderShortPanel({
  data,
}: {
  data: ShareholderData;
}) {
  const s = data.summary;

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <h3 className="panel-heading">株主・空売り・信用需給モニター</h3>
        <span className="mono text-[0.58rem] text-[#f6d365]">OFFICIAL + DEMO</span>
      </div>

      {/* 現状サマリー */}
      <p className="text-[0.62rem] text-[#f6d365] mb-2">需給評価は現在DEMOです</p>
      <div className="flex flex-wrap gap-2 mb-6">
        <span className={`text-xs px-2.5 py-1 rounded ${levelBadgeClass(s.majorShareholderSellRisk)}`}>
          大株主売却リスク: {s.majorShareholderSellRisk}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded ${levelBadgeClass(s.marginBuyTrendLabel)}`}>
          信用買い残: {s.marginBuyTrendLabel}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded ${levelBadgeClass(s.shortBalanceLevel)}`}>
          空売り残高: {s.shortBalanceLevel}水準
        </span>
        <span className={`text-xs px-2.5 py-1 rounded ${levelBadgeClass(s.shortTermSupplyDemand)}`}>
          短期需給: {s.shortTermSupplyDemand}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded ${levelBadgeClass(s.shortCoveringRoom)}`}>
          ショートカバー余地: {s.shortCoveringRoom}
        </span>
      </div>

      {/* 主要株主 */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-2.5">
          <p className="text-xs text-[var(--text-faint)]">
            主要株主の保有比率 <span className="text-[var(--neon-soft)]">OFFICIAL・2026年3月31日現在</span>
          </p>
          <a
            href={OFFICIAL_STOCK_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[0.65rem] text-[var(--cyan)] hover:opacity-80"
          >
            公式株式情報 ↗
          </a>
        </div>
        <div className="flex flex-col divide-y divide-[var(--panel-border)]">
          {data.majorShareholders.map((h) => (
            <div key={h.name} className="py-2.5 flex items-center justify-between gap-3 text-sm">
              <span className="text-[var(--text-dim)] truncate">{h.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="mono text-sm text-[var(--text)]">{h.pct.toFixed(1)}%</span>
                {h.pctChangePts !== 0 && (
                  <span
                    className={`mono text-[0.65rem] ${
                      h.pctChangePts > 0 ? "text-up" : "text-down"
                    }`}
                  >
                    ({h.pctChangePts > 0 ? "+" : ""}
                    {h.pctChangePts.toFixed(1)}pt)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 大量保有報告書・売出し */}
      <div className="mb-6">
        <p className="text-xs text-[var(--text-faint)] mb-2.5">
          大量保有報告書・変更報告書 <span className="text-[#f6d365]">DEMO</span>
        </p>
        <div className="flex flex-col divide-y divide-[var(--panel-border)] mb-3">
          {data.filings.map((f, i) => (
            <div key={i} className="py-2 text-sm flex items-center justify-between gap-3">
              <span className="text-[var(--text-dim)] truncate">{f.holder}</span>
              <span className="text-xs text-[var(--text-faint)] shrink-0">
                {f.type} ・ <span className="mono">{f.date}</span> ・{" "}
                <span className="mono">{f.pct.toFixed(1)}%</span>
              </span>
            </div>
          ))}
        </div>
        {data.secondaryOffering ? (
          <div className="rounded-lg border border-[var(--panel-border-strong)] p-3 bg-[rgba(255,61,113,0.05)]">
            <p className="text-xs text-[var(--text)]">
              売出し情報（<span className="mono">{data.secondaryOffering.date}</span>）
            </p>
            <p className="text-sm text-[var(--text-dim)] mt-1">
              {data.secondaryOffering.summary}
            </p>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-faint)]">
            直近の売出し予定は確認されていません。
          </p>
        )}
      </div>

      {/* 信用・空売り指標 */}
      <div>
        <p className="text-xs text-[var(--text-faint)] mb-2.5">
          信用取引・空売り指標 <span className="text-[#f6d365]">DEMO</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">信用買い残</p>
            <p className="mono text-sm text-[var(--text)]">
              {data.marginBuyBalance.toLocaleString()}株
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">信用売り残</p>
            <p className="mono text-sm text-[var(--text)]">
              {data.marginSellBalance.toLocaleString()}株
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">信用倍率</p>
            <p className="mono text-sm text-[var(--text)]">{data.marginRatio.toFixed(1)}倍</p>
          </div>
          <div>
            <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">空売り比率</p>
            <p className="mono text-sm text-[var(--text)]">{data.shortRatio.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">
              機関投資家空売り残高
            </p>
            <p className="mono text-sm text-[var(--text)]">
              {data.institutionalShortBalance.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">前週比</p>
            <p
              className={`mono text-sm ${
                data.weekOverWeekChangePercent >= 0 ? "text-up" : "text-down"
              }`}
            >
              {data.weekOverWeekChangePercent >= 0 ? "+" : ""}
              {data.weekOverWeekChangePercent.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
