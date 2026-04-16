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
  title: "Lekki Mart – Drinks, Snacks, Water, Groceries",
  description: "Lekki Mart stocks quality beverages, snacks, toiletries, and household supplies in Lekki Phase I, Lagos.",
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
