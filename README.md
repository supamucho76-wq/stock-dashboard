# KIOXIA HUB

キオクシアホールディングス（東証プライム: 285A）の保有者専用ダッシュボード。開けば「今日のキオクシアの状況」がすべて分かることを目指した単一銘柄特化サイト。

> ⚠️ キオクシア公式IRニュースと次回決算日は実データです。株価・出来高はJ-Quants API V2を設定すると実データへ切り替わります。NAND市況・株主需給・アナリスト情報など、画面上で`DEMO`と表示される項目は実データではありません。

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

## 実データ連携

`src/lib/liveData.ts`が実データ取得とモックへのフォールバックを担当する。

- **キオクシア公式IR** — [IRニュース一覧](https://www.kioxia-holdings.com/ja-jp/ir/news.html)から最新ニュースと次回決算日を15分ごとに更新。
- **[J-Quants API V2](https://www.jpx.co.jp/markets/other-data-services/j-quants-api/index.html)** — `JQUANTS_API_KEY`がある場合、285Aの日足・出来高・52週高安・平均出来高を30分ごとに更新。APIキーはサーバー側でのみ使用する。
- NAND市況（契約/スポット価格、在庫、需給）は業界専門の調査会社データ（TrendForce等）が必要で、無料API化されていないことが多い。
- 大量保有報告書・信用残高・空売り残高はEDINETや東証の開示情報から取得可能だが、パース・集計の実装が別途必要。

### J-Quantsの設定

1. `.env.example`を`.env.local`へコピーする。
2. J-Quantsダッシュボードで発行したAPIキーを`JQUANTS_API_KEY`へ設定する。
3. VercelではProject Settings → Environment Variablesへ同じ変数を追加して再デプロイする。

公開サイトで市場データを配信する場合は、契約プランの外部配信条件を必ず確認すること。
