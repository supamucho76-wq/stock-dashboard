"use client";

import { useEffect, useRef } from "react";

const SYMBOL = "TSE:285A";

function mountWidget(
  container: HTMLDivElement,
  source: string,
  configuration: Record<string, unknown>,
) {
  container.replaceChildren();
  const widget = document.createElement("div");
  widget.className = "tradingview-widget-container__widget h-full";
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = source;
  script.async = true;
  script.textContent = JSON.stringify(configuration);
  container.append(widget, script);
}

export default function TradingViewMarketPanel() {
  const infoRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const info = infoRef.current;
    const chart = chartRef.current;
    if (!info || !chart) return;

    mountWidget(
      info,
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js",
      {
        symbol: SYMBOL,
        width: "100%",
        locale: "ja",
        colorTheme: "dark",
        isTransparent: true,
      },
    );

    mountWidget(
      chart,
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
      {
        autosize: true,
        symbol: SYMBOL,
        interval: "D",
        timezone: "Asia/Tokyo",
        theme: "dark",
        style: "1",
        locale: "ja",
        backgroundColor: "rgba(0, 0, 0, 0)",
        gridColor: "rgba(57, 255, 148, 0.06)",
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        save_image: false,
        calendar: false,
        support_host: "https://www.tradingview.com",
      },
    );

    return () => {
      info.replaceChildren();
      chart.replaceChildren();
    };
  }, []);

  return (
    <section id="market-data" className="glass-panel overflow-hidden" aria-labelledby="market-data-heading">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 id="market-data-heading" className="panel-heading">
            株価・チャート
          </h2>
          <span className="text-[0.65rem] text-[var(--text-faint)]">
            TradingView提供 · 市場により遅延
          </span>
        </div>
        <div ref={infoRef} className="tradingview-widget-container min-h-[165px] mt-2" />
      </div>

      <div ref={chartRef} className="tradingview-widget-container h-[520px] sm:h-[600px]" />

      <p className="px-5 pb-4 text-[0.65rem] text-[var(--text-faint)] leading-relaxed">
        株価データとチャートはTradingViewの公式ウィジェットを利用しています。表示時刻・遅延条件はウィジェット内の表示をご確認ください。
      </p>
    </section>
  );
}
