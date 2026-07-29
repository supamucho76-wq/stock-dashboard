import type { NandMarketData } from "@/lib/kioxiaData";
import { levelBadgeClass } from "@/lib/levelStyle";

function Row({
  label,
  value,
  badge,
  trend,
}: {
  label: string;
  value: string;
  badge?: boolean;
  trend?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 gap-3">
      <span className="text-xs text-[var(--text-faint)] shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        {badge ? (
          <span className={`px-2 py-0.5 rounded text-xs ${levelBadgeClass(value)}`}>
            {value}
          </span>
        ) : (
          <span className="mono text-sm text-[var(--text)]">{value}</span>
        )}
        {trend && (
          <span className="text-[0.65rem] text-[var(--text-faint)]">（{trend}）</span>
        )}
      </div>
    </div>
  );
}

export default function NandMarketPanel({ nand }: { nand: NandMarketData }) {
  return (
    <div className="glass-panel p-5">
      <h3 className="panel-heading mb-4">NAND市況ダッシュボード</h3>

      {/* 要約バッジ */}
      <div className="flex flex-wrap gap-2 mb-5">
        {nand.summaryLines.map((s) => (
          <span
            key={s.label}
            className={`text-xs px-2.5 py-1 rounded ${levelBadgeClass(s.value)}`}
          >
            {s.label}: {s.value}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-[var(--panel-border)]">
        <div className="flex flex-col divide-y divide-[var(--panel-border)]">
          <Row label="NAND契約価格指数" value={nand.contractPriceIndex.toFixed(1)} />
          <Row label="NANDスポット価格指数" value={nand.spotPriceIndex.toFixed(1)} />
          <Row
            label="前月比"
            value={`${nand.momChangePercent >= 0 ? "+" : ""}${nand.momChangePercent.toFixed(1)}%`}
          />
          <Row
            label="前四半期比"
            value={`${nand.qoqChangePercent >= 0 ? "+" : ""}${nand.qoqChangePercent.toFixed(1)}%`}
          />
          <Row label="価格トレンド" value={nand.priceTrend} badge />
          <Row label="需給バランス" value={nand.supplyBalance} badge />
        </div>
        <div className="flex flex-col divide-y divide-[var(--panel-border)]">
          <Row
            label="メーカー在庫"
            value={nand.makerInventory.level}
            trend={nand.makerInventory.trend}
            badge
          />
          <Row
            label="顧客在庫"
            value={nand.customerInventory.level}
            trend={nand.customerInventory.trend}
            badge
          />
          <Row label="NAND ASP見通し" value={nand.aspOutlook} badge />
          <Row label="ビット出荷量見通し" value={nand.bitShipmentOutlook} badge />
          <Row label="企業向けSSD需要" value={nand.enterpriseSsdDemand} badge />
          <Row label="PC向け需要" value={nand.pcDemand} badge />
          <Row label="スマートフォン向け需要" value={nand.smartphoneDemand} badge />
        </div>
      </div>
    </div>
  );
}
