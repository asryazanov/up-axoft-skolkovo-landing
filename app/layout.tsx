import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UP: Axoft & Сколково — программа для технологических компаний",
  description:
    "Программа UP помогает ИТ-стартапам и вендорам выйти на корпоративный рынок через дистрибьюторскую сеть Axoft и экосистему «Сколково». Грантовая поддержка до 300 млн ₽.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
