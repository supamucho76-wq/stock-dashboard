// キオクシア(285A)専用の拡張モックデータ。
// NAND市況・決算カウントダウン・株主/信用需給・今日のサマリーを生成する。
// すべてダミーデータであり、実際の市況・IR情報とは無関係。

import { generateStockData, mulberry32, hashSeed, round2 } from "./stockData";

export const KIOXIA_CODE = "285A";

export type Level3 = "改善" | "横ばい" | "悪化";
export type SentimentLevel = "強気" | "中立" | "弱気";
export type SupplyDemand = "買い優勢" | "中立" | "売り優勢";
export type AlertLevel = "低" | "中" | "高";
export type Strength = "強い" | "普通" | "弱い";
export type Impact = "プラス" | "中立" | "マイナス";
export type Direction = "上昇" | "横ばい" | "下落";
export type SupplyBalance = "供給不足" | "均衡" | "供給過剰";
export type RiskLevel = "高" | "中" | "低";
export type TrendDirection = "増加" | "横ばい" | "減少";

export type TodaySummary = {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  trend: SentimentLevel;
  nandMarket: Level3;
  supplyDemand: SupplyDemand;
  topNews: string;
  nextEvent: { name: string; date: string; daysUntil: number };
  alertLevel: AlertLevel;
  reasonSummary: string;
};

export type NandMarketData = {
  contractPriceIndex: number;
  spotPriceIndex: number;
  momChangePercent: number;
  qoqChangePercent: number;
  priceTrend: Direction;
  supplyBalance: SupplyBalance;
  makerInventory: { level: RiskLevel; trend: TrendDirection };
  customerInventory: { level: RiskLevel; trend: TrendDirection };
  aspOutlook: Direction;
  bitShipmentOutlook: Direction;
  enterpriseSsdDemand: Strength;
  pcDemand: Strength;
  smartphoneDemand: Strength;
  kioxiaImpact: Impact;
  summaryLines: { label: string; value: string }[];
};

export type EarningsEvent = {
  name: string;
  date: string | null;
  daysUntil: number | null;
  category: "kioxia" | "peer" | "shareholder" | "market";
};

export type EarningsCountdown = {
  nextEarningsDate: string;
  daysUntil: number;
  fiscalPeriod: string;
  marketConsensus: { revenueOku: number; opIncomeOku: number };
  companyGuidance: { revenueOku: number; opIncomeOku: number } | null;
  previousResults: {
    revenueOku: number;
    opIncomeOku: number;
    nandAsp: string;
    bitShipment: string;
  };
  keyPoints: string[];
  pastReactions: { date: string; changePercent: number }[];
  upcomingEvents: EarningsEvent[];
};

export type ShareholderData = {
  majorShareholders: { name: string; pct: number; pctChangePts: number }[];
  filings: {
    holder: string;
    date: string;
    pct: number;
    type: "大量保有報告書" | "変更報告書";
  }[];
  secondaryOffering: { summary: string; date: string } | null;
  potentialSellingPressure: RiskLevel;
  marginBuyBalance: number;
  marginSellBalance: number;
  marginRatio: number;
  marginBuyTrend: TrendDirection;
  shortRatio: number;
  institutionalShortBalance: number;
  weekOverWeekChangePercent: number;
  shortCoveringPotential: boolean;
  forcedSellingRisk: RiskLevel;
  summary: {
    majorShareholderSellRisk: RiskLevel;
    marginBuyTrendLabel: TrendDirection;
    shortBalanceLevel: RiskLevel;
    shortTermSupplyDemand: Strength;
    shortCoveringRoom: "あり" | "なし";
  };
};

export type KioxiaBundle = {
  stock: ReturnType<typeof generateStockData>;
  today: TodaySummary;
  nand: NandMarketData;
  earnings: EarningsCountdown;
  shareholders: ShareholderData;
};

