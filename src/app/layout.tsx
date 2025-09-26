import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SpreadsheetAI - AI untuk Google Sheets & Excel",
  description:
    "Platform AI terdepan untuk Google Sheets dan Excel. Otomatisasi, analisis, dan optimasi spreadsheet dengan kecerdasan buatan.",
  keywords: "AI, Google Sheets, Excel, Spreadsheet, Automation, Indonesia",
  authors: [{ name: "SpreadsheetAI Team" }],
  openGraph: {
    title: "SpreadsheetAI - AI untuk Google Sheets & Excel",
    description: "Platform AI terdepan untuk Google Sheets dan Excel",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
