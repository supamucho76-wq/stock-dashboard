import type {
  BollingerPoint,
  Candle,
  NewsItem,
  VolumePoint,
} from "./stockData";
import {
  generateKioxiaBundle,
  type KioxiaBundle,
} from "./kioxiaData";

const KIOXIA_IR_URL = "https://www.kioxia-holdings.com/ja-jp/ir/news.html";
const KIOXIA_YAHOO_CHART_URL =
  "https://query1.finance.yahoo.com/v8/finance/chart/285A.T?range=1y&interval=1d";
const KIOXIA_YAHOO_PAGE_URL = "https://finance.yahoo.co.jp/quote/285A.T/chart";
const KIOXIA_YAHOO_MARGIN_URL =
  "https://finance.yahoo.co.jp/quote/285A.T/history?styl=margin";
const JPX_MARGIN_INDEX_URL =
  "https://www.jpx.co.jp/markets/statistics-equities/margin/05.html";
const JPX_SHORT_POSITION_INDEX_URL =
  "https://www.jpx.co.jp/markets/public/short-selling/index.html";
const MINKABU_ANALYST_CONSENSUS_URL =
  "https://minkabu.jp/stock/285A/analyst_consensus";
const TOKYO_TIME_ZONE = "Asia/Tokyo";
const FY2026_BASIC_EPS = 1_024.07;
const FY2026_BOOK_VALUE_PER_SHARE = 2_561.74;
const FY2026_SHARES_OUTSTANDING = 546_086_290;
const OFFICIAL_MAJOR_SHAREHOLDERS = [
  { name: "株式会社東芝", pct: 17.59, pctChangePts: 0 },
  { name: "BCPE Pangea Cayman2, Ltd.", pct: 14.17, pctChangePts: 0 },
  { name: "BCPE Pangea Cayman 1A, L.P.", pct: 4.91, pctChangePts: 0 },
  { name: "GOLDMAN SACHS INTERNATIONAL", pct: 3.74, pctChangePts: 0 },
  { name: "日本マスタートラスト信託銀行（信託口）", pct: 3.16, pctChangePts: 0 },
  { name: "BNY GCM CLIENT ACCOUNT JPRD AC ISG (FE-AC)", pct: 2.97, pctChangePts: 0 },
  { name: "MSIP CLIENT SECURITIES", pct: 2.26, pctChangePts: 0 },
  { name: "日本カストディ銀行（信託口）", pct: 1.48, pctChangePts: 0 },
  { name: "BCPE Pangea Cayman 1B, L.P.", pct: 1.41, pctChangePts: 0 },
  { name: "BCPE Pangea Cayman, L.P.", pct: 1.38, pctChangePts: 0 },
];

export type SourceState = "live" | "external" | "demo" | "unavailable";

export type DashboardSource = {
  state: SourceState;
  label: string;
  detail: string;
  url?: string;
};

export type DashboardMeta = {
  generatedAt: string;
  stock: DashboardSource;
  pts: DashboardSource;
  ir: DashboardSource;
  estimates: DashboardSource;
};

export type KioxiaDashboardData = KioxiaBundle & {
  meta: DashboardMeta;
  margin: MarginBalanceData;
  shortPositions: ShortPositionSource;
  analystConsensus: AnalystConsensusData;
};

export type MarginBalanceData = {
  asOf: string;
  sellBalance: number;
  buyBalance: number;
  sellChange: number;
  buyChange: number;
  ratio: number;
  sellChangePercent: number;
  buyChangePercent: number;
  sourceUrl: string;
  historyUrl: string;
  state: "live" | "fallback";
  verifiedByJpx: boolean;
};

export type ShortPositionSource = {
  asOf: string;
  sourceUrl: string;
  state: "live" | "fallback";
};

export type AnalystConsensusData = {
  asOf: string | null;
  consensus: string | null;
  targetPrice: number | null;
  previousWeekTargetPrice: number | null;
  ratings: {
    strongBuy: number;
    buy: number;
    neutral: number;
    sell: number;
    strongSell: number;
  } | null;
  sourceUrl: string;
  state: "live" | "unavailable";
};

