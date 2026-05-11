import type { Metadata } from "next";
import { Alex_Brush, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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

const SITE_URL = "https://knotstory.lk";
const LOGO_URL = "https://res.cloudinary.com/dnfbik3if/image/upload/v1776967066/logo_bfzkos.png";
const OG_IMAGE = "https://res.cloudinary.com/dnfbik3if/image/upload/v1776967066/logo_bfzkos.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KNOT STORY | Premium Digital Wedding Invitations Sri Lanka",
    template: "%s | KNOT STORY",
  },
  description:
    "KNOT STORY crafts beautifully animated digital wedding invitations with RSVP management, seating charts, and custom designs. Celebrate love with elegance — Sri Lanka's premier wedding invitation studio.",
  keywords: [
    "digital wedding invitations",
    "wedding invitation Sri Lanka",
    "online wedding card",
    "RSVP management",
    "wedding seating chart",
    "animated wedding invitation",
    "custom wedding template",
    "wedding website Sri Lanka",
    "premium wedding card",
    "KNOT STORY",
  ],
  authors: [{ name: "KNOT STORY", url: SITE_URL }],
  creator: "KNOT STORY by Matrix",
  publisher: "KNOT STORY",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: SITE_URL,
    siteName: "KNOT STORY",
    title: "KNOT STORY | Premium Digital Wedding Invitations",
    description:
      "Stunning animated digital wedding invitations with live RSVP, seating charts & custom templates. Made with love in Sri Lanka.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "KNOT STORY — Premium Wedding Invitations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KNOT STORY | Premium Digital Wedding Invitations",
    description:
      "Stunning animated digital wedding invitations with live RSVP, seating charts & custom templates.",
    images: [OG_IMAGE],
    creator: "@knotstory",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "KNOT STORY",
  description:
    "Premium digital wedding invitations with RSVP management, seating charts, and bespoke custom designs for your dream wedding.",
  url: SITE_URL,
  logo: LOGO_URL,
  image: OG_IMAGE,
  address: {
    "@type": "PostalAddress",
    addressCountry: "LK",
  },
  sameAs: [],
  offers: {
    "@type": "Offer",
    description: "Digital wedding invitation templates with RSVP and seating management",
    priceCurrency: "LKR",
    availability: "https://schema.org/InStock",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${alexBrush.variable} ${cormorantGaramond.variable}`}>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
