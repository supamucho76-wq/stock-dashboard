// 銘柄コードから決定論的にモック株価データを生成するモジュール。
// 実データAPIは未接続。同じコードなら常に同じ結果を返す（seeded PRNG）。

export type Candle = {
  time: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
};

export type VolumePoint = {
  time: string;
  value: number;
  color: string;
};

export type BollingerPoint = {
  time: string;
  upper: number;
  middle: number;
  lower: number;
};

export type Rating = "買い" | "中立" | "売り";

export type AnalystFirm = {
  firm: string;
  rating: Rating;
  targetPrice: number;
  updatedAt: string;
};

export type NewsItem = {
  title: string;
  source: string;
  time: string;
  sentiment: "positive" | "neutral" | "negative";
};

export type StockData = {
  code: string;
  name: string;
  market: string;
  sector: string;
  price: number;
  prevClose: number;
  change: number;
  changePercent: number;
  candles: Candle[];
  volumes: VolumePoint[];
  bollinger: BollingerPoint[];
  stats: {
    high52w: number;
    low52w: number;
    per: number;
    pbr: number;
    dividendYield: number;
    marketCapOku: number;
    avgVolume: number;
  };
  analysts: {
    buy: number;
    hold: number;
    sell: number;
    targetAvg: number;
    targetHigh: number;
    targetLow: number;
    firms: AnalystFirm[];
  };
  news: NewsItem[];
  outlook: string;
};

// --- 実在の主要銘柄マスタ（表示用。株価・分析は全てモック） ---
const KNOWN_STOCKS: Record<
  string,
  { name: string; sector: string; basePrice: number }
> = {
  "7203": { name: "トヨタ自動車", sector: "輸送用機器", basePrice: 2900 },
  "6758": { name: "ソニーグループ", sector: "電気機器", basePrice: 3800 },
  "9984": { name: "ソフトバンクグループ", sector: "情報・通信業", basePrice: 10500 },
  "6501": { name: "日立製作所", sector: "電気機器", basePrice: 4200 },
  "8306": { name: "三菱UFJフィナンシャル・グループ", sector: "銀行業", basePrice: 2100 },
  "9432": { name: "日本電信電話", sector: "情報・通信業", basePrice: 165 },
  "4063": { name: "信越化学工業", sector: "化学", basePrice: 4700 },
  "6098": { name: "リクルートホールディングス", sector: "サービス業", basePrice: 8200 },
  "7974": { name: "任天堂", sector: "その他製品", basePrice: 12000 },
  "9433": { name: "KDDI", sector: "情報・通信業", basePrice: 4600 },
  "4755": { name: "楽天グループ", sector: "サービス業", basePrice: 900 },
  "8035": { name: "東京エレクトロン", sector: "電気機器", basePrice: 25000 },
  "6367": { name: "ダイキン工業", sector: "機械", basePrice: 19000 },
  "9983": { name: "ファーストリテイリング", sector: "小売業", basePrice: 48000 },
  "4519": { name: "中外製薬", sector: "医薬品", basePrice: 7200 },
  "6861": { name: "キーエンス", sector: "電気機器", basePrice: 62000 },
  "7267": { name: "本田技研工業", sector: "輸送用機器", basePrice: 1600 },
  "8058": { name: "三菱商事", sector: "卸売業", basePrice: 3600 },
  "6902": { name: "デンソー", sector: "輸送用機器", basePrice: 2200 },
  "4502": { name: "武田薬品工業", sector: "医薬品", basePrice: 4300 },
};

export function getKnownName(code: string): string | undefined {
  return KNOWN_STOCKS[code.trim().toUpperCase()]?.name;
}

export const POPULAR_CODES = [
  "7203",
  "6758",
  "9984",
  "7974",
  "6861",
  "9433",
  "8306",
  "9983",
];

// --- 決定論的疑似乱数 (mulberry32) ---
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ANALYST_FIRMS = [
  "野村證券",
  "大和証券",
  "SMBC日興証券",
  "みずほ証券",
  "ゴールドマン・サックス証券",
  "モルガン・スタンレーMUFG証券",
  "JPモルガン証券",
  "UBS証券",
  "シティグループ証券",
  "岡三証券",
  "東海東京証券",
  "いちよし証券",
];

