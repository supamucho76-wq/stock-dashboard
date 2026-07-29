# KIOXIA HUB

キオクシアホールディングス（東証プライム: 285A）の保有者専用ダッシュボード。開けば「今日のキオクシアの状況」がすべて分かることを目指した単一銘柄特化サイト。

> ⚠️ 現在、表示データはすべて決定論的に生成した**モックデータ**です（`src/lib/stockData.ts` / `src/lib/kioxiaData.ts`）。実際の株価・NAND市況・株主構成・IR情報とは一致しません。

## 主な機能

- **今日のキオクシア** — 株価・出来高・トレンド・NAND市況・需給・警戒度・値動きの一文要約を最上部に集約
- 株価チャート（ローソク足 / ボリンジャーバンド±2σ / 出来高、lightweight-charts）
- アナリスト評価（買い/中立/売り分布、目標株価レンジ、証券会社別レーティング）
- **NAND市況ダッシュボード** — 契約/スポット価格、需給、在庫、用途別需要、業績インパクト
- **決算・重要イベントカウントダウン** — 次回決算日、市場予想/会社予想/前回実績、決算後の株価変動履歴、Micron/SK hynix/Samsung決算などの関連イベント
- **株主・空売り・信用需給モニター** — 主要株主比率、大量保有報告書、信用倍率、空売り比率、ショートカバー余地
- **マイポジション** — 保有株数・取得単価を入力し、評価損益・損益分岐点・シナリオ試算・買い増し/一部売却シミュレーション・保有理由チェックリストを表示（ブラウザのlocalStorageにのみ保存、外部送信なし。売買を推奨する機能ではない）

## 技術スタック

- Next.js 16 (App Router / TypeScript / Tailwind CSS v4)
- [lightweight-charts](https://tradingview.github.io/lightweight-charts/)
- デザイン: 黒背景 × ネオングリーンのサイバーテーマ（`src/app/globals.css`）

## ローカル開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開く。

## 本番ビルド確認

```bash
npm run build
```

## デプロイ（Vercel）

GitHubリポジトリ連携済み。`main`ブランチへのpushで自動的に再デプロイされる。

## 実データAPIへの接続（未実装）

現状は`src/lib/stockData.ts`の`generateStockData("285A")`と`src/lib/kioxiaData.ts`の`generateKioxiaBundle()`がすべてモックデータを返す。実データに差し替える場合の候補:

- **[J-Quants API](https://jpx-jquants.com/)** — JPX公式、無料プランあり。株価・出来高・財務データ向け。
- NAND市況（契約/スポット価格、在庫、需給）は業界専門の調査会社データ（TrendForce等）が必要で、無料API化されていないことが多い。
- 大量保有報告書・信用残高・空売り残高はEDINETや東証の開示情報から取得可能だが、パース・集計の実装が別途必要。

差し替える際は各生成関数と同じ戻り値の型を満たす非同期関数を用意し、`src/app/page.tsx`の呼び出し箇所を`await`に変更すればコンポーネント側の変更は不要。