const FALLBACK_MARGIN_DATA: MarginBalanceData = {
  asOf: "2026-07-24",
  sellBalance: 542_800,
  buyBalance: 11_385_700,
  sellChange: 164_900,
  buyChange: -2_502_200,
  ratio: round2(11_385_700 / 542_800),
  sellChangePercent: round2((164_900 / (542_800 - 164_900)) * 100),
  buyChangePercent: round2((-2_502_200 / (11_385_700 + 2_502_200)) * 100),
  sourceUrl:
    "https://www.jpx.co.jp/markets/statistics-equities/margin/tvdivq0000001rnl-att/syumatsu2026072400.pdf",
  historyUrl: KIOXIA_YAHOO_MARGIN_URL,
  state: "fallback",
  verifiedByJpx: true,
};

const FALLBACK_SHORT_POSITION_SOURCE: ShortPositionSource = {
  asOf: "2026-07-29",
  sourceUrl: JPX_SHORT_POSITION_INDEX_URL,
  state: "fallback",
};

const UNAVAILABLE_ANALYST_CONSENSUS: AnalystConsensusData = {
  asOf: null,
  consensus: null,
  targetPrice: null,
  previousWeekTargetPrice: null,
  ratings: null,
  sourceUrl: MINKABU_ANALYST_CONSENSUS_URL,
  state: "unavailable",
};

type OfficialIrResult = {
  news: NewsItem[];
  nextEarnings?: {
    name: string;
    date: string;
    daysUntil: number;
    fiscalPeriod: string;
  };
};

type MarketChartResult = {
  price: number;
  prevClose: number;
  change: number;
  changePercent: number;
  candles: Candle[];
  volumes: VolumePoint[];
  bollinger: BollingerPoint[];
  high52w: number;
  low52w: number;
  avgVolume: number;
};

type YahooChartPayload = {
  chart?: {
    result?: Array<{
      meta?: {
        symbol?: string;
        regularMarketPrice?: number;
        chartPreviousClose?: number;
        previousClose?: number;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: Array<number | null>;
          high?: Array<number | null>;
          low?: Array<number | null>;
          close?: Array<number | null>;
          volume?: Array<number | null>;
        }>;
      };
    }>;
  };
};

type JpxMarginSource = {
  asOf: string;
  sourceUrl: string;
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function parseNumber(value: string): number | null {
  const normalized = value.replace(/[,+\s]/g, "");
  if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseYahooMarginHtml(html: string): Omit<
  MarginBalanceData,
  "sourceUrl" | "historyUrl" | "state" | "verifiedByJpx"
> | null {
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  for (const row of rows) {
    const cells = [...row[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(
      (cell) => decodeHtml(cell[1]),
    );
    if (cells.length < 6 || !/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(cells[0])) continue;

    const [year, month, day] = cells[0].split("/");
    const sellBalance = parseNumber(cells[1]);
    const buyBalance = parseNumber(cells[2]);
    const sellChange = parseNumber(cells[3]);
    const buyChange = parseNumber(cells[4]);
    const ratio = parseNumber(cells[5]);
    if (
      sellBalance == null ||
      buyBalance == null ||
      sellChange == null ||
      buyChange == null ||
      ratio == null ||
      sellBalance <= 0 ||
      buyBalance <= 0 ||
      Math.abs(buyBalance / sellBalance - ratio) > 0.1
    ) {
      continue;
    }

    const previousSellBalance = sellBalance - sellChange;
    const previousBuyBalance = buyBalance - buyChange;
    return {
      asOf: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
      sellBalance,
      buyBalance,
      sellChange,
      buyChange,
      ratio: round2(ratio),
      sellChangePercent: previousSellBalance
        ? round2((sellChange / previousSellBalance) * 100)
        : 0,
      buyChangePercent: previousBuyBalance
        ? round2((buyChange / previousBuyBalance) * 100)
        : 0,
    };
  }
  return null;
}

function parseLatestJpxMarginSource(html: string): JpxMarginSource | null {
  const matches = [...html.matchAll(/href="([^"]*syumatsu(\d{8})00\.pdf)"/gi)];
  const latest = matches
    .map((match) => ({ href: decodeHtml(match[1]), date: match[2] }))
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!latest) return null;

  return {
    asOf: `${latest.date.slice(0, 4)}-${latest.date.slice(4, 6)}-${latest.date.slice(6, 8)}`,
    sourceUrl: new URL(latest.href, JPX_MARGIN_INDEX_URL).toString(),
  };
}

async function getKioxiaMarginData(): Promise<MarginBalanceData> {
  try {
    const requestOptions = {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "KIOXIA-HUB/1.0 (+https://stock-dashboard-gilt-chi.vercel.app)",
      },
      next: { revalidate: 21_600 },
      signal: AbortSignal.timeout(8_000),
    } as const;
    const [yahooResponse, jpxResponse] = await Promise.all([
      fetch(KIOXIA_YAHOO_MARGIN_URL, requestOptions),
      fetch(JPX_MARGIN_INDEX_URL, requestOptions),
    ]);
    if (!yahooResponse.ok) return FALLBACK_MARGIN_DATA;

    const parsed = parseYahooMarginHtml(await yahooResponse.text());
    if (!parsed) return FALLBACK_MARGIN_DATA;

    const jpxSource = jpxResponse.ok
      ? parseLatestJpxMarginSource(await jpxResponse.text())
      : null;
    const verifiedByJpx = jpxSource?.asOf === parsed.asOf;
    return {
      ...parsed,
      sourceUrl: verifiedByJpx ? jpxSource.sourceUrl : KIOXIA_YAHOO_MARGIN_URL,
      historyUrl: KIOXIA_YAHOO_MARGIN_URL,
      state: "live",
      verifiedByJpx,
    };
  } catch {
    return FALLBACK_MARGIN_DATA;
  }
}

function parseLatestJpxShortPositionSource(html: string): ShortPositionSource | null {
  const matches = [
    ...html.matchAll(/href="([^"]*\/(\d{8})_Short_Positions\.xls)"/gi),
  ];
  const latest = matches
    .map((match) => ({ href: decodeHtml(match[1]), date: match[2] }))
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!latest) return null;

  return {
    asOf: `${latest.date.slice(0, 4)}-${latest.date.slice(4, 6)}-${latest.date.slice(6, 8)}`,
    sourceUrl: new URL(latest.href, JPX_SHORT_POSITION_INDEX_URL).toString(),
    state: "live",
  };
}

