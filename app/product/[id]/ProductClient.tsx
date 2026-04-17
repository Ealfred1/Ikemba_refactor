'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function ProductClient({ product }: { product: Product }) {
    const router = useRouter();
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        if (!product.inStock) return;
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

    const hasDiscount = product.price !== product.discountedPrice && product.discountedPrice > 0;

    return (
        <div className="flex flex-col gap-8">
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
                <p className="text-[10px] text-white/20 font-bold mt-3 uppercase tracking-widest">per pack · NGN</p>
            </div>

            {/* Quantity + CTA */}
            <div className="flex flex-col gap-4">
                {/* Quantity selector */}
                <div>
                    <p className="text-[10px] font-black text-white/30 mb-3 uppercase tracking-widest">Quantity</p>
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
                        className={`flex-1 py-4 rounded-md font-black text-sm uppercase tracking-tighter transition-all active:scale-95 ${
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
                        className="flex-1 py-4 rounded-md font-black text-sm uppercase tracking-tighter bg-transparent border border-white/10 text-white hover:border-lekki-lime/40 hover:text-lekki-lime transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
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
                    { label: 'Tier', value: 'Agba Premium' },
                ].map(({ label, value }) => (
                    <div key={label} className="p-4 bg-lekki-gray rounded-md border border-white/5">
                        <p className="text-[9px] font-black text-white/30 mb-1 uppercase tracking-widest">{label}</p>
                        <p className="text-xs font-bold text-white uppercase tracking-tighter">{value}</p>
                    </div>
                ))}
            </div>

            {/* Store assurance */}
            <div className="flex items-center gap-3 p-4 bg-lekki-lime/5 border border-lekki-lime/10 rounded-md">
                <span className="text-xl">🛡️</span>
                <p className="text-[10px] font-bold text-white/50 leading-loose uppercase tracking-widest">
                    Guaranteed fresh stock from <span className="text-lekki-lime font-black">Lekki Mart</span> · 11b Shafi Sule St, Lekki Phase I
                </p>
            </div>
        </div>
    );
}
