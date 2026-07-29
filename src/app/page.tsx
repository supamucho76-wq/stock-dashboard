import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { POPULAR_CODES, getKnownName } from "@/lib/stockData";

const FEATURES = [
  { icon: "📈", title: "株価チャート", desc: "ローソク足チャートで値動きを一目で把握" },
  { icon: "📊", title: "出来高分析", desc: "売買の勢いを出来高ヒストグラムで確認" },
  { icon: "⚡", title: "ボリンジャーバンド", desc: "±2σバンドで過熱・売られすぎを可視化" },
  { icon: "🎯", title: "アナリスト目標株価", desc: "証券各社のレーティングと目標株価を集約" },
  { icon: "📰", title: "関連ニュース", desc: "銘柄に関する最新ニュースをまとめて表示" },
  { icon: "🧭", title: "今後の展望", desc: "テクニカル・コンセンサスをもとにした展望コメント" },
];

export default function Home() {
  return (
    <div className="max-w-[1400px] mx-auto px-6">
      <section className="pt-20 pb-14 text-center flex flex-col items-center">
        <div className="mono text-xs tracking-[0.3em] text-[var(--neon-soft)] mb-5 flex items-center gap-2">
          <span className="live-dot" />
          日本株 分析ターミナル — DEMO BUILD
        </div>
        <h1 className="display-font font-800 text-[clamp(2.2rem,6vw,4.5rem)] leading-[1.05] tracking-tight">
          <span className="neon-text">1</span>銘柄、
          <br className="sm:hidden" />
          <span className="neon-text">全</span>情報。
        </h1>
        <p className="mt-6 max-w-xl text-[var(--text-dim)] leading-relaxed">
          銘柄コードを入力するだけで、株価・出来高・ボリンジャーバンド・アナリスト目標株価・ニュース・今後の展望まで、
          1つの画面で一括表示します。
        </p>

        <div className="mt-10 w-full max-w-xl">
          <SearchBar />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="mono text-xs text-[var(--text-faint)] mr-1">
            人気銘柄:
          </span>
          {POPULAR_CODES.map((code) => (
            <Link key={code} href={`/stock/${code}`} className="chip">
              {code} {getKnownName(code)}
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-panel p-6">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="display-font text-sm tracking-wide mb-2 text-[var(--text)]">
                {f.title}
              </h3>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="glass-panel p-6 mono text-xs text-[var(--text-faint)] leading-relaxed">
          ※ 本サイトで表示される株価・出来高・アナリスト評価・ニュースは全てデモ用に自動生成されたモックデータです。
          実際の市場データとは一切関係がなく、投資判断の参考にはなりません。
        </div>
      </section>
    </div>
  );
}
