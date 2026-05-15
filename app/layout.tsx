import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  src: [
    { path: "../public/fonts/manrope-400.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/manrope-500.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/manrope-600.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/manrope-700.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/manrope-800.ttf", weight: "800", style: "normal" }
  ],
  display: "swap",
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://asryazanov.github.io"),
  title: "UP: Axoft & Сколково — программа для технологических компаний",
  description:
    "Программа UP помогает технологическим продуктам подготовиться к корпоративному рынку через экспертизу «Сколково» и партнёрский канал Axoft.",
  alternates: {
    canonical: "/up-axoft-skolkovo-landing/"
  },
  openGraph: {
    title: "UP: Axoft & Сколково",
    description:
      "Программа для технологических компаний: экспертиза «Сколково» и выход в корпоративные продажи через канал Axoft.",
    url: "/up-axoft-skolkovo-landing/",
    siteName: "UP: Axoft & Сколково",
    images: [
      {
        url: "/up-axoft-skolkovo-landing/og-up-landing.png",
        width: 1200,
        height: 630,
        alt: "UP: Axoft & Сколково"
      }
    ],
    locale: "ru_RU",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "UP: Axoft & Сколково",
    description: "Экспертиза, упаковка продукта и выход в корпоративные продажи через канал Axoft.",
    images: ["/up-axoft-skolkovo-landing/og-up-landing.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}
