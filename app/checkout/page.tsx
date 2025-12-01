'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';

export default function CheckoutPage() {
    const { items } = useCart();

    // Mock total calculation
    const total = items.reduce((acc, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return acc + price * item.quantity;
    }, 0);

    return (
        <main className="min-h-screen bg-earth-milk relative overflow-hidden flex items-center justify-center py-20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-earth-red-brown opacity-20 blur-[100px] animate-float"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-earth-dark-brown opacity-20 blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-show-content">

                    {/* Left Side - Payment */}
                    <div className="w-full md:w-2/3 p-10 order-2 md:order-1">
                        <div className="mb-8">
                            <Link href="/" className="text-2xl font-bold tracking-tighter mb-6 block md:hidden">IKEMBA</Link>
                            <h2 className="text-3xl font-antonio leading-tight mb-2">PAYMENT METHOD</h2>
                            <p className="text-gray-500 text-sm">Select your preferred payment method.</p>
                        </div>

                        <div className="space-y-6">
                            {/* Payment Options */}
                            <div className="grid grid-cols-2 gap-4">
                                <button className="border border-earth-black/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-earth-black hover:text-white transition-all group">
                                    <span className="font-bold">Credit Card</span>
                                </button>
                                <button className="border border-earth-black/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-earth-black hover:text-white transition-all group">
                                    <span className="font-bold">PayPal</span>
                                </button>
                            </div>

                            {/* Credit Card Form */}
                            <div className="space-y-4 mt-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-earth-black uppercase tracking-wider">Card Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                        placeholder="0000 0000 0000 0000"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-earth-black uppercase tracking-wider">Expiry Date</label>
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                            placeholder="MM/YY"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-earth-black uppercase tracking-wider">CVC</label>
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                            placeholder="123"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-earth-black uppercase tracking-wider">Cardholder Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button className="w-full py-4 bg-earth-black text-white font-bold tracking-widest hover:bg-earth-red-brown transition-colors rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                    PAY ${total > 0 ? total : '299.00'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="w-full md:w-1/3 bg-earth-black text-white p-10 flex flex-col relative overflow-hidden order-1 md:order-2">
                        <div className="relative z-10">
                            <Link href="/" className="text-2xl font-bold tracking-tighter mb-10 hidden md:block">IKEMBA</Link>
                            <h2 className="text-2xl font-antonio leading-tight mb-6">ORDER SUMMARY</h2>

                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.length > 0 ? items.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-white/10 rounded-lg p-2 flex items-center justify-center">
                                            <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{item.title}</p>
                                            <p className="text-white/60 text-xs">Qty: {item.quantity}</p>
                                            <p className="text-earth-light-brown text-sm">{item.price}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex gap-4 items-center opacity-50">
                                        <div className="w-16 h-16 bg-white/10 rounded-lg p-2 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Camel Skin Bag</p>
                                            <p className="text-white/60 text-xs">Qty: 1</p>
                                            <p className="text-earth-light-brown text-sm">$299</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Subtotal</span>
                                    <span>${total > 0 ? total : '299.00'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2">
                                    <span>Total</span>
                                    <span className="text-earth-light-brown">${total > 0 ? total : '299.00'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Circle */}
                        <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full border border-white/10"></div>
                    </div>
                </div>
            </div>
        </main>
    );
}