const NEWS_SOURCES = [
  "日本経済新聞",
  "ロイター",
  "ブルームバーグ",
  "会社四季報オンライン",
  "みんかぶ",
  "Yahoo!ファイナンス",
];

const NEWS_TEMPLATES: { tpl: string; sentiment: NewsItem["sentiment"] }[] = [
  { tpl: "{name}、四半期決算が市場予想を上回り増益", sentiment: "positive" },
  { tpl: "{name}、新製品発表で株価が上昇基調に", sentiment: "positive" },
  { tpl: "{name}、自社株買いと増配を発表", sentiment: "positive" },
  { tpl: "{name}、海外事業拡大で成長期待高まる", sentiment: "positive" },
  { tpl: "{name}の格付け機関による見通しが「安定的」に", sentiment: "neutral" },
  { tpl: "{name}、業界再編観測が浮上", sentiment: "neutral" },
  { tpl: "{name}、機関投資家の保有比率に変化", sentiment: "neutral" },
  { tpl: "{name}、為替変動の影響を注視するとコメント", sentiment: "neutral" },
  { tpl: "{name}、原材料コスト増で利益率に懸念", sentiment: "negative" },
  { tpl: "{name}、一部アナリストが目標株価を引き下げ", sentiment: "negative" },
  { tpl: "{name}、生産計画の一部見直しを発表", sentiment: "negative" },
];

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isLikelyValidCode(code: string): boolean {
  return /^[0-9A-Za-z]{3,5}$/.test(code.trim());
}

