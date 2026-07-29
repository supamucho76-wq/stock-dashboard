# STOCKGRID

日本株の銘柄コードを入力すると、株価チャート・出来高・ボリンジャーバンド・アナリスト目標株価・ニュース・今後の展望を1画面に集約表示する分析ダッシュボード。

> ⚠️ 現在、表示データはすべて銘柄コードから決定論的に生成した**モックデータ**です（`src/lib/stockData.ts`）。実際の株価・アナリスト情報とは一致しません。

## 技術スタック

- Next.js 16 (App Router / TypeScript / Tailwind CSS v4)
- [lightweight-charts](https://tradingview.github.io/lightweight-charts/) — ローソク足・ボリンジャーバンド・出来高
- デザイン: 黒背景 × ネオングリーンのサイバーテーマ（`src/app/globals.css`）

## ローカル開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開く。`/stock/7203` のように銘柄コード付きURLで各銘柄ページにアクセスできる。

## 本番ビルド確認

```bash
npm run build
```

## デプロイ（Vercel）

1. このリポジトリをGitHubにpushする
2. [vercel.com](https://vercel.com) でGitHubアカウント連携してサインアップ
3. 「New Project」からこのリポジトリをインポート（Next.jsは自動検出されるので設定変更は不要）
4. Deploy

## 実データAPIへの接続（未実装）

現状は`src/lib/stockData.ts`の`generateStockData(code)`がすべてモックデータを返す。実データに差し替える場合の候補:

- **[J-Quants API](https://jpx-jquants.com/)** — JPX（日本取引所グループ）公式、無料プランあり。日本株の株価・財務データ向けで本サイトと相性が良い。要アカウント登録・APIキー発行。
- 目標株価・アナリストレーティング、ニュースは無料APIでは網羅しづらいため、証券会社API等の追加検討が必要になる可能性が高い。

差し替える際は`generateStockData`と同じ戻り値の型（`StockData`型、`src/lib/stockData.ts`で定義）を満たす非同期関数を用意し、`src/app/stock/[code]/page.tsx`の呼び出し箇所を`await`に変更すればコンポーネント側の変更は不要。
