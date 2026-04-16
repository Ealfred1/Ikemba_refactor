'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import { Product } from '@/lib/products';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addItem } = useCart();

    // Use a deterministic ID based on the product slug/name if possible
    const productHash = product.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const id = productHash;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        addItem({
            id: id,
            title: product.name,
            price: `₦${product.discountedPrice.toLocaleString()}`,
            image: product.image
        });
    };

    return (
        <div className="group bg-lekki-gray rounded-md overflow-hidden border border-white/5 hover:border-lekki-lime/30 transition-all duration-500 shadow-2xl flex flex-col relative">
            <Link href={`/product/${id}`} className="flex flex-col grow">
                <div className="relative aspect-square overflow-hidden bg-lekki-black">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-4 left-4 bg-lekki-lime text-lekki-black text-[9px] font-black px-3 py-1 rounded-full">
                        In Stock
                    </div>
                </div>
                
                <div className="p-8 flex flex-col grow">
                    <div className="grow">
                        <p className="text-[10px] text-lekki-lime font-bold mb-3">Daily Need</p>
                        <h3 className="text-lg font-serif text-white/90 line-clamp-2 leading-tight mb-4 group-hover:text-lekki-lime transition-colors">
                            {product.name}
                        </h3>
                    </div>

                    <div className="mt-4 pt-6 border-t border-white/5 flex items-end justify-between">
                        <div>
                            <p className="text-[10px] text-white/30 font-bold mb-1">₦{product.price.toLocaleString()}</p>
                            <p className="text-2xl font-black text-lekki-lime tracking-tight">
                                ₦{product.discountedPrice.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
            
            <button 
                onClick={handleAddToCart}
                className="absolute right-8 bottom-8 bg-lekki-lime text-lekki-black w-14 h-14 rounded-md flex items-center justify-center hover:bg-white transition-all group/btn shadow-lg shadow-lekki-lime/10 active:scale-90 z-20"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    );
};

export default ProductCard;
