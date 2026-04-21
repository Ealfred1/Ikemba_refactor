'use client';

import React from 'react';
import { useCart } from './CartContext';
import Image from 'next/image';
import Link from 'next/link';

export const CartDrawer: React.FC = () => {
    const { items, isDrawerOpen, closeDrawer, removeItem } = useCart();

    const total = items.reduce((acc: number, item: any) => {
        const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
        return acc + (price * item.quantity);
    }, 0);

    if (!isDrawerOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={closeDrawer}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-background border-l border-border h-full flex flex-col shadow-2xl animate-show-content">
                <div className="p-8 flex items-center justify-between border-b border-border">
                    <div>
                        <h2 className="text-2xl font-serif text-foreground">Secure Your Bag</h2>
                        <p className="text-xs font-bold text-lekki-lime tracking-tight mt-1">Lekki Mart Logistics</p>
                    </div>
                    <button
                        onClick={closeDrawer}
                        className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-surface transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grow overflow-y-auto p-8 custom-scrollbar">
                    {items.length > 0 ? (
                        <div className="space-y-8">
                            {items.map((item) => (
                                <div key={item.id} className="group flex gap-6 items-start">
                                    <div className="w-20 h-20 bg-surface rounded-md flex-shrink-0 flex items-center justify-center border border-border overflow-hidden">
                                        <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                                    </div>
                                    <div className="grow pt-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-sm font-bold text-foreground line-clamp-1">{item.title}</h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-foreground/20 hover:text-lekki-lime transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-foreground/30 font-bold">Qty {item.quantity}</span>
                                            <span className="text-lekki-lime font-black">{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="mt-4 font-black">Bag Empty</p>
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-8 border-t border-border space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-black text-foreground/30">
                                <span>Subtotal</span>
                                <span>₦{total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-black text-foreground/30">
                                <span>Logistics</span>
                                <span className="text-lekki-lime">Free</span>
                            </div>
                            <div className="flex justify-between items-end pt-4">
                                <span className="text-xs font-black text-foreground/40 mb-1">Total Due</span>
                                <span className="text-4xl font-sans font-black text-lekki-lime">₦{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <Link
                            href="/address"
                            onClick={closeDrawer}
                            className="w-full py-6 bg-lekki-lime text-lekki-black font-black rounded-md flex items-center justify-center gap-4 hover:bg-foreground hover:text-background transition-all shadow-xl shadow-lekki-lime/10 active:scale-[0.98]"
                        >
                            Secure Checkout
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
