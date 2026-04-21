import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { getProductById } from '@/lib/chowdeck';
import ProductClient from './ProductClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * Crazy SEO: Dynamic Metadata generation
 * This ensures search engines see unique, keyword-rich titles and descriptions for every product.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return {
            title: 'Product Not Found | Lekki Mart',
        };
    }

    const title = `${product.name} | Buy at Lekki Mart Lekki Phase I`;
    const description = `${product.description}. Premium quality ${product.category} available for delivery in Lekki, Lagos. Price: ₦${product.discountedPrice.toLocaleString()}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [product.image],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [product.image],
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
                    <p className="text-6xl font-black text-foreground/5">404</p>
                    <p className="text-foreground/40 font-bold text-base uppercase tracking-tight">Inventory Gap Found</p>
                    <Link
                        href="/"
                        className="px-8 py-4 bg-lekki-lime text-lekki-black font-black rounded-md text-sm uppercase hover:bg-foreground hover:text-background transition-colors tracking-tight"
                    >
                        Back to Store
                    </Link>
                </div>
            </main>
        );
    }

    const hasDiscount = product.price !== product.discountedPrice && product.discountedPrice > 0;

    /**
     * Crazy SEO: JSON-LD Structured Data
     * This enables Rich Snippets in Google Search (Price, Availability, Image).
     */
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        sku: product.sku,
        brand: {
            '@type': 'Brand',
            name: 'Lekki Mart',
        },
        offers: {
            '@type': 'Offer',
            url: `https://lekkimart.com/product/${product.id}`,
            priceCurrency: 'NGN',
            price: product.discountedPrice,
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
        },
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Inject JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            <Header />

            <div className="pt-28 pb-24 px-6 md:px-12">
                <div className="container mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-3 mb-12 text-xs font-black text-foreground/30 uppercase tracking-tight">
                        <Link href="/" className="hover:text-lekki-lime transition-colors">Home</Link>
                        <span>/</span>
                        <Link href={`/?category=${product.category}`} className="hover:text-lekki-lime transition-colors">
                            {product.category}
                        </Link>
                        <span>/</span>
                        <span className="text-foreground/60 truncate max-w-[200px]">{product.name}</span>
                    </nav>

                    {/* Main layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left — Image */}
                        <div className="relative">
                            <div className="relative aspect-square rounded-md overflow-hidden bg-surface border border-border shadow-2xl">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />

                                {!product.inStock && (
                                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/10">
                                        <span className="text-xs font-black text-white/60 uppercase tracking-tight">Sold Out</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right — Info */}
                        <div className="flex flex-col gap-2">
                             {/* Category and Title moved to Server side for instant SEO paint */}
                             <p className="text-xs font-black text-lekki-lime uppercase tracking-tight mb-3">
                                {product.category}
                            </p>
                            <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight mb-4 tracking-tighter">
                                {product.name}
                            </h1>
                            <p className="text-foreground/40 text-sm leading-relaxed mb-8 max-w-xl">
                                {product.description}
                            </p>

                            {/* Client Interactive Part */}
                            <ProductClient product={product} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
