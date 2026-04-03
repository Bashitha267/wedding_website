import type { Metadata } from "next";
import { Alex_Brush, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const alexBrush = Alex_Brush({
  weight: "400",
  variable: "--font-alex-brush",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Wedding of Sarah & Mark",
  description: "Join us for our special day under the roses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${alexBrush.variable} ${cormorantGaramond.variable}`}>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
