'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import { Product } from '@/lib/chowdeck';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addItem({
            id: product.id,
            title: product.name,
            price: `₦${product.discountedPrice.toLocaleString()}`,
            image: product.image
        });
    };

    const hasDiscount = product.price !== product.discountedPrice && product.discountedPrice > 0;

    return (
        <div className="group bg-surface rounded-md overflow-hidden border border-border hover:border-lekki-lime/30 transition-all duration-300 flex flex-col">
            <Link href={`/product/${product.id}`} className="flex flex-col grow">

                {/* Image — fills section completely */}
                <div className="relative w-full aspect-square overflow-hidden bg-background">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />

                    {/* Out of stock overlay */}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                            <span className="text-xs font-black text-foreground/60 bg-surface/60 px-3 py-1 rounded-full border border-border">
                                Out of stock
                            </span>
                        </div>
                    )}

                    {/* Discount badge */}
                    {hasDiscount && (
                        <div className="absolute top-2 right-2 bg-lekki-lime text-lekki-black text-[11px] font-black px-2 py-0.5 rounded-full">
                            DEAL
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col grow">
                    <p className="text-xs text-foreground/60 font-black mb-1.5 uppercase tracking-wide">{product.category}</p>
                    <h3 className="text-sm font-bold text-foreground/90 line-clamp-2 leading-snug mb-4 group-hover:text-lekki-lime transition-colors grow">
                        {product.name}
                    </h3>

                    {/* Price row + add button — inline, no overflow */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border">
                        <div className="min-w-0">
                            {hasDiscount && (
                                <p className="text-xs text-foreground/25 font-bold line-through leading-none mb-0.5">
                                    ₦{product.price.toLocaleString()}
                                </p>
                            )}
                            <p className="text-lg font-black text-lekki-lime tracking-tight leading-none">
                                ₦{product.discountedPrice.toLocaleString()}
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="flex-shrink-0 w-9 h-9 bg-lekki-lime text-lekki-black rounded-md flex items-center justify-center hover:bg-foreground hover:text-background active:scale-90 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                            aria-label={`Add ${product.name} to cart`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
