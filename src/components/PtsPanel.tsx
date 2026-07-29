const JAPANNEXT_MARKET_URL = "https://www.japannext.co.jp/ja/market";
const JAPANNEXT_TRADING_URL = "https://www.japannext.co.jp/ja/trading";
const JAPANNEXT_TERMS_URL = "https://www.japannext.co.jp/ja/legal";

export default function PtsPanel() {
  return (
    <section className="glass-panel p-5" aria-labelledby="pts-heading">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--cyan)]" />
          <h2 id="pts-heading" className="panel-heading">PTSモニター</h2>
        </div>
        <span className="mono text-[0.58rem] text-[var(--cyan)]">JAPANNEXT PTS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-lg border border-[var(--panel-border)] p-4">
          <p className="text-[0.65rem] text-[var(--text-faint)]">対象銘柄</p>
          <p className="mono text-lg text-[var(--text)] mt-1">285A</p>
          <p className="text-xs text-[var(--neon-soft)] mt-1">キオクシアHD・取扱対象</p>
        </div>
        <div className="rounded-lg border border-[var(--panel-border)] p-4">
          <p className="text-[0.65rem] text-[var(--text-faint)]">デイタイム</p>
          <p className="mono text-lg text-[var(--text)] mt-1">08:20–16:30</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">日本時間・営業日</p>
        </div>
        <div className="rounded-lg border border-[var(--panel-border)] p-4">
          <p className="text-[0.65rem] text-[var(--text-faint)]">ナイトタイム</p>
          <p className="mono text-lg text-[var(--text)] mt-1">17:00–翌06:00</p>
          <p className="text-xs text-[var(--text-faint)] mt-1">日本時間・営業日</p>
        </div>
      </div>

      <div className="rounded-lg border border-[rgba(246,211,101,0.35)] bg-[rgba(246,211,101,0.06)] p-4 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-[#f6d365]">PTS現在値</p>
            <p className="text-lg font-bold text-[var(--text)] mt-1">サイト内表示は準備中</p>
          </div>
          <span className="rounded border border-[rgba(246,211,101,0.35)] px-2 py-1 text-[0.6rem] text-[#f6d365]">
            LICENSE REQUIRED
          </span>
        </div>
        <p className="text-xs text-[var(--text-dim)] leading-relaxed mt-3">
          PTS価格の第三者向け再配信には市場データ契約が必要です。正規ライセンス未契約の状態では数値を転載せず、公式市場または利用中の証券会社で確認できる導線を提供します。
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={JAPANNEXT_MARKET_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-neon text-xs"
        >
          Japannext市場情報を確認 ↗
        </a>
        <a
          href={JAPANNEXT_TRADING_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded border border-[var(--panel-border)] px-3 py-2 text-xs text-[var(--text-dim)] hover:border-[var(--panel-border-strong)]"
        >
          取扱・売買停止情報 ↗
        </a>
        <a
          href={JAPANNEXT_TERMS_URL}
          target="_blank"
          rel="noreferrer"
          className="px-2 py-2 text-xs text-[var(--text-faint)] hover:text-[var(--text-dim)]"
        >
          データ利用条件 ↗
        </a>
      </div>

      <p className="text-[0.65rem] text-[var(--text-faint)] leading-relaxed mt-4">
        ※ PTS価格は運営会社ごとに異なる場合があります。実際の注文価格・気配・約定状況は、ご利用の証券会社で最終確認してください。
      </p>
    </section>
  );
}
