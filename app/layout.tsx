import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://asryazanov.github.io"),
  title: "UP: Axoft & Сколково — программа для технологических компаний",
  description:
    "Программа UP помогает ИТ-стартапам и вендорам выйти на корпоративный рынок через дистрибьюторскую сеть Axoft и экосистему «Сколково». Грантовая поддержка до 300 млн ₽.",
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
      <body>{children}</body>
    </html>
  );
}