const TODAY = new Date("2026-07-29T00:00:00");

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export function generateKioxiaBundle(): KioxiaBundle {
  const stock = generateStockData(KIOXIA_CODE);
  const rng = mulberry32(hashSeed("285A-extended-daily"));

  // --- NAND市況 ---
  const priceTrendRoll = rng();
  const priceTrend: Direction =
    priceTrendRoll < 0.45 ? "上昇" : priceTrendRoll < 0.75 ? "横ばい" : "下落";
  const nandMarket: Level3 =
    priceTrend === "上昇" ? "改善" : priceTrend === "下落" ? "悪化" : "横ばい";
  const supplyBalance: SupplyBalance =
    priceTrend === "上昇" ? "供給不足" : priceTrend === "下落" ? "供給過剰" : "均衡";

  const contractPriceIndex = round2(118 + rng() * 20);
  const spotPriceIndex = round2(contractPriceIndex * (0.92 + rng() * 0.12));
  const momChangePercent = round2(
    priceTrend === "上昇"
      ? 2 + rng() * 6
      : priceTrend === "下落"
      ? -(2 + rng() * 6)
      : (rng() - 0.5) * 2
  );
  const qoqChangePercent = round2(momChangePercent * (2.2 + rng() * 0.8));

  const invLevelRoll = rng();
  const makerInvLevel: RiskLevel =
    priceTrend === "上昇" ? "低" : priceTrend === "下落" ? "高" : invLevelRoll < 0.5 ? "中" : "低";
  const customerInvLevel: RiskLevel =
    priceTrend === "上昇" ? "低" : priceTrend === "下落" ? "高" : "中";

  const enterpriseSsdDemand: Strength =
    rng() < 0.55 ? "強い" : rng() < 0.85 ? "普通" : "弱い";
  const pcDemand: Strength = rng() < 0.35 ? "強い" : rng() < 0.75 ? "普通" : "弱い";
  const smartphoneDemand: Strength = rng() < 0.3 ? "強い" : rng() < 0.7 ? "普通" : "弱い";

  const kioxiaImpact: Impact =
    nandMarket === "改善" ? "プラス" : nandMarket === "悪化" ? "マイナス" : "中立";

  const nand: NandMarketData = {
    contractPriceIndex,
    spotPriceIndex,
    momChangePercent,
    qoqChangePercent,
    priceTrend,
    supplyBalance,
    makerInventory: {
      level: makerInvLevel,
      trend: priceTrend === "上昇" ? "減少" : priceTrend === "下落" ? "増加" : "横ばい",
    },
    customerInventory: {
      level: customerInvLevel,
      trend: priceTrend === "上昇" ? "減少" : priceTrend === "下落" ? "増加" : "横ばい",
    },
    aspOutlook: priceTrend,
    bitShipmentOutlook: enterpriseSsdDemand === "強い" ? "上昇" : "横ばい",
    enterpriseSsdDemand,
    pcDemand,
    smartphoneDemand,
    kioxiaImpact,
    summaryLines: [
      { label: "NAND価格", value: priceTrend },
      { label: "供給状況", value: supplyBalance },
      { label: "企業向けSSD需要", value: enterpriseSsdDemand },
      { label: "キオクシア業績への影響", value: kioxiaImpact },
    ],
  };

  // --- 決算・重要イベント ---
  const nextEarningsDate = addDays(TODAY, 9);
  const prevRevenue = 4300 + Math.round(rng() * 900);
  const prevOp = Math.round(prevRevenue * (0.12 + rng() * 0.1));
  const consensusRevenue = Math.round(prevRevenue * (1 + (rng() - 0.35) * 0.1));
  const consensusOp = Math.round(prevOp * (1 + (rng() - 0.3) * 0.25));

  const pastReactions = [0, 1, 2, 3].map((i) => {
    const d = addDays(nextEarningsDate, -90 * (i + 1));
    return {
      date: fmt(d),
      changePercent: round2((rng() - 0.45) * 14),
    };
  });

  const upcomingEvents: EarningsEvent[] = [
    {
      name: "キオクシア 決算発表",
      date: fmt(nextEarningsDate),
      daysUntil: daysBetween(TODAY, nextEarningsDate),
      category: "kioxia",
    },
    {
      name: "Micron 決算発表",
      date: fmt(addDays(TODAY, 57)),
      daysUntil: 57,
      category: "peer",
    },
    {
      name: "SK hynix 決算発表",
      date: fmt(addDays(TODAY, 86)),
      daysUntil: 86,
      category: "peer",
    },
    {
      name: "Samsung Electronics 決算発表",
      date: fmt(addDays(TODAY, 93)),
      daysUntil: 93,
      category: "peer",
    },
    {
      name: "Investor Day",
      date: fmt(addDays(TODAY, 106)),
      daysUntil: 106,
      category: "kioxia",
    },
    {
      name: "NAND価格予測アップデート（調査会社）",
      date: fmt(addDays(TODAY, 17)),
      daysUntil: 17,
      category: "market",
    },
    {
      name: "大量保有報告書・変更報告書（随時監視）",
      date: null,
      daysUntil: null,
      category: "shareholder",
    },
    {
      name: "大株主の売出し動向（随時監視）",
      date: null,
      daysUntil: null,
      category: "shareholder",
    },
  ];

  const earnings: EarningsCountdown = {
    nextEarningsDate: fmt(nextEarningsDate),
    daysUntil: daysBetween(TODAY, nextEarningsDate),
    fiscalPeriod: "2027年3月期 第1四半期",
    marketConsensus: { revenueOku: consensusRevenue, opIncomeOku: consensusOp },
    companyGuidance:
      rng() < 0.6
        ? {
            revenueOku: Math.round(consensusRevenue * (0.97 + rng() * 0.06)),
            opIncomeOku: Math.round(consensusOp * (0.95 + rng() * 0.1)),
          }
        : null,
    previousResults: {
      revenueOku: prevRevenue,
      opIncomeOku: prevOp,
      nandAsp: nand.priceTrend,
      bitShipment: nand.bitShipmentOutlook,
    },
    keyPoints: [
      "NAND ASP(平均販売価格)が前四半期比でどこまで改善したか",
      "企業向けSSD・データセンター向け需要の回復ペース",
      "通期の設備投資計画・増産方針に変更がないか",
    ],
    pastReactions,
    upcomingEvents,
  };

  // --- 株主・空売り・信用需給 ---
  const secondaryOfferingHappened = rng() < 0.55;
  const secondaryOffering = secondaryOfferingHappened
    ? {
        summary: "大株主（投資ファンド系）による売出しが実施され、需給が一時的に悪化",
        date: fmt(addDays(TODAY, -9)),
      }
    : null;

  const majorShareholders = [
    { name: "東芝株式会社", pct: round2(40.6 + (rng() - 0.5) * 0.4), pctChangePts: 0 },
    {
      name: "BCPE Pangea Cayman, L.P.（Bain Capital関連）",
      pct: round2(11.2 + (rng() - 0.5) * 0.6),
      pctChangePts: secondaryOfferingHappened ? round2(-(0.3 + rng() * 1.2)) : 0,
    },
    { name: "HOYA株式会社", pct: round2(9.9 + (rng() - 0.5) * 0.3), pctChangePts: 0 },
    {
      name: "SKハイニックス株式会社",
      pct: round2(5.0 + (rng() - 0.5) * 0.2),
      pctChangePts: 0,
    },
    {
      name: "日本マスタートラスト信託銀行（信託口）",
      pct: round2(4.1 + rng() * 1.5),
      pctChangePts: round2((rng() - 0.4) * 0.8),
    },
    { name: "個人・その他", pct: round2(10 + rng() * 5), pctChangePts: round2((rng() - 0.5) * 1) },
  ];

  const filings: ShareholderData["filings"] = [
    {
      holder: "BCPE Pangea Cayman, L.P.（Bain Capital関連）",
      date: fmt(addDays(TODAY, -9)),
      pct: majorShareholders[1].pct,
      type: "変更報告書",
    },
    {
      holder: "日本マスタートラスト信託銀行（信託口）",
      date: fmt(addDays(TODAY, -23)),
      pct: majorShareholders[4].pct,
      type: "大量保有報告書",
    },
  ];

  const potentialSellingPressure: RiskLevel = secondaryOfferingHappened
    ? "高"
    : rng() < 0.4
    ? "中"
    : "低";

  const marginBuyBalance = Math.round(3_000_000 + rng() * 4_000_000);
  const marginSellBalance = Math.round(400_000 + rng() * 1_200_000);
  const marginRatio = round2(marginBuyBalance / marginSellBalance);
  const marginBuyTrend: TrendDirection =
    marginRatio > 5 ? "増加" : marginRatio > 2.5 ? "横ばい" : "減少";

  const shortRatio = round2(2 + rng() * 6);
  const institutionalShortBalance = round2(1 + rng() * 4);
  const weekOverWeekChangePercent = round2((rng() - 0.4) * 20);
  const shortCoveringPotential = shortRatio > 5 && weekOverWeekChangePercent < 0;
  const forcedSellingRisk: RiskLevel =
    marginRatio > 6 ? "高" : marginRatio > 3 ? "中" : "低";

  const shareholders: ShareholderData = {
    majorShareholders,
    filings,
    secondaryOffering,
    potentialSellingPressure,
    marginBuyBalance,
    marginSellBalance,
    marginRatio,
    marginBuyTrend,
    shortRatio,
    institutionalShortBalance,
    weekOverWeekChangePercent,
    shortCoveringPotential,
    forcedSellingRisk,
    summary: {
      majorShareholderSellRisk: potentialSellingPressure,
      marginBuyTrendLabel: marginBuyTrend,
      shortBalanceLevel: shortRatio > 5 ? "高" : shortRatio > 3 ? "中" : "低",
      shortTermSupplyDemand:
        marginBuyTrend === "増加" ? "弱い" : marginBuyTrend === "減少" ? "強い" : "普通",
      shortCoveringRoom: shortCoveringPotential ? "あり" : "なし",
    },
  };

  // --- 今日のサマリー（他モジュールの結果を統合して一文要約を生成） ---
  const isDown = stock.change < 0;
  const bigMove = Math.abs(stock.changePercent) >= 3;
  const runUp = stock.changePercent < 0 && stock.candles.length > 5;

  let reasonSummary: string;
  if (isDown && nandMarket !== "悪化" && potentialSellingPressure !== "低") {
    reasonSummary =
      "本日の下落は、NAND市況の悪化ではなく、大株主売却による需給悪化と直近上昇の反動が主因と推定されます。";
  } else if (isDown && nandMarket === "悪化") {
    reasonSummary =
      "本日の下落は、NAND価格の弱含みなど市況悪化を市場が織り込んだ動きが主因と推定されます。";
  } else if (isDown) {
    reasonSummary =
      "本日の下落は、明確な材料が乏しく、地合いや利益確定売りが主因と推定されます。";
  } else if (!isDown && nandMarket === "改善") {
    reasonSummary =
      "本日の上昇は、NAND市況改善への期待と需給引き締まり観測が主因と推定されます。";
  } else if (!isDown && bigMove) {
    reasonSummary =
      "本日の上昇は、需給の急な締まり（ショートカバー含む）が主因の一つと推定されます。";
  } else {
    reasonSummary =
      "本日は明確な方向感を欠く展開で、NAND市況・需給双方に大きな変化は見られないと推定されます。";
  }
  void runUp;

  const trend: SentimentLevel =
    stock.changePercent > 1 ? "強気" : stock.changePercent < -1 ? "弱気" : "中立";

  const supplyDemand: SupplyDemand =
    marginBuyTrend === "増加" && potentialSellingPressure !== "低"
      ? "売り優勢"
      : shortCoveringPotential
      ? "買い優勢"
      : "中立";

  const alertScore =
    (potentialSellingPressure === "高" ? 2 : potentialSellingPressure === "中" ? 1 : 0) +
    (forcedSellingRisk === "高" ? 2 : forcedSellingRisk === "中" ? 1 : 0) +
    (bigMove ? 1 : 0) +
    (nandMarket === "悪化" ? 1 : 0);
  const alertLevel: AlertLevel = alertScore >= 4 ? "高" : alertScore >= 2 ? "中" : "低";

  const today: TodaySummary = {
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: stock.volumes[stock.volumes.length - 1]?.value ?? 0,
    trend,
    nandMarket,
    supplyDemand,
    topNews: stock.news[0]?.title ?? "",
    nextEvent: {
      name: "キオクシア 決算発表",
      date: earnings.nextEarningsDate,
      daysUntil: earnings.daysUntil,
    },
    alertLevel,
    reasonSummary,
  };

  return { stock, today, nand, earnings, shareholders };
}
