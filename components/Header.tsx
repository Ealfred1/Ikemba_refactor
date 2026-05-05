'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import Image from 'next/image';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

const isClient = typeof window !== 'undefined';

export const Header: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { openDrawer, items } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const supabase = createBrowserSupabaseClient();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsUserMenuOpen(false);
        router.push('/');
        router.refresh();
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    return (
        <header className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-5 bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-300">
            <div className="container mx-auto flex justify-between items-center">
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
                        <div className="logo font-antonio text-2xl font-bold tracking-tighter text-foreground uppercase leading-none">
                            LEKKI MART
                        </div>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6 items-center">
                    {isClient && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full border border-border hover:bg-surface transition-all text-foreground/60 hover:text-lekki-lime"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    )}

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="group relative px-6 py-2 overflow-hidden rounded-full border border-lekki-lime/30 hover:border-lekki-lime transition-all bg-transparent flex items-center gap-2"
                            >
                                <svg className="relative z-10 w-4 h-4 text-lekki-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="relative z-10 text-[10px] font-bold text-lekki-lime group-hover:text-lekki-black">Account</span>
                                <div className="absolute inset-0 bg-lekki-lime transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-lg shadow-2xl overflow-hidden z-50">
                                    <div className="p-4 border-b border-border">
                                        <p className="text-xs font-bold text-foreground truncate">{user.email}</p>
                                    </div>
                                    <div className="py-2">
                                        <Link
                                            href="/orders"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="block px-4 py-3 text-xs font-bold text-foreground hover:bg-background hover:text-lekki-lime transition-colors uppercase tracking-tight"
                                        >
                                            My Orders
                                        </Link>
                                        <Link
                                            href="/settings"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="block px-4 py-3 text-xs font-bold text-foreground hover:bg-background hover:text-lekki-lime transition-colors uppercase tracking-tight"
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-4 py-3 text-xs font-bold text-red-500/60 hover:text-red-500 hover:bg-background transition-colors uppercase tracking-tight"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="group relative px-6 py-2 overflow-hidden rounded-full border border-lekki-lime/30 hover:border-lekki-lime transition-all bg-transparent flex items-center gap-2"
                        >
                            <svg className="relative z-10 w-4 h-4 text-lekki-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="relative z-10 text-[10px] font-bold text-lekki-lime group-hover:text-lekki-black">Sign In</span>
                            <div className="absolute inset-0 bg-lekki-lime transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </Link>
                    )}

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
                    {user ? (
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="p-2 text-foreground/60 hover:text-lekki-lime transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    ) : (
                        <Link href="/login" className="p-2 text-foreground/60 hover:text-lekki-lime transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>
                    )}

                    {/* Cart Trigger */}
                    <button onClick={openDrawer} className="relative p-2 text-foreground/60 hover:text-lekki-lime transition-colors">
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
                        className="relative z-[110] w-6 h-6 flex flex-col justify-center gap-1.5"
                    >
                        <span className={`w-full h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-full h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? 'opacity-0 -translate-x-full' : ''}`} />
                        <span className={`w-full h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <div className={`absolute top-full left-0 w-full bg-background border-b border-border shadow-2xl md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col p-8 gap-6 uppercase">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif text-foreground hover:text-lekki-lime transition-colors">Supermarket</Link>
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif text-foreground hover:text-lekki-lime transition-colors">Daily Needs</Link>
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif text-foreground hover:text-lekki-lime transition-colors">Essential Goods</Link>

                    {user ? (
                        <>
                            <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif text-foreground hover:text-lekki-lime transition-colors">My Orders</Link>
                            <Link href="/settings" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif text-foreground hover:text-lekki-lime transition-colors">Settings</Link>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleSignOut();
                                }}
                                className="text-lg font-serif text-red-500/60 hover:text-red-500 transition-colors text-left"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-lg font-serif text-lekki-lime hover:text-lekki-lime/70 transition-colors">Sign In / Register</Link>
                    )}

                    <div className="pt-6 border-t border-border flex items-center justify-between">
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                openDrawer();
                            }}
                            className="bg-lekki-lime text-lekki-black px-6 py-3 rounded-md font-black text-xs flex items-center gap-3"
                        >
                            <span>SHOP BAG</span>
                            <span className="w-5 h-5 bg-lekki-black/10 rounded-full flex items-center justify-center text-[10px]">
                                {itemCount}
                            </span>
                        </button>

                        {isClient && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-3 rounded-full border border-border bg-surface text-foreground"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        )}
                    </div>

                    {/* Store Contact Mini Info */}
                    <div className="mt-4 pt-4 border-t border-border/50 opacity-30">
                        <p className="text-[10px] font-black text-lekki-lime uppercase tracking-tight mb-0.5">Lekki Mart Supermarket</p>
                        <p className="text-[9px] font-black uppercase tracking-tighter text-foreground">11b Shafi Sule St, Lekki Phase I</p>
                    </div>
                </div>
            </div>
        </header>
    );
};
