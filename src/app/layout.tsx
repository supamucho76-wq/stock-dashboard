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
  title: "KIOXIA HUB | キオクシア(285A) 専用分析ターミナル",
  description:
    "キオクシアホールディングス(285A)保有者向けの専用ダッシュボード。今日の状況・NAND市況・決算カウントダウン・株主/信用需給・マイポジションを1画面に集約。",
  authors: [{ name: "AMANEKU製作所", url: "https://x.com/AmanekuDev" }],
  creator: "AMANEKU製作所",
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
                KIOXIA<span className="brand-accent">HUB</span>
              </span>
            </Link>
            <span className="brand-tagline">
              キオクシア(285A) 保有者専用ダッシュボード
            </span>
            <a
              href="https://x.com/AmanekuDev"
              target="_blank"
              rel="noreferrer"
              className="creator-link"
              aria-label="AMANEKU製作所のXアカウント @AmanekuDev"
            >
              <span className="creator-x" aria-hidden="true">X</span>
              <span>@AmanekuDev</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="site-footer">
          <a
            href="https://x.com/AmanekuDev"
            target="_blank"
            rel="noreferrer"
            className="footer-creator"
          >
            制作・運営 AMANEKU製作所（@AmanekuDev）↗
          </a>
          <p>
            データソースの状態は画面上部に表示しています。DEMO・FALLBACK表示時は外部データの取得に失敗したため参考値です。掲載情報は投資助言ではなく、投資判断は必ず一次情報をご確認ください。
          </p>
        </footer>
      </body>
    </html>
  );
}
