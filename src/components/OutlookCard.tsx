export default function OutlookCard({ outlook }: { outlook: string }) {
  const paragraphs = outlook.split("\n\n");
  return (
    <div className="glass-panel p-5">
      <h3 className="panel-heading mb-4">今後の展望</h3>
      <div className="flex flex-col gap-3">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={`text-sm leading-relaxed ${
              i === paragraphs.length - 1 && paragraphs.length > 1
                ? "mono text-[0.7rem] text-[var(--text-faint)]"
                : "text-[var(--text-dim)]"
            }`}
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
