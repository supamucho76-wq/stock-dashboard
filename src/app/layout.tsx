import type { Metadata } from "next";
import { Orbitron, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "STOCKGRID | 日本株分析ターミナル",
  description:
    "銘柄コードを入力するだけで、株価チャート・出来高・ボリンジャーバンド・アナリスト目標株価・ニュースまで一括表示する日本株分析ダッシュボード。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${orbitron.variable} ${notoSansJp.variable} ${jetBrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-grid">
        <div className="scanline" aria-hidden="true" />
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="brand">
              <span className="brand-mark">⌁</span>
              <span className="brand-text">
                STOCK<span className="brand-accent">GRID</span>
              </span>
            </Link>
            <span className="brand-tagline">
              日本株 銘柄分析ターミナル — MOCK DATA
            </span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="site-footer">
          <p>
            表示データはすべてデモ用のモックデータです。実際の株価・アナリスト情報とは一致しません。投資判断の根拠にはご利用いただけません。
          </p>
        </footer>
      </body>
    </html>
  );
}