async function getLatestJpxShortPositionSource(): Promise<ShortPositionSource> {
  try {
    const response = await fetch(JPX_SHORT_POSITION_INDEX_URL, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "KIOXIA-HUB/1.0 (+https://stock-dashboard-gilt-chi.vercel.app)",
      },
      next: { revalidate: 3_600 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return FALLBACK_SHORT_POSITION_SOURCE;
    return (
      parseLatestJpxShortPositionSource(await response.text()) ??
      FALLBACK_SHORT_POSITION_SOURCE
    );
  } catch {
    return FALLBACK_SHORT_POSITION_SOURCE;
  }
}

export function parseMinkabuAnalystConsensusHtml(
  html: string,
): AnalystConsensusData | null {
  const text = decodeHtml(html);
  const match = text.match(
    /(\d{4}\/\d{2}\/\d{2})時点における、キオクシアに対する、アナリスト判断（コンセンサス）は、([^。]+)。内訳は、強気買い(\d+)人、買い(\d+)人、中立(\d+)人、売り(\d+)人(?:、強気売り(\d+)人)?となっています。アナリストの平均目標株価は([\d,]+)円[^。]*。.*?この１週間で([\d,]+)円から([\d,]+)円/,
  );
  if (!match) return null;

  const [year, month, day] = match[1].split("/");
  const ratings = {
    strongBuy: Number(match[3]),
    buy: Number(match[4]),
    neutral: Number(match[5]),
    sell: Number(match[6]),
    strongSell: Number(match[7] ?? 0),
  };
  const targetPrice = parseNumber(match[8]);
  const previousWeekTargetPrice = parseNumber(match[9]);
  const latestWeeklyTargetPrice = parseNumber(match[10]);
  const ratingCount = Object.values(ratings).reduce((sum, value) => sum + value, 0);
  if (
    targetPrice == null ||
    previousWeekTargetPrice == null ||
    latestWeeklyTargetPrice == null ||
    targetPrice <= 0 ||
    previousWeekTargetPrice <= 0 ||
    ratingCount <= 0 ||
    Math.abs(targetPrice - latestWeeklyTargetPrice) > 2
  ) {
    return null;
  }

  return {
    asOf: `${year}-${month}-${day}`,
    consensus: match[2].trim(),
    targetPrice,
    previousWeekTargetPrice,
    ratings,
    sourceUrl: MINKABU_ANALYST_CONSENSUS_URL,
    state: "live",
  };
}

async function getMinkabuAnalystConsensus(): Promise<AnalystConsensusData> {
  try {
    const response = await fetch(MINKABU_ANALYST_CONSENSUS_URL, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "KIOXIA-HUB/1.0 (+https://stock-dashboard-gilt-chi.vercel.app)",
      },
      next: { revalidate: 21_600 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return UNAVAILABLE_ANALYST_CONSENSUS;
    return (
      parseMinkabuAnalystConsensusHtml(await response.text()) ??
      UNAVAILABLE_ANALYST_CONSENSUS
    );
  } catch {
    return UNAVAILABLE_ANALYST_CONSENSUS;
  }
}

function timestampToTokyoDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TOKYO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp * 1_000));
}

