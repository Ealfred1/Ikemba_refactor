'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import Image from 'next/image';

export const Header: React.FC = () => {
    const { openDrawer, items } = useCart();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-lekki-black/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-12 h-12 overflow-hidden">
                        <Image 
                            src="/branding/logo.png" 
                            alt="Lekki Mart" 
                            fill 
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="logo font-antonio text-2xl font-bold tracking-tighter text-lekki-lime uppercase leading-none">
                        LEKKI MART
                    </div>
                </Link>
            </div>
            
            <nav className="hidden md:flex gap-10 items-center">
                <a href="#" className="text-[10px] font-bold text-white/50 hover:text-lekki-lime transition-colors">Supermarket</a>
                <a href="#" className="text-[10px] font-bold text-white/50 hover:text-lekki-lime transition-colors">Daily Needs</a>
                <a href="#" className="text-[10px] font-bold text-white/50 hover:text-lekki-lime transition-colors">Essential Goods</a>
                
                <button 
                    onClick={openDrawer}
                    className="group relative px-6 py-2 overflow-hidden rounded-full border border-lekki-lime/30 hover:border-lekki-lime transition-all bg-transparent flex items-center gap-2"
                >
                    <span className="relative z-10 text-[10px] font-bold text-lekki-lime group-hover:text-lekki-black">Your Bag</span>
                    {itemCount > 0 && (
                        <span className="relative z-10 bg-lekki-lime text-lekki-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                            {itemCount}
                        </span>
                    )}
                    <div className="absolute inset-0 bg-lekki-lime transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
            </nav>
        </header>
    );
};
