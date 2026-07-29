"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  LineStyle,
  type IChartApi,
  type Time,
} from "lightweight-charts";
import type { Candle, VolumePoint, BollingerPoint } from "@/lib/stockData";

export default function PriceChart({
  candles,
  volumes,
  bollinger,
}: {
  candles: Candle[];
  volumes: VolumePoint[];
  bollinger: BollingerPoint[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart: IChartApi = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#83a596",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(57, 255, 148, 0.06)" },
        horzLines: { color: "rgba(57, 255, 148, 0.06)" },
      },
      rightPriceScale: {
        borderColor: "rgba(57, 255, 148, 0.15)",
      },
      timeScale: {
        borderColor: "rgba(57, 255, 148, 0.15)",
      },
      crosshair: {
        vertLine: { color: "rgba(57, 255, 148, 0.35)", labelBackgroundColor: "#0a120e" },
        horzLine: { color: "rgba(57, 255, 148, 0.35)", labelBackgroundColor: "#0a120e" },
      },
      autoSize: true,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#33ff9c",
      downColor: "#ff3d71",
      borderVisible: false,
      wickUpColor: "#33ff9c",
      wickDownColor: "#ff3d71",
    });
    candleSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.05, bottom: 0.28 },
    });
    candleSeries.setData(
      candles.map((c) => ({ ...c, time: c.time as Time }))
    );

    const bbBase = {
      lineWidth: 1 as const,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    };
    const upperSeries = chart.addSeries(LineSeries, {
      ...bbBase,
      color: "rgba(67, 232, 255, 0.6)",
    });
    upperSeries.setData(
      bollinger.map((b) => ({ time: b.time as Time, value: b.upper }))
    );

    const middleSeries = chart.addSeries(LineSeries, {
      ...bbBase,
      color: "rgba(255, 255, 255, 0.3)",
      lineStyle: LineStyle.Dashed,
    });
    middleSeries.setData(
      bollinger.map((b) => ({ time: b.time as Time, value: b.middle }))
    );

    const lowerSeries = chart.addSeries(LineSeries, {
      ...bbBase,
      color: "rgba(67, 232, 255, 0.6)",
    });
    lowerSeries.setData(
      bollinger.map((b) => ({ time: b.time as Time, value: b.lower }))
    );

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
      lastValueVisible: false,
      priceLineVisible: false,
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });
    volumeSeries.setData(
      volumes.map((v) => ({ ...v, time: v.time as Time }))
    );

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [candles, volumes, bollinger]);

  return <div ref={containerRef} className="w-full h-[420px] sm:h-[460px]" />;
}
