import type { MovementAnalysisData } from "@/lib/liveData";

const TONE_STYLE: Record<MovementAnalysisData["factors"][number]["tone"], string> = {
  up: "text-up",
  down: "text-down",
  neutral: "text-[var(--text)]",
  attention: "text-[#f6d365]",
};

export default function MovementAnalysisPanel({
  analysis,
}: {
  analysis: MovementAnalysisData;
}) {
  const isLive = analysis.state === "live";

  return (
    <section className="glass-panel p-5 sm:p-6" aria-labelledby="movement-analysis-title">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={isLive ? "live-dot" : "demo-dot"} />
            <h2 id="movement-analysis-title" className="panel-heading !text-[var(--neon)]">
              値動き材料チェック
            </h2>
          </div>
          <p className="mt-2 text-sm font-medium text-[var(--text)]">
            {analysis.headline}
          </p>
        </div>
        <span className="mono shrink-0 text-[0.58rem] text-[var(--cyan)]">
          {isLive ? "AUTO · FACT-BASED" : "PARTIAL"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3 gap-3">
        {analysis.factors.map((factor) => (
          <div
            key={factor.label}
            className="rounded-lg border border-[var(--panel-border)] bg-[rgba(255,255,255,0.02)] p-3.5"
          >
            <p className="text-[0.62rem] text-[var(--text-faint)]">{factor.label}</p>
            <p className={`mono mt-1 text-lg ${TONE_STYLE[factor.tone]}`}>{factor.value}</p>
            <p className="mt-1 text-[0.62rem] leading-relaxed text-[var(--text-dim)]">
              {factor.detail}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[var(--text-dim)]">
        {analysis.summary}
      </p>

      {analysis.latestDisclosure && (
        <a
          href={analysis.latestDisclosure.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 block rounded-lg border border-[var(--panel-border)] p-3.5 hover:border-[var(--panel-border-strong)]"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.62rem] text-[var(--neon-soft)]">直近公式IR</span>
            <span className="mono text-[0.58rem] text-[var(--text-faint)]">
              {analysis.latestDisclosure.date}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--text)]">
            {analysis.latestDisclosure.title} ↗
          </p>
        </a>
      )}

      <p className="mt-3 text-[0.58rem] leading-relaxed text-[var(--text-faint)]">
        原因を推測せず、確認できる数値・公式開示・予定だけを整理しています。投資判断には一次情報をご確認ください。
      </p>
    </section>
  );
}
