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
    default: "Karen Adventures — Discover Kenya. Beyond the Ordinary.",
    template: "%s · Karen Adventures",
  },
  description:
    "Curated adventures, unforgettable escapes, and extraordinary experiences across Kenya — private safaris, mountain expeditions, coastal escapes and luxury getaways, designed by people who know the land.",
  keywords: [
    "Kenya safari",
    "luxury travel Kenya",
    "Maasai Mara",
    "Mount Kenya",
    "Karen Adventures",
    "safari",
    "Kenya adventures",
  ],
  openGraph: {
    type: "website",
    siteName: "Karen Adventures",
    title: "Karen Adventures — Discover Kenya. Beyond the Ordinary.",
    description:
      "Curated adventures, unforgettable escapes, and extraordinary experiences across Kenya.",
    images: [
      {
        url: "/og.jpg",
        width: 1600,
        height: 900,
        alt: "Kenya — elephants beneath Kilimanjaro at dusk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karen Adventures — Discover Kenya. Beyond the Ordinary.",
    description:
      "Curated adventures, unforgettable escapes, and extraordinary experiences across Kenya.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
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
