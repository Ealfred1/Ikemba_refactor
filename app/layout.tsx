import type { Metadata } from 'next';
import { Antonio, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { ThemeProvider } from '@/components/ThemeProvider';

const fontAntonio = Antonio({
    variable: '--font-antonio',
    subsets: ['latin'],
});

const fontBricolage = Bricolage_Grotesque({
    variable: '--font-sans',
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    display: 'swap',
});

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: 'Lekki Mart | Premium Supermarket in Lekki Phase I',
    description: 'The premier destination for quality groceries in Lekki Phase I, Lagos. Beverages, snacks, and household essentials.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${fontAntonio.variable} ${fontBricolage.variable} antialiased font-sans`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <CartProvider>
                        {children}
                        <CartDrawer />
                    </CartProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