export function generateStockData(rawCode: string): StockData {
  const code = rawCode.trim().toUpperCase();
  const rng = mulberry32(hashSeed(code));
  const known = KNOWN_STOCKS[code];
  const name = known?.name ?? `銘柄${code}`;
  const sector = known?.sector ?? "その他";
  const basePrice = known?.basePrice ?? Math.round(300 + rng() * 8000);

  const DAYS = 252; // 約52週分の取引日
  const today = new Date("2026-07-29T00:00:00");
  const dailyVol = 0.012 + rng() * 0.016; // 日次ボラティリティ
  const drift = (rng() - 0.48) * 0.0009; // わずかなトレンド

  const closes: number[] = [];
  const candles: Candle[] = [];
  const volumes: VolumePoint[] = [];

  let price = basePrice * (0.82 + rng() * 0.15);
  const dates: Date[] = [];
  const cursor = new Date(today);
  while (dates.length < DAYS) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) dates.unshift(new Date(cursor));
    cursor.setDate(cursor.getDate() - 1);
  }

  const avgVolume = Math.round((50 + rng() * 400) * 10000);

  for (let i = 0; i < DAYS; i++) {
    const open = price;
    const shock = (rng() - 0.5) * 2 * dailyVol + drift;
    const close = Math.max(open * (1 + shock), 1);
    const high = Math.max(open, close) * (1 + rng() * dailyVol * 0.6);
    const low = Math.min(open, close) * (1 - rng() * dailyVol * 0.6);
    const time = formatDate(dates[i]);

    candles.push({
      time,
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
    });
    closes.push(close);

    const volSpike = 1 + Math.abs(shock) / dailyVol;
    const vol = Math.round(avgVolume * (0.4 + rng() * 0.8) * volSpike);
    volumes.push({
      time,
      value: vol,
      color: close >= open ? "rgba(57, 255, 148, 0.55)" : "rgba(255, 61, 113, 0.55)",
    });

    price = close;
  }

  // ボリンジャーバンド (20日移動平均 ± 2σ)
  const PERIOD = 20;
  const bollinger: BollingerPoint[] = [];
  for (let i = PERIOD - 1; i < closes.length; i++) {
    const window = closes.slice(i - PERIOD + 1, i + 1);
    const sma = window.reduce((a, b) => a + b, 0) / PERIOD;
    const variance =
      window.reduce((a, b) => a + (b - sma) ** 2, 0) / PERIOD;
    const std = Math.sqrt(variance);
    bollinger.push({
      time: candles[i].time,
      upper: round2(sma + 2 * std),
      middle: round2(sma),
      lower: round2(sma - 2 * std),
    });
  }

  const last = candles[candles.length - 1];
  const prevClose = candles[candles.length - 2]?.close ?? last.open;
  const currentPrice = last.close;
  const change = round2(currentPrice - prevClose);
  const changePercent = round2((change / prevClose) * 100);

  const high52w = round2(Math.max(...candles.map((c) => c.high)));
  const low52w = round2(Math.min(...candles.map((c) => c.low)));

  // --- アナリスト評価 ---
  const numFirms = 6 + Math.floor(rng() * 4);
  const shuffledFirms = [...ANALYST_FIRMS]
    .sort(() => rng() - 0.5)
    .slice(0, numFirms);
  const firms: AnalystFirm[] = shuffledFirms.map((firm) => {
    const r = rng();
    const rating: Rating = r < 0.58 ? "買い" : r < 0.85 ? "中立" : "売り";
    const bias = rating === "買い" ? 0.06 : rating === "売り" ? -0.05 : 0.01;
    const targetPrice = round2(
      currentPrice * (1 + bias + (rng() - 0.5) * 0.12)
    );
    const daysAgo = Math.floor(rng() * 20);
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return { firm, rating, targetPrice, updatedAt: formatDate(d) };
  });
  const buy = firms.filter((f) => f.rating === "買い").length;
  const hold = firms.filter((f) => f.rating === "中立").length;
  const sell = firms.filter((f) => f.rating === "売り").length;
  const targets = firms.map((f) => f.targetPrice);
  const targetAvg = round2(targets.reduce((a, b) => a + b, 0) / targets.length);
  const targetHigh = round2(Math.max(...targets));
  const targetLow = round2(Math.min(...targets));

  // --- ニュース ---
  const numNews = 6 + Math.floor(rng() * 3);
  const usedTemplates = [...NEWS_TEMPLATES].sort(() => rng() - 0.5).slice(0, numNews);
  const news: NewsItem[] = usedTemplates.map((t) => {
    const daysAgo = Math.floor(rng() * 14);
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const source = NEWS_SOURCES[Math.floor(rng() * NEWS_SOURCES.length)];
    return {
      title: t.tpl.replace("{name}", name),
      source,
      time: formatDate(d),
      sentiment: t.sentiment,
    };
  });
  news.sort((a, b) => (a.time < b.time ? 1 : -1));

  // --- 展望テキスト ---
  const trendWord = changePercent >= 0 ? "堅調" : "軟調";
  const consensusWord =
    buy > hold + sell ? "強気" : sell > buy ? "弱気" : "中立的";
  const lastBB = bollinger[bollinger.length - 1];
  let bbComment = "ボリンジャーバンドの中心付近で推移しています。";
  if (lastBB) {
    if (currentPrice >= lastBB.upper * 0.98) {
      bbComment = "株価はボリンジャーバンドの上限付近まで上昇しており、短期的な過熱感に注意が必要です。";
    } else if (currentPrice <= lastBB.lower * 1.02) {
      bbComment = "株価はボリンジャーバンドの下限付近まで下落しており、短期的な自律反発の可能性があります。";
    }
  }
  const outlook = `${name}（${code}）の株価は直近${trendWord}に推移しており、前日比${
    change >= 0 ? "+" : ""
  }${change}円（${changePercent >= 0 ? "+" : ""}${changePercent}%）となっています。証券アナリスト${firms.length}名のレーティングは${consensusWord}な見方が優勢で、目標株価コンセンサスは${targetAvg.toLocaleString()}円（レンジ: ${targetLow.toLocaleString()}〜${targetHigh.toLocaleString()}円）です。${bbComment}${sector}セクター全体の動向や為替・金利動向にも引き続き注目が必要です。\n\n※本文はダミーデータに基づく自動生成コメントであり、投資助言ではありません。`;

  return {
    code,
    name,
    market: "東証プライム",
    sector,
    price: round2(currentPrice),
    prevClose: round2(prevClose),
    change,
    changePercent,
    candles,
    volumes,
    bollinger,
    stats: {
      high52w,
      low52w,
      per: round2(8 + rng() * 25),
      pbr: round2(0.6 + rng() * 3),
      dividendYield: round2(rng() * 4),
      marketCapOku: Math.round(800 + rng() * 350000),
      avgVolume,
    },
    analysts: { buy, hold, sell, targetAvg, targetHigh, targetLow, firms },
    news,
    outlook,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
