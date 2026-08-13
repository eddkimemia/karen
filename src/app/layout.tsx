import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorantItalic = Cormorant_Garamond({
  variable: "--font-cormorant-italic",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: "italic",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://karenadventures.com"),
  title: {
    default: "Karen Adventures — Discover East Africa. Beyond the Ordinary.",
    template: "%s · Karen Adventures",
  },
  description:
    "Curated adventures, unforgettable escapes, and extraordinary experiences across East Africa — private safaris, mountain expeditions, coastal escapes and luxury getaways, designed by people who know the land.",
  keywords: [
    "East Africa safari",
    "Kenya safari",
    "luxury travel Kenya",
    "luxury travel East Africa",
    "Maasai Mara",
    "Serengeti",
    "Kilimanjaro",
    "Zanzibar",
    "Mount Kenya",
    "Karen Adventures",
    "safari",
    "Kenya adventures",
    "Tanzania safari",
  ],
  openGraph: {
    type: "website",
    siteName: "Karen Adventures",
    title: "Karen Adventures — Discover East Africa. Beyond the Ordinary.",
    description:
      "Curated adventures, unforgettable escapes, and extraordinary experiences across East Africa.",
    images: [
      {
        url: "/images/karenimg.jpg",
        width: 1200,
        height: 630,
        alt: "Karen Adventures — East Africa, beyond the ordinary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karen Adventures — Discover East Africa. Beyond the Ordinary.",
    description:
      "Curated adventures, unforgettable escapes, and extraordinary experiences across East Africa.",
    images: ["/images/karenimg.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#071A33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${cormorantItalic.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-midnight font-sans text-ivory">
        {children}
      </body>
    </html>
  );
}