function buildBollinger(candles: Candle[]): BollingerPoint[] {
  const period = 20;
  return candles.slice(period - 1).map((candle, offset) => {
    const index = offset + period - 1;
    const closes = candles.slice(index - period + 1, index + 1).map((item) => item.close);
    const middle = closes.reduce((sum, value) => sum + value, 0) / period;
    const variance = closes.reduce((sum, value) => sum + (value - middle) ** 2, 0) / period;
    const deviation = Math.sqrt(variance);
    return {
      time: candle.time,
      upper: round2(middle + deviation * 2),
      middle: round2(middle),
      lower: round2(middle - deviation * 2),
    };
  });
}

async function getKioxiaMarketChart(): Promise<MarketChartResult | null> {
  try {
    const response = await fetch(KIOXIA_YAHOO_CHART_URL, {
      headers: {
        Accept: "application/json",
        "User-Agent": "KIOXIA-HUB/1.0 (+https://stock-dashboard-gilt-chi.vercel.app)",
      },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;

    const payload = (await response.json()) as YahooChartPayload;
    const result = payload.chart?.result?.[0];
    const quote = result?.indicators?.quote?.[0];
    const timestamps = result?.timestamp ?? [];
    if (result?.meta?.symbol !== "285A.T" || !quote || timestamps.length === 0) return null;

    const candles: Candle[] = [];
    const volumes: VolumePoint[] = [];
    timestamps.forEach((timestamp, index) => {
      const open = quote.open?.[index];
      const high = quote.high?.[index];
      const low = quote.low?.[index];
      const close = quote.close?.[index];
      if (open == null || high == null || low == null || close == null) return;
      const time = timestampToTokyoDate(timestamp);
      candles.push({
        time,
        open: round2(open),
        high: round2(high),
        low: round2(low),
        close: round2(close),
      });
      volumes.push({
        time,
        value: quote.volume?.[index] ?? 0,
        color: close >= open ? "rgba(51,255,156,0.38)" : "rgba(255,61,113,0.38)",
      });
    });
    if (candles.length < 20) return null;

    const closes = candles.map((candle) => candle.close);
    const latestClose = closes.at(-1)!;
    // 日足の直近2本を使い、必ず「直前の取引日終値」と比較する。
    // YahooのchartPreviousCloseは取得期間開始前の値になる場合があるため使用しない。
    const previousClose = closes.at(-2) ?? latestClose;
    const price = result.meta?.regularMarketPrice ?? latestClose;
    const change = price - previousClose;
    const validVolumes = volumes.map((item) => item.value).filter((value) => value > 0);

    return {
      price: round2(price),
      prevClose: round2(previousClose),
      change: round2(change),
      changePercent: previousClose ? round2((change / previousClose) * 100) : 0,
      candles,
      volumes,
      bollinger: buildBollinger(candles),
      high52w: Math.max(...candles.map((candle) => candle.high)),
      low52w: Math.min(...candles.map((candle) => candle.low)),
      avgVolume: validVolumes.length
        ? Math.round(validVolumes.reduce((sum, value) => sum + value, 0) / validVolumes.length)
        : 0,
    };
  } catch {
    return null;
  }
}

function tokyoDateParts(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TOKYO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

function formatIsoDate(date: Date): string {
  const { year, month, day } = tokyoDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysFromToday(dateString: string): number {
  const today = formatIsoDate(new Date());
  const start = Date.parse(`${today}T00:00:00+09:00`);
  const end = Date.parse(`${dateString}T00:00:00+09:00`);
  return Math.ceil((end - start) / 86_400_000);
}

function decodeHtml(value: string): string {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
      if (code.startsWith("#x")) return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
      if (code.startsWith("#")) return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
      return named[code.toLowerCase()] ?? entity;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function classifySentiment(title: string): NewsItem["sentiment"] {
  if (/上方修正|増益|増配|格上げ|採用|最高益|成長|改善|自社株買い/.test(title)) {
    return "positive";
  }
  if (/下方修正|減益|減配|訴訟|訂正|停止|損失|悪化|売出し/.test(title)) {
    return "negative";
  }
  return "neutral";
}

function parseJapaneseDate(value: string): string | null {
  const match = value.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日/);
  if (!match) return null;
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

export function parseKioxiaIrHtml(html: string): OfficialIrResult {
  const starts = [...html.matchAll(/<div\s+class="virticalReverse">/g)]
    .map((match) => match.index)
    .filter((index): index is number => index !== undefined);

  const news: NewsItem[] = [];
  const earningsCandidates: OfficialIrResult["nextEarnings"][] = [];

  for (let index = 0; index < starts.length; index += 1) {
    const block = html.slice(starts[index], starts[index + 1] ?? html.length);
    const anchorTitle = block.match(/<span\s+class="cmp-button__text">([\s\S]*?)<\/span>/i)?.[1];
    const paragraphTitle = block.match(/<div\s+class="text">[\s\S]*?<p>([\s\S]*?)<\/p>/i)?.[1];
    const title = decodeHtml(anchorTitle ?? paragraphTitle ?? "");
    const publishedAt = parseJapaneseDate(decodeHtml(block.match(/<span\s+class="date">([\s\S]*?)<\/span>/i)?.[1] ?? ""));
    const category = decodeHtml(block.match(/<span\s+class="tag__inr">([\s\S]*?)<\/span>/i)?.[1] ?? "IRニュース");
    const href = block.match(/<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<span\s+class="cmp-button__text">/i)?.[1];

    if (title && publishedAt) {
      let url = KIOXIA_IR_URL;
      if (href) {
        try {
          const resolved = new URL(decodeHtml(href), KIOXIA_IR_URL);
          if (resolved.protocol === "https:" || resolved.protocol === "http:") url = resolved.toString();
        } catch {
          url = KIOXIA_IR_URL;
        }
      }

      news.push({
        title,
        source: `キオクシア公式IR · ${category}`,
        time: publishedAt,
        sentiment: classifySentiment(title),
        url,
      });

      const earningsMatch = title.match(/(.+?)\s+決算発表\s*(\d{1,2})月\s*(\d{1,2})日/);
      if (earningsMatch) {
        const announcementYear = Number(publishedAt.slice(0, 4));
        const announcementMonth = Number(publishedAt.slice(5, 7));
        const eventMonth = Number(earningsMatch[2]);
        const eventYear = eventMonth < announcementMonth ? announcementYear + 1 : announcementYear;
        const eventDate = `${eventYear}-${String(eventMonth).padStart(2, "0")}-${earningsMatch[3].padStart(2, "0")}`;
        const daysUntil = daysFromToday(eventDate);
        if (daysUntil >= 0) {
          earningsCandidates.push({
            name: "キオクシア 決算発表",
            date: eventDate,
            daysUntil,
            fiscalPeriod: earningsMatch[1].trim(),
          });
        }
      }
    }
  }

  earningsCandidates.sort((a, b) => (a?.date ?? "").localeCompare(b?.date ?? ""));
  return { news: news.slice(0, 8), nextEarnings: earningsCandidates[0] };
}

async function getOfficialIr(): Promise<OfficialIrResult | null> {
  try {
    const response = await fetch(KIOXIA_IR_URL, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "KIOXIA-HUB/1.0 (+https://stock-dashboard-gilt-chi.vercel.app)",
      },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;
    const parsed = parseKioxiaIrHtml(await response.text());
    return parsed.news.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export async function getKioxiaDashboardData(): Promise<KioxiaDashboardData> {
  const fallback = generateKioxiaBundle();
  const [officialIr, marketChart, margin, shortPositions, analystConsensus] =
    await Promise.all([
      getOfficialIr(),
      getKioxiaMarketChart(),
      getKioxiaMarginData(),
      getLatestJpxShortPositionSource(),
      getMinkabuAnalystConsensus(),
    ]);
  const stock = fallback.stock;
  if (marketChart) {
    stock.price = marketChart.price;
    stock.prevClose = marketChart.prevClose;
    stock.change = marketChart.change;
    stock.changePercent = marketChart.changePercent;
    stock.candles = marketChart.candles;
    stock.volumes = marketChart.volumes;
    stock.bollinger = marketChart.bollinger;
    stock.stats.high52w = marketChart.high52w;
    stock.stats.low52w = marketChart.low52w;
    stock.stats.avgVolume = marketChart.avgVolume;
    stock.stats.per = round2(marketChart.price / FY2026_BASIC_EPS);
    stock.stats.pbr = round2(marketChart.price / FY2026_BOOK_VALUE_PER_SHARE);
    stock.stats.dividendYield = 0;
    stock.stats.marketCapOku = Math.round(
      (marketChart.price * FY2026_SHARES_OUTSTANDING) / 100_000_000,
    );
  }
  const news = officialIr?.news.length ? officialIr.news : stock.news;
  stock.news = news;
  fallback.shareholders.majorShareholders = OFFICIAL_MAJOR_SHAREHOLDERS;
  fallback.shareholders.marginSellBalance = margin.sellBalance;
  fallback.shareholders.marginBuyBalance = margin.buyBalance;
  fallback.shareholders.marginRatio = margin.ratio;
  fallback.shareholders.weekOverWeekChangePercent = margin.buyChangePercent;

  const today = {
    ...fallback.today,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: stock.volumes[stock.volumes.length - 1]?.value ?? 0,
    trend: (stock.changePercent > 1 ? "強気" : stock.changePercent < -1 ? "弱気" : "中立") as
      | "強気"
      | "中立"
      | "弱気",
    topNews: news[0]?.title ?? fallback.today.topNews,
    reasonSummary:
      marketChart
        ? "キオクシア(285A)の株価チャートを表示しています。値動きの背景は、公式開示や信頼できる報道とあわせて確認してください。"
        : "株価データを取得できなかったため、チャートはデモ表示です。投資判断には使用しないでください。",
  };

  const earnings = {
    ...fallback.earnings,
    upcomingEvents: [...fallback.earnings.upcomingEvents],
  };
  if (officialIr?.nextEarnings) {
    earnings.nextEarningsDate = officialIr.nextEarnings.date;
    earnings.daysUntil = officialIr.nextEarnings.daysUntil;
    earnings.fiscalPeriod = officialIr.nextEarnings.fiscalPeriod;
    earnings.upcomingEvents = earnings.upcomingEvents.map((event) =>
      event.category === "kioxia" && event.name.includes("決算発表")
        ? {
            ...event,
            name: officialIr.nextEarnings!.name,
            date: officialIr.nextEarnings!.date,
            daysUntil: officialIr.nextEarnings!.daysUntil,
          }
        : event,
    );
    today.nextEvent = {
      name: officialIr.nextEarnings.name,
      date: officialIr.nextEarnings.date,
      daysUntil: officialIr.nextEarnings.daysUntil,
    };
  }

  return {
    ...fallback,
    stock,
    today,
    earnings,
    margin,
    shortPositions,
    analystConsensus,
    meta: {
      generatedAt: new Intl.DateTimeFormat("ja-JP", {
        timeZone: TOKYO_TIME_ZONE,
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
      stock: {
        state: marketChart ? "external" : "demo",
        label: "株価・チャート",
        detail: marketChart
          ? "Yahoo Finance株価 + 公式決算指標（市場により遅延）"
          : "外部データ取得失敗のためデモ表示",
        url: KIOXIA_YAHOO_PAGE_URL,
      },
      pts: {
        state: "external",
        label: "PTS",
        detail: "Japannext公式確認（価格再配信は未契約）",
        url: "https://www.japannext.co.jp/ja/market",
      },
      ir: officialIr
        ? {
            state: "live",
            label: "IRニュース・決算日",
            detail: "キオクシアホールディングス公式IR",
            url: KIOXIA_IR_URL,
          }
        : {
            state: "unavailable",
            label: "IRニュース・決算日",
            detail: "公式IR取得失敗のためデモ表示",
            url: KIOXIA_IR_URL,
          },
      estimates: {
        state: "demo",
        label: "値動き要因の自動分析",
        detail: "ニュース分析のみDEMO・その他は公式ソースへ更新済み",
      },
    },
  };
}
