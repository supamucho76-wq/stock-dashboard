import type { DashboardMeta, DashboardSource } from "@/lib/liveData";

const STATE_STYLE: Record<DashboardSource["state"], string> = {
  live: "border-[rgba(57,255,148,0.35)] bg-[rgba(57,255,148,0.08)] text-[var(--neon-soft)]",
  external: "border-[rgba(67,232,255,0.35)] bg-[rgba(67,232,255,0.08)] text-[var(--cyan)]",
  demo: "border-[rgba(246,211,101,0.35)] bg-[rgba(246,211,101,0.08)] text-[#f6d365]",
  unavailable: "border-[rgba(255,61,113,0.35)] bg-[rgba(255,61,113,0.08)] text-[var(--down)]",
};

const STATE_LABEL: Record<DashboardSource["state"], string> = {
  live: "LIVE",
  external: "EMBED",
  demo: "DEMO",
  unavailable: "FALLBACK",
};

function SourceItem({ source }: { source: DashboardSource }) {
  const content = (
    <>
      <span className={`rounded border px-1.5 py-0.5 text-[0.6rem] font-bold ${STATE_STYLE[source.state]}`}>
        {STATE_LABEL[source.state]}
      </span>
      <span className="text-[0.68rem] text-[var(--text-dim)]">
        <strong className="text-[var(--text)]">{source.label}</strong> · {source.detail}
      </span>
    </>
  );

  return source.url ? (
    <a href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-80">
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-2">{content}</div>
  );
}

export default function DataSourceBar({ meta }: { meta: DashboardMeta }) {
  return (
    <aside className="glass-panel px-4 py-3" aria-label="データソースの状態">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <SourceItem source={meta.stock} />
          <SourceItem source={meta.ir} />
          <SourceItem source={meta.estimates} />
        </div>
        <span className="mono text-[0.62rem] text-[var(--text-faint)] whitespace-nowrap">
          生成: {meta.generatedAt} JST
        </span>
      </div>
    </aside>
  );
}
