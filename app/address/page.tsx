'use client';

import React from 'react';
import Link from 'next/link';

export default function AddressPage() {
    return (
        <main className="min-h-screen bg-lekki-black relative flex items-center justify-center py-20 px-4 font-sans">
            {/* Background Detail */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden blur-[120px] opacity-10">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-lekki-lime animate-float"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-lekki-lime animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto relative z-10 max-w-6xl">
                <div className="bg-lekki-gray rounded-md shadow-[0_48px_80px_-16px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-white/5">
                    
                    {/* Visual Segment */}
                    <div className="w-full md:w-1/3 bg-lekki-black text-white p-12 flex flex-col justify-between relative overflow-hidden border-r border-white/5">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-12">
                                <div className="w-8 h-8 bg-lekki-lime rounded-lg flex items-center justify-center text-lekki-black font-black text-lg">L</div>
                                <span className="font-antonio text-xl font-bold tracking-tighter text-lekki-lime uppercase">LEKKI MART</span>
                            </div>
                            <h2 className="text-5xl font-serif leading-tight mb-6">Logistics<br />Detail</h2>
                            <p className="text-white/30 text-[10px] font-black leading-loose">Enter your coordinates for agba delivery tier.</p>
                        </div>
                        
                        <div className="relative z-10 p-6 bg-lekki-lime/5 rounded-md border border-lekki-lime/10">
                            <p className="text-[10px] font-black text-lekki-lime mb-2">Delivery Radius</p>
                            <p className="text-xs font-bold text-white opacity-60">Lekki Phase I & Surrounding Areas</p>
                        </div>
                        
                        {/* Background Detail */}
                        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 border border-white/5 rounded-full pointer-events-none"></div>
                    </div>

                    {/* Form Segment */}
                    <div className="w-full md:w-2/3 p-12 md:p-20 bg-lekki-gray">
                        <div className="mb-14">
                            <h3 className="text-2xl font-serif text-white mb-2">Delivery Information</h3>
                            <div className="h-1 w-20 bg-lekki-lime rounded-full"></div>
                        </div>

                        <form className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity">First Name</label>
                                    <input type="text" className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium" placeholder="Agba" />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity">Last Name</label>
                                    <input type="text" className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium" placeholder="User" />
                                </div>
                            </div>

                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity">Street Address</label>
                                <input type="text" className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium" placeholder="11b Shafi Sule St" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="space-y-3 group md:col-span-2">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity">City / Area</label>
                                    <input type="text" className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium" placeholder="Lekki Phase I" />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity">Postal Code</label>
                                    <input type="text" className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium" placeholder="106104" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity">Phone Number</label>
                                    <div className="flex items-center border-b-2 border-white/5 focus-within:border-lekki-lime transition-colors">
                                        <span className="text-white/30 font-bold text-sm py-4 pr-3 select-none">+234</span>
                                        <input
                                            type="tel"
                                            className="flex-1 bg-transparent py-4 focus:outline-none text-white font-medium"
                                            placeholder="0701 242 8801"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity">Email Address <span className="text-white/20 font-bold normal-case">(optional)</span></label>
                                    <input
                                        type="email"
                                        className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-10 flex flex-col md:flex-row gap-6">
                                <Link 
                                    href="/checkout"
                                    className="flex-grow py-6 bg-lekki-lime text-lekki-black font-black rounded-md shadow-2xl hover:bg-white transition-all text-center active:scale-[0.98]"
                                >
                                    Proceed to payment
                                </Link>
                                <Link 
                                    href="/"
                                    className="px-10 py-6 border-2 border-white/5 text-white/40 font-black rounded-md hover:border-white/20 transition-all text-center active:scale-[0.98]"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
