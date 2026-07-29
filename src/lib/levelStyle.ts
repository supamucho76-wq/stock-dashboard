// 状態ラベル文字列を色分けバッジのCSSクラスにマッピングする共通ヘルパー。
const POSITIVE = new Set([
  "強気",
  "改善",
  "買い優勢",
  "低",
  "プラス",
  "強い",
  "上昇",
  "供給不足",
  "あり",
  "減少",
]);
const NEGATIVE = new Set([
  "弱気",
  "悪化",
  "売り優勢",
  "高",
  "マイナス",
  "弱い",
  "下落",
  "供給過剰",
  "増加",
]);

export function levelBadgeClass(value: string): string {
  if (POSITIVE.has(value)) return "badge-buy";
  if (NEGATIVE.has(value)) return "badge-sell";
  return "badge-hold";
}
