import type {
  BollingerPoint,
  Candle,
  NewsItem,
  StockData,
  VolumePoint,
} from "./stockData";
import {
  generateKioxiaBundle,
  KIOXIA_CODE,
  type KioxiaBundle,
} from "./kioxiaData";

const KIOXIA_IR_URL = "https://www.kioxia-holdings.com/ja-jp/ir/news.html";
const JQUANTS_BASE_URL = "https://api.jquants.com/v2";
const TOKYO_TIME_ZONE = "Asia/Tokyo";

export type SourceState = "live" | "demo" | "unavailable";

export type DashboardSource = {
  state: SourceState;
  label: string;
  detail: string;
  url?: string;
};

export type DashboardMeta = {
  generatedAt: string;
  stock: DashboardSource;
  ir: DashboardSource;
  estimates: DashboardSource;
};

export type KioxiaDashboardData = KioxiaBundle & {
  meta: DashboardMeta;
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

type JQuantsBar = {
  Date?: unknown;
  O?: unknown;
  H?: unknown;
  L?: unknown;
  C?: unknown;
  Vo?: unknown;
  AdjO?: unknown;
  AdjH?: unknown;
  AdjL?: unknown;
  AdjC?: unknown;
  AdjVo?: unknown;
};

type JQuantsResponse = {
  data?: JQuantsBar[];
  pagination_key?: string;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
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

function calculateBollinger(candles: Candle[]): BollingerPoint[] {
  const period = 20;
  const points: BollingerPoint[] = [];
  for (let index = period - 1; index < candles.length; index += 1) {
    const window = candles.slice(index - period + 1, index + 1).map((item) => item.close);
    const middle = window.reduce((sum, value) => sum + value, 0) / period;
    const variance = window.reduce((sum, value) => sum + (value - middle) ** 2, 0) / period;
    const deviation = Math.sqrt(variance);
    points.push({
      time: candles[index].time,
      upper: Math.round((middle + deviation * 2) * 100) / 100,
      middle: Math.round(middle * 100) / 100,
      lower: Math.round((middle - deviation * 2) * 100) / 100,
    });
  }
  return points;
}

async function getJQuantsStock(fallback: StockData): Promise<StockData | null> {
  const apiKey = process.env.JQUANTS_API_KEY;
  if (!apiKey) return null;

  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 400);
  const params = new URLSearchParams({
    code: KIOXIA_CODE,
    from: formatIsoDate(start),
    to: formatIsoDate(end),
  });

  try {
    const response = await fetch(`${JQUANTS_BASE_URL}/equities/bars/daily?${params}`, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 1_800 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as JQuantsResponse;
    const candles: Candle[] = [];
    const volumes: VolumePoint[] = [];

    for (const item of payload.data ?? []) {
      const time = typeof item.Date === "string" ? item.Date : "";
      const open = toNumber(item.AdjO ?? item.O);
      const high = toNumber(item.AdjH ?? item.H);
      const low = toNumber(item.AdjL ?? item.L);
      const close = toNumber(item.AdjC ?? item.C);
      const volume = toNumber(item.AdjVo ?? item.Vo);
      if (!time || open === null || high === null || low === null || close === null) continue;
      candles.push({ time, open, high, low, close });
      volumes.push({
        time,
        value: volume ?? 0,
        color: close >= open ? "rgba(57, 255, 148, 0.55)" : "rgba(255, 61, 113, 0.55)",
      });
    }

    candles.sort((a, b) => a.time.localeCompare(b.time));
    volumes.sort((a, b) => a.time.localeCompare(b.time));
    if (candles.length < 2) return null;

    const latest = candles[candles.length - 1];
    const previous = candles[candles.length - 2];
    const change = Math.round((latest.close - previous.close) * 100) / 100;
    const changePercent = Math.round((change / previous.close) * 10_000) / 100;
    const visibleCandles = candles.slice(-252);
    const visibleDates = new Set(visibleCandles.map((item) => item.time));
    const visibleVolumes = volumes.filter((item) => visibleDates.has(item.time));
    const averageVolume = visibleVolumes.length
      ? Math.round(visibleVolumes.reduce((sum, item) => sum + item.value, 0) / visibleVolumes.length)
      : 0;

    return {
      ...fallback,
      price: latest.close,
      prevClose: previous.close,
      change,
      changePercent,
      candles: visibleCandles,
      volumes: visibleVolumes,
      bollinger: calculateBollinger(visibleCandles),
      stats: {
        ...fallback.stats,
        high52w: Math.max(...visibleCandles.map((item) => item.high)),
        low52w: Math.min(...visibleCandles.map((item) => item.low)),
        avgVolume: averageVolume,
      },
    };
  } catch {
    return null;
  }
}

export async function getKioxiaDashboardData(): Promise<KioxiaDashboardData> {
  const fallback = generateKioxiaBundle();
  const [liveStock, officialIr] = await Promise.all([
    getJQuantsStock(fallback.stock),
    getOfficialIr(),
  ]);
  const stock = liveStock ?? fallback.stock;
  const news = officialIr?.news.length ? officialIr.news : stock.news;
  stock.news = news;

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
    reasonSummary: liveStock
      ? `直近終値は前営業日比${stock.change >= 0 ? "+" : ""}${stock.change.toLocaleString()}円（${stock.changePercent >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%）です。値動きの背景は、公式開示や信頼できる報道とあわせて確認してください。`
      : "株価APIが未接続のため、値動きと出来高はデモ表示です。J-Quants APIを設定すると実データへ切り替わります。",
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
    meta: {
      generatedAt: new Intl.DateTimeFormat("ja-JP", {
        timeZone: TOKYO_TIME_ZONE,
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
      stock: liveStock
        ? {
            state: "live",
            label: "株価・出来高",
            detail: "J-Quants API（日足・遅延データ）",
            url: "https://www.jpx.co.jp/markets/other-data-services/j-quants-api/index.html",
          }
        : {
            state: "demo",
            label: "株価・出来高",
            detail: process.env.JQUANTS_API_KEY ? "API取得失敗のためデモ表示" : "JQUANTS_API_KEY未設定",
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
        label: "NAND・需給・アナリスト",
        detail: "データソース未接続（デモ表示）",
      },
    },
  };
}
