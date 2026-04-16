import type { Metadata } from "next";
import { Geist, Geist_Mono, Antonio, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontAntonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
});

const fontPlayfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const fontPoppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lekki Mart | Premium Supermarket in Lekki Phase I",
  description: "Lekki Mart is the premier supermarket in Lekki Phase I, Lagos, stocking quality beverages, snacks, fresh water, toiletries, and household essentials. Experience agba-tier grocery shopping.",
  keywords: ["Lekki Mart", "Supermarket Lagos", "Grocery delivery Lekki", "Drinks and Snacks Lekki", "Agba Supermarket", "Lekki Phase 1 shopping"],
  authors: [{ name: "Lekki Mart Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/o8x5ZQT9LFCkNbmR8zcin.png",
    shortcut: "/o8x5ZQT9LFCkNbmR8zcin.png",
    apple: "/o8x5ZQT9LFCkNbmR8zcin.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://lekkimart.com",
    title: "Lekki Mart | Premium Supermarket in Lekki Phase I",
    description: "Quality beverages, snacks, and household essentials delivered to your doorstep in Lekki Phase I.",
    siteName: "Lekki Mart",
    images: [
      {
        url: "/o8x5ZQT9LFCkNbmR8zcin.png",
        width: 1200,
        height: 630,
        alt: "Lekki Mart Premium Groceries",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lekki Mart | Premium Supermarket in Lekki Phase I",
    description: "The premier destination for quality groceries in Lekki Phase I, Lagos.",
    images: ["/o8x5ZQT9LFCkNbmR8zcin.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fontAntonio.variable} ${fontPlayfair.variable} ${fontPoppins.variable} antialiased`}
      >
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
