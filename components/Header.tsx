'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import Image from 'next/image';

export const Header: React.FC = () => {
    const { openDrawer, items } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const NavLinks = () => (
        <>
            <Link href="/" className="text-[10px] font-bold text-white/50 hover:text-lekki-lime transition-colors uppercase tracking-widest">Supermarket</Link>
            <Link href="/" className="text-[10px] font-bold text-white/50 hover:text-lekki-lime transition-colors uppercase tracking-widest">Daily Needs</Link>
            <Link href="/" className="text-[10px] font-bold text-white/50 hover:text-lekki-lime transition-colors uppercase tracking-widest">Essential Goods</Link>
        </>
    );

    return (
        <header className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-5 bg-lekki-black/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 overflow-hidden">
                            <Image
                                src="/o8x5ZQT9LFCkNbmR8zcin.png"
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

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-10 items-center">
                    <NavLinks />

                    <button
                        onClick={openDrawer}
                        className="group relative px-6 py-2 overflow-hidden rounded-full border border-lekki-lime/30 hover:border-lekki-lime transition-all bg-transparent flex items-center gap-2"
                    >
                        <svg className="relative z-10 w-4 h-4 text-lekki-lime group-hover:text-lekki-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="relative z-10 text-[10px] font-bold text-lekki-lime group-hover:text-lekki-black">Your Bag</span>
                        {itemCount > 0 && (
                            <span className="relative z-10 bg-lekki-lime text-lekki-black text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                        <div className="absolute inset-0 bg-lekki-lime transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </nav>

                {/* Mobile Icons Group */}
                <div className="flex md:hidden items-center gap-5">
                    {/* Cart Trigger */}
                    <button onClick={openDrawer} className="relative p-2 text-white/60 hover:text-lekki-lime transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 bg-lekki-lime text-lekki-black text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {/* Animated Hamburger */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="relative z-[60] w-6 h-6 flex flex-col justify-center gap-1.5 overflow-hidden"
                    >
                        <span className={`w-full h-0.5 bg-lekki-lime transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-full h-0.5 bg-lekki-lime transition-all duration-300 ${isMenuOpen ? 'opacity-0 -translate-x-full' : ''}`} />
                        <span className={`w-full h-0.5 bg-lekki-lime transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-lekki-black/95 backdrop-blur-2xl"
                    onClick={() => setIsMenuOpen(false)}
                />
                
                {/* Drawer Content */}
                <div className={`relative h-full flex flex-col items-center justify-center gap-12 p-12 transition-transform duration-500 ${isMenuOpen ? 'translate-y-0' : '-translate-y-10'}`}>
                    <div className="flex flex-col items-center gap-8 text-center uppercase">
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif text-white hover:text-lekki-lime transition-colors">Supermarket</Link>
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif text-white hover:text-lekki-lime transition-colors">Daily Needs</Link>
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif text-white hover:text-lekki-lime transition-colors">Essential Goods</Link>
                    </div>

                    <button
                        onClick={() => {
                            setIsMenuOpen(false);
                            openDrawer();
                        }}
                        className="mt-8 px-12 py-5 bg-lekki-lime text-lekki-black font-black rounded-md shadow-2xl shadow-lekki-lime/20 flex items-center gap-4"
                    >
                        <span>OPEN YOUR BAG</span>
                        <span className="w-6 h-6 bg-lekki-black/10 rounded-full flex items-center justify-center text-[10px]">
                            {itemCount}
                        </span>
                    </button>

                    {/* Store Contact Mini Info */}
                    <div className="mt-12 text-center opacity-30">
                        <p className="text-[10px] font-black text-lekki-lime uppercase tracking-widest mb-1">Lekki Mart Supermarket</p>
                        <p className="text-[8px] font-black uppercase tracking-tighter">11b Shafi Sule St, Lekki Phase I</p>
                    </div>
                </div>
            </div>
        </header>
    );
};
