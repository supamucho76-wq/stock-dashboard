import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const sources = [
  "https://minkabu.jp/stock/285A/analyst_consensus",
  "https://s.minkabu.jp/stock/285A/analyst_consensus",
];
const outputUrl = new URL("../src/lib/analystConsensusSnapshot.json", import.meta.url);

function decodeHtml(value) {
  const named = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"' };
  return value
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
      if (code.startsWith("#x")) return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
      if (code.startsWith("#")) return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
      return named[code.toLowerCase()] ?? entity;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(value) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseConsensus(html, sourceUrl) {
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
    sourceUrl,
  };
}

let nextSnapshot = null;
for (const sourceUrl of sources) {
  try {
    const response = await fetch(sourceUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) continue;
    nextSnapshot = parseConsensus(await response.text(), sourceUrl);
    if (nextSnapshot) break;
  } catch {
    // 次の公開URLを試す。すべて失敗した場合のみ処理を失敗させる。
  }
}

if (!nextSnapshot) {
  throw new Error("アナリストコンセンサスを取得・検証できませんでした。");
}

const previousSnapshot = JSON.parse(await readFile(outputUrl, "utf8"));
const nextJson = `${JSON.stringify(nextSnapshot, null, 2)}\n`;
if (JSON.stringify(previousSnapshot) !== JSON.stringify(nextSnapshot)) {
  await writeFile(outputUrl, nextJson, "utf8");
  console.log(`更新: ${nextSnapshot.asOf} / 目標株価 ${nextSnapshot.targetPrice.toLocaleString()}円`);
} else {
  console.log(`変更なし: ${nextSnapshot.asOf}`);
}

console.log(`出力先: ${fileURLToPath(outputUrl)}`);
