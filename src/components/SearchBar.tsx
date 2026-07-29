"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { isLikelyValidCode } from "@/lib/stockData";

export default function SearchBar({
  size = "lg",
}: {
  size?: "lg" | "sm";
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const code = value.trim();
    if (!isLikelyValidCode(code)) {
      setError("銘柄コードを入力してください（例: 7203）");
      return;
    }
    setError(null);
    router.push(`/stock/${encodeURIComponent(code.toUpperCase())}`);
  }

  const isSm = size === "sm";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`glass-panel glow-border flex items-center gap-2 ${
          isSm ? "p-1.5" : "p-2"
        }`}
      >
        <span className="pl-3 text-lg neon-text select-none">⌕</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="銘柄コードを入力（例: 7203, 6758, 9984）"
          className={`mono flex-1 bg-transparent outline-none placeholder:text-[var(--text-faint)] ${
            isSm ? "text-sm py-1.5" : "text-base py-2.5"
          }`}
          maxLength={10}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className={`btn-neon shrink-0 ${isSm ? "!py-2 !px-4 text-xs" : "text-sm"}`}>
          分析する
        </button>
      </div>
      {error && (
        <p className="mono text-xs text-down mt-2 pl-2">{error}</p>
      )}
    </form>
  );
}
