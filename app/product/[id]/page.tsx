'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { useCart } from '@/components/CartContext';

interface Product {
    id: number;
    sku: string;
    name: string;
    description: string;
    price: number;
    discountedPrice: number;
    inStock: boolean;
    image: string;
    category: string;
}

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const id = params.id as string;

    useEffect(() => {
        setLoading(true);
        fetch(`/api/products/${id}`)
            .then(r => {
                if (!r.ok) throw new Error('Not found');
                return r.json();
            })
            .then(setProduct)
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        if (!product || !product.inStock) return;
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                title: product.name,
                price: `₦${product.discountedPrice.toLocaleString()}`,
                image: product.image,
            });
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const hasDiscount = product && product.price !== product.discountedPrice && product.discountedPrice > 0;

    // ── loading ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <main className="min-h-screen bg-lekki-black">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-lekki-lime border-t-transparent rounded-full animate-spin" />
                        <p className="text-white/30 font-black text-xs">Loading product…</p>
                    </div>
                </div>
            </main>
        );
    }

    // ── not found ────────────────────────────────────────────────────────────
    if (!product) {
        return (
            <main className="min-h-screen bg-lekki-black">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
                    <p className="text-6xl font-black text-white/5">404</p>
                    <p className="text-white/40 font-bold text-sm">This product doesn't exist or has been removed.</p>
                    <Link
                        href="/"
                        className="px-8 py-4 bg-lekki-lime text-lekki-black font-black rounded-md text-sm hover:bg-white transition-colors"
                    >
                        Back to Store
                    </Link>
                </div>
            </main>
        );
    }

    // ── product ──────────────────────────────────────────────────────────────
    return (
        <main className="min-h-screen bg-lekki-black text-white">
            <Header />

            <div className="pt-28 pb-24 px-6 md:px-12">
                <div className="container mx-auto">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-3 mb-12 text-[10px] font-black text-white/30">
                        <Link href="/" className="hover:text-lekki-lime transition-colors">Home</Link>
                        <span>/</span>
                        <span
                            className="hover:text-lekki-lime transition-colors cursor-pointer"
                            onClick={() => router.back()}
                        >
                            {product.category}
                        </span>
                        <span>/</span>
                        <span className="text-white/60 truncate max-w-[200px]">{product.name}</span>
                    </div>

                    {/* Main layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left — Image */}
                        <div className="relative">
                            {/* Main image card */}
                            <div className="relative aspect-square rounded-md overflow-hidden bg-lekki-gray border border-white/5">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-lekki-black/40 via-transparent to-transparent pointer-events-none" />

                                {/* Stock badge */}
                                {!product.inStock && (
                                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/10">
                                        <span className="text-[10px] font-black text-white/60">Out of stock</span>
                                    </div>
                                )}

                                {hasDiscount && (
                                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-lekki-lime rounded-full">
                                        <span className="text-[10px] font-black text-lekki-black">DEAL</span>
                                    </div>
                                )}
                            </div>

                            {/* SKU tag */}
                            <p className="mt-4 text-[9px] font-black text-white/20 tracking-widest text-center">
                                REF: {product.sku}
                            </p>
                        </div>

                        {/* Right — Info */}
                        <div className="flex flex-col gap-8">
                            {/* Category label */}
                            <div>
                                <p className="text-[10px] font-black text-lekki-lime uppercase tracking-widest mb-3">
                                    {product.category}
                                </p>
                                <h1 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-4">
                                    {product.name}
                                </h1>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Price block */}
                            <div className="p-6 bg-lekki-gray rounded-md border border-white/5">
                                <div className="flex items-end gap-4 flex-wrap">
                                    <div>
                                        <p className="text-[10px] font-black text-white/30 mb-1">Price</p>
                                        <p className="text-4xl font-black text-lekki-lime tracking-tight leading-none">
                                            ₦{product.discountedPrice.toLocaleString()}
                                        </p>
                                    </div>
                                    {hasDiscount && (
                                        <div>
                                            <p className="text-[10px] font-black text-white/20 mb-1">Was</p>
                                            <p className="text-xl font-bold text-white/20 line-through leading-none">
                                                ₦{product.price.toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-white/20 font-bold mt-3">per pack · NGN</p>
                            </div>

                            {/* Quantity + CTA */}
                            <div className="flex flex-col gap-4">
                                {/* Quantity selector */}
                                <div>
                                    <p className="text-[10px] font-black text-white/30 mb-3">Quantity</p>
                                    <div className="inline-flex items-center bg-lekki-gray border border-white/10 rounded-md overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-lekki-lime hover:bg-white/5 transition-all font-black"
                                        >
                                            −
                                        </button>
                                        <span className="w-14 h-10 flex items-center justify-center text-white font-black text-sm border-x border-white/10">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-lekki-lime hover:bg-white/5 transition-all font-black"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!product.inStock}
                                        className={`flex-1 py-4 rounded-md font-black text-sm transition-all active:scale-95 ${
                                            added
                                                ? 'bg-white text-lekki-black'
                                                : 'bg-lekki-lime text-lekki-black hover:bg-white'
                                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                                    >
                                        {!product.inStock
                                            ? 'Out of Stock'
                                            : added
                                            ? '✓ Added to Bag'
                                            : `Add ${quantity > 1 ? `${quantity}x ` : ''}to Bag`}
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleAddToCart();
                                            router.push('/checkout');
                                        }}
                                        disabled={!product.inStock}
                                        className="flex-1 py-4 rounded-md font-black text-sm bg-transparent border border-white/10 text-white hover:border-lekki-lime/40 hover:text-lekki-lime transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>

                            {/* Meta info */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Category', value: product.category },
                                    { label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
                                    { label: 'Currency', value: 'NGN (₦)' },
                                    { label: 'Tier', value: 'Agba' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="p-4 bg-lekki-gray rounded-md border border-white/5">
                                        <p className="text-[9px] font-black text-white/30 mb-1">{label}</p>
                                        <p className="text-xs font-bold text-white">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Store assurance */}
                            <div className="flex items-center gap-3 p-4 bg-lekki-lime/5 border border-lekki-lime/10 rounded-md">
                                <span className="text-xl">🛡️</span>
                                <p className="text-xs text-white/50 leading-relaxed">
                                    Guaranteed fresh stock from <span className="text-lekki-lime font-bold">Lekki Mart</span> · 11b Shafi Sule St, Lekki Phase I
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
