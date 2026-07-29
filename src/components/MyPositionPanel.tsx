"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "kioxia-hub-my-position-v1";

type AccountType = "NISA" | "特定口座" | "";

type Position = {
  shares: number;
  avgCost: number;
  accountType: AccountType;
  buyReasonsText: string;
  reasonsValid: boolean[];
  holdConditions: string;
  sellConditions: string;
  addConditions: string;
};

const EMPTY: Position = {
  shares: 0,
  avgCost: 0,
  accountType: "",
  buyReasonsText: "",
  reasonsValid: [],
  holdConditions: "",
  sellConditions: "",
  addConditions: "",
};

function yen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

function parseReasons(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

export default function MyPositionPanel({
  currentPrice,
}: {
  currentPrice: number;
}) {
  const [saved, setSaved] = useState<Position | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Position>(EMPTY);
  const [addShares, setAddShares] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [sellShares, setSellShares] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Position;
        setSaved(parsed);
        setDraft(parsed);
      } else {
        setEditing(true);
      }
    } catch {
      setEditing(true);
    }
  }, []);

  function handleSave() {
    const reasons = parseReasons(draft.buyReasonsText);
    const reasonsValid =
      reasons.length === draft.reasonsValid.length
        ? draft.reasonsValid
        : reasons.map((_, i) => draft.reasonsValid[i] ?? true);
    const next = { ...draft, reasonsValid };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(next);
    setDraft(next);
    setEditing(false);
  }

  function handleClear() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(null);
    setDraft(EMPTY);
    setEditing(true);
  }

  function toggleReason(i: number) {
    if (!saved) return;
    const next = [...saved.reasonsValid];
    next[i] = !next[i];
    const updated = { ...saved, reasonsValid: next };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(updated);
    setDraft(updated);
  }

  if (editing || !saved) {
    return (
      <div className="glass-panel p-5">
        <h3 className="panel-heading mb-4">マイポジション</h3>
        <p className="text-xs text-[var(--text-faint)] mb-5">
          保有状況を入力すると、評価損益や売買判断の条件をこの画面で整理できます（この端末のブラウザにのみ保存され、外部には送信されません）。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-[var(--text-faint)]">保有株数</span>
            <input
              type="number"
              value={draft.shares || ""}
              onChange={(e) =>
                setDraft({ ...draft, shares: Number(e.target.value) })
              }
              className="mono bg-[rgba(255,255,255,0.03)] border border-[var(--panel-border)] rounded px-3 py-2 text-sm outline-none focus:border-[var(--panel-border-strong)]"
              placeholder="100"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-[var(--text-faint)]">平均取得単価（円）</span>
            <input
              type="number"
              value={draft.avgCost || ""}
              onChange={(e) =>
                setDraft({ ...draft, avgCost: Number(e.target.value) })
              }
              className="mono bg-[rgba(255,255,255,0.03)] border border-[var(--panel-border)] rounded px-3 py-2 text-sm outline-none focus:border-[var(--panel-border-strong)]"
              placeholder="2500"
            />
          </label>
        </div>

        <div className="mb-4">
          <span className="text-xs text-[var(--text-faint)]">口座種別</span>
          <div className="flex gap-2 mt-1.5">
            {(["NISA", "特定口座"] as AccountType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDraft({ ...draft, accountType: t })}
                className={`text-xs px-3 py-1.5 rounded border ${
                  draft.accountType === t
                    ? "border-[var(--panel-border-strong)] text-[var(--neon)] bg-[rgba(57,255,148,0.08)]"
                    : "border-[var(--panel-border)] text-[var(--text-faint)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {draft.shares > 0 && draft.avgCost > 0 && (
          <p className="text-xs text-[var(--text-dim)] mb-4">
            投資金額（自動計算）:{" "}
            <span className="mono text-[var(--text)]">
              {yen(draft.shares * draft.avgCost)}
            </span>
          </p>
        )}

        <label className="flex flex-col gap-1.5 mb-4">
          <span className="text-xs text-[var(--text-faint)]">
            買った理由（1行に1項目）
          </span>
          <textarea
            value={draft.buyReasonsText}
            onChange={(e) =>
              setDraft({ ...draft, buyReasonsText: e.target.value })
            }
            rows={3}
            className="bg-[rgba(255,255,255,0.03)] border border-[var(--panel-border)] rounded px-3 py-2 text-sm outline-none focus:border-[var(--panel-border-strong)] resize-y"
            placeholder={"NAND市況の回復期待\n中長期の半導体需要拡大\n配当・株主優待"}
          />
        </label>

        <label className="flex flex-col gap-1.5 mb-4">
          <span className="text-xs text-[var(--text-faint)]">保有を続ける条件</span>
          <textarea
            value={draft.holdConditions}
            onChange={(e) =>
              setDraft({ ...draft, holdConditions: e.target.value })
            }
            rows={2}
            className="bg-[rgba(255,255,255,0.03)] border border-[var(--panel-border)] rounded px-3 py-2 text-sm outline-none focus:border-[var(--panel-border-strong)] resize-y"
          />
        </label>

        <label className="flex flex-col gap-1.5 mb-4">
          <span className="text-xs text-[var(--text-faint)]">売却を検討する条件</span>
          <textarea
            value={draft.sellConditions}
            onChange={(e) =>
              setDraft({ ...draft, sellConditions: e.target.value })
            }
            rows={2}
            className="bg-[rgba(255,255,255,0.03)] border border-[var(--panel-border)] rounded px-3 py-2 text-sm outline-none focus:border-[var(--panel-border-strong)] resize-y"
          />
        </label>

        <label className="flex flex-col gap-1.5 mb-5">
          <span className="text-xs text-[var(--text-faint)]">
            買い増しを検討する条件
          </span>
          <textarea
            value={draft.addConditions}
            onChange={(e) =>
              setDraft({ ...draft, addConditions: e.target.value })
            }
            rows={2}
            className="bg-[rgba(255,255,255,0.03)] border border-[var(--panel-border)] rounded px-3 py-2 text-sm outline-none focus:border-[var(--panel-border-strong)] resize-y"
          />
        </label>

        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-neon text-sm">
            保存する
          </button>
          {saved && (
            <button
              onClick={() => {
                setDraft(saved);
                setEditing(false);
              }}
              className="text-xs text-[var(--text-faint)] px-2"
            >
              キャンセル
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- 表示モード ---
  const currentValue = saved.shares * currentPrice;
  const investedAmount = saved.shares * saved.avgCost;
  const pnl = currentValue - investedAmount;
  const pnlPercent = investedAmount > 0 ? (pnl / investedAmount) * 100 : 0;
  const breakeven = saved.avgCost;
  const upsideToBreakeven =
    currentPrice > 0 ? ((breakeven - currentPrice) / currentPrice) * 100 : 0;

  const scenarios = [-20, -10, -5, 5, 10, 20].map((pct) => {
    const price = currentPrice * (1 + pct / 100);
    const value = saved.shares * price;
    const scenarioPnl = value - investedAmount;
    return { pct, price, scenarioPnl };
  });

  const reasons = parseReasons(saved.buyReasonsText);
  const validCount = saved.reasonsValid.filter(Boolean).length;

  const addSharesNum = Number(addShares) || 0;
  const addPriceNum = Number(addPrice) || 0;
  const newAvgAfterAdd =
    addSharesNum > 0 && addPriceNum > 0
      ? (saved.shares * saved.avgCost + addSharesNum * addPriceNum) /
        (saved.shares + addSharesNum)
      : null;

  const sellSharesNum = Number(sellShares) || 0;
  const remainingAfterSell = Math.max(saved.shares - sellSharesNum, 0);
  const realizedPnlOnSell =
    sellSharesNum > 0 ? sellSharesNum * (currentPrice - saved.avgCost) : null;

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="panel-heading">マイポジション</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-[var(--neon-soft)]"
          >
            編集
          </button>
          <button
            onClick={handleClear}
            className="text-xs text-[var(--text-faint)]"
          >
            削除
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">保有株数</p>
          <p className="mono text-sm text-[var(--text)]">
            {saved.shares.toLocaleString()}株
            {saved.accountType && (
              <span className="text-[0.65rem] text-[var(--text-faint)]">
                （{saved.accountType}）
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">平均取得単価</p>
          <p className="mono text-sm text-[var(--text)]">{yen(saved.avgCost)}</p>
        </div>
        <div>
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">現在の評価額</p>
          <p className="mono text-sm text-[var(--text)]">{yen(currentValue)}</p>
        </div>
        <div>
          <p className="text-[0.65rem] text-[var(--text-faint)] mb-1">評価損益</p>
          <p className={`mono text-sm ${pnl >= 0 ? "text-up" : "text-down"}`}>
            {pnl >= 0 ? "+" : ""}
            {yen(pnl)}（{pnl >= 0 ? "+" : ""}
            {pnlPercent.toFixed(1)}%）
          </p>
        </div>
      </div>

      <div className="mb-6 text-xs text-[var(--text-dim)]">
        損益分岐点: <span className="mono text-[var(--text)]">{yen(breakeven)}</span>
        {"　"}現在株価から損益分岐点までの上昇率:{" "}
        <span className={`mono ${upsideToBreakeven <= 0 ? "text-up" : "text-down"}`}>
          {upsideToBreakeven >= 0 ? "+" : ""}
          {upsideToBreakeven.toFixed(1)}%
        </span>
      </div>

      {/* シナリオ試算 */}
      <div className="mb-6">
        <p className="text-xs text-[var(--text-faint)] mb-2.5">
          株価が動いた場合の損益シミュレーション
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {scenarios.map((s) => (
            <div
              key={s.pct}
              className="rounded-lg border border-[var(--panel-border)] p-2.5 flex flex-col items-center"
            >
              <span className="text-[0.65rem] text-[var(--text-faint)]">
                {s.pct > 0 ? "+" : ""}
                {s.pct}%
              </span>
              <span className="mono text-[0.7rem] text-[var(--text-dim)] mt-0.5">
                {yen(s.price)}
              </span>
              <span
                className={`mono text-xs font-bold mt-1 ${
                  s.scenarioPnl >= 0 ? "text-up" : "text-down"
                }`}
              >
                {s.scenarioPnl >= 0 ? "+" : ""}
                {yen(s.scenarioPnl)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 買い増しシミュレーション */}
      <div className="mb-6 rounded-lg border border-[var(--panel-border)] p-4">
        <p className="text-xs text-[var(--text-faint)] mb-3">
          買い増し後の平均取得単価シミュレーション
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[0.65rem] text-[var(--text-faint)]">追加株数</span>
            <input
              type="number"
              value={addShares}
              onChange={(e) => setAddShares(e.target.value)}
              className="mono bg-[rgba(255,255,255,0.03)] border border-[var(--panel-border)] rounded px-2 py-1.5 text-sm w-28 outline-none"
              placeholder="100"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[0.65rem] text-[var(--text-faint)]">購入単価</span>
            <input
              type="number"
              value={addPrice}
              onChange={(e) => setAddPrice(e.target.value)}
              className="mono bg-[rgba(255,255,255,0.03)] border border-[var(--panel-border)] rounded px-2 py-1.5 text-sm w-28 outline-none"
              placeholder={String(Math.round(currentPrice))}
            />
          </label>
          {newAvgAfterAdd !== null && (
            <p className="text-xs text-[var(--text-dim)]">
              買い増し後の平均取得単価:{" "}
              <span className="mono text-[var(--neon)]">{yen(newAvgAfterAdd)}</span>
              （保有株数 {(saved.shares + addSharesNum).toLocaleString()}株）
            </p>
          )}
        </div>
      </div>

      {/* 一部売却シミュレーション */}
      <div className="mb-6 rounded-lg border border-[var(--panel-border)] p-4">
        <p className="text-xs text-[var(--text-faint)] mb-3">一部売却後の保有状況</p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[0.65rem] text-[var(--text-faint)]">売却株数</span>
            <input
              type="number"
              value={sellShares}
              onChange={(e) => setSellShares(e.target.value)}
              className="mono bg-[rgba(255,255,255,0.03)] border border-[var(--panel-border)] rounded px-2 py-1.5 text-sm w-28 outline-none"
              placeholder="50"
            />
          </label>
          {realizedPnlOnSell !== null && (
            <p className="text-xs text-[var(--text-dim)]">
              売却後の残り保有: {remainingAfterSell.toLocaleString()}株 / 実現損益（現在値ベース）:{" "}
              <span className={`mono ${realizedPnlOnSell >= 0 ? "text-up" : "text-down"}`}>
                {realizedPnlOnSell >= 0 ? "+" : ""}
                {yen(realizedPnlOnSell)}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* 保有理由チェックリスト */}
      {reasons.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-[var(--text-faint)] mb-2.5">
            保有理由{reasons.length}項目のうち、現在
            <span className="mono text-[var(--neon)]">{validCount}</span>
            項目が維持されています。
          </p>
          <div className="flex flex-col gap-2">
            {reasons.map((r, i) => (
              <label
                key={i}
                className="flex items-center gap-2.5 text-sm text-[var(--text-dim)]"
              >
                <input
                  type="checkbox"
                  checked={saved.reasonsValid[i] ?? true}
                  onChange={() => toggleReason(i)}
                  className="accent-[var(--neon)]"
                />
                <span className={saved.reasonsValid[i] ? "" : "line-through opacity-50"}>
                  {r}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <p className="text-[0.65rem] text-[var(--text-faint)] mt-5">
        ※ この機能は売買を推奨するものではありません。ご自身の判断条件を整理するための表示です。
      </p>
    </div>
  );
}
