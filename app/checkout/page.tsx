'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, clearCart, deliveryInfo } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [orderReference, setOrderReference] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
        // If no fee_id, user skipped address page — redirect back
        if (!deliveryInfo.feeId && items.length > 0) {
            router.push('/address');
        }
    }, [deliveryInfo.feeId, items.length, router]);

    const subtotal = items.reduce((acc, item) => {
        const price = parseFloat(item.price.replace(/[₦,]/g, ''));
        return acc + (isNaN(price) ? 0 : price * item.quantity);
    }, 0);

    const logisticsFee = deliveryInfo.deliveryFee || 0;
    const grandTotal = subtotal + logisticsFee;

    const handlePayment = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const res = await fetch('/api/delivery/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fee_id: deliveryInfo.feeId,
                    customer_name: `${deliveryInfo.firstName} ${deliveryInfo.lastName}`,
                    customer_phone: deliveryInfo.phone,
                    customer_email: deliveryInfo.email,
                    estimated_order_amount: subtotal,
                    delivery_note: `Delivery to ${deliveryInfo.address}, ${deliveryInfo.city}`,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to create delivery');
            }

            const data = await res.json();
            
            // Success
            setOrderReference(data.reference);
            setIsSuccess(true);
            clearCart();
        } catch (err: any) {
            console.error('Order creation error:', err);
            setError(err.message || 'Something went wrong processing your order.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isMounted) return null;

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-lekki-black flex items-center justify-center p-4">
                <div className="bg-lekki-gray p-12 rounded-[3rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.5)] text-center max-w-md border border-white/5 animate-show-content">
                    <div className="w-24 h-24 bg-lekki-lime text-lekki-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-lekki-lime/20">
                        <svg xmlns="http://www.w3.org/2000/center" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-serif text-white mb-4">Order Locked!</h2>
                    <p className="text-white/40 mb-6 font-medium">Your daily needs are being packed by the Lekki Mart team.</p>
                    
                    <div className="bg-lekki-black p-4 rounded-xl mb-10 border border-white/5">
                        <p className="text-[10px] font-black text-lekki-lime uppercase tracking-widest mb-1">Delivery Reference</p>
                        <p className="text-white font-mono text-sm tracking-wider">{orderReference}</p>
                    </div>

                    <Link href="/" className="inline-block bg-lekki-lime text-lekki-black px-12 py-5 rounded-md font-black hover:bg-white transition-all shadow-xl active:scale-95">
                        RETURN TO STORE
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-lekki-black relative flex items-center justify-center py-10 md:py-20 px-4 font-sans">
            {/* Background Detail */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden blur-[120px] opacity-10">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-lekki-lime animate-float"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-lekki-lime animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto relative z-10 max-w-6xl">
                <div className="bg-lekki-gray rounded-[3rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-white/5">
                    
                    {/* Payment Side */}
                    <div className="w-full md:w-[60%] p-8 md:p-16 order-2 md:order-1">
                        <div className="mb-14">
                            <div className="flex items-center gap-3 mb-10">
                                <Link href="/" className="w-10 h-10 bg-lekki-lime rounded-xl flex items-center justify-center text-lekki-black font-black text-xl hover:bg-white transition-colors">L</Link>
                                <span className="font-antonio text-2xl font-bold tracking-tighter text-lekki-lime uppercase">LEKKI MART</span>
                            </div>
                            <h2 className="text-5xl font-serif text-white mb-4">Secure Checkout</h2>
                            <p className="text-lekki-lime text-[10px] font-black opacity-40 uppercase tracking-widest">Tier: Agba Premium Supermarket</p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-md mb-8">
                                {error}
                            </div>
                        )}

                        <div className="space-y-12">
                            <div className="grid grid-cols-2 gap-4">
                                <button className="bg-lekki-lime text-lekki-black rounded-md p-6 flex flex-col items-center justify-center gap-2 shadow-2xl shadow-lekki-lime/10">
                                    <span className="font-black text-[10px] uppercase tracking-widest">Credit Card</span>
                                </button>
                                <button className="border-2 border-white/5 rounded-md p-6 flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-all text-white/30 cursor-not-allowed">
                                    <span className="font-black text-[10px] uppercase tracking-widest">Bank Transfer</span>
                                </button>
                            </div>

                            <div className="grid gap-10">
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">Card Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-xl text-white font-medium tracking-[0.1em]"
                                        placeholder="4242 4242 4242 4242"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">Expiry</label>
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white"
                                            placeholder="MM/YY"
                                        />
                                    </div>
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">CVC</label>
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white"
                                            placeholder="123"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handlePayment}
                                disabled={isProcessing || items.length === 0}
                                className="w-full py-7 bg-lekki-lime text-lekki-black font-black rounded-md shadow-2xl hover:bg-white active:scale-[0.98] transition-all disabled:opacity-20 flex items-center justify-center gap-5 mt-10"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-lekki-black/20 border-t-lekki-black rounded-full animate-spin"></div>
                                        Initiating Delivery...
                                    </>
                                ) : (
                                    <>
                                        <span>Confirm Bill</span>
                                        <span className="w-2 h-2 rounded-full bg-lekki-black/30"></span>
                                        <span>₦{grandTotal.toLocaleString()}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Summary Side */}
                    <div className="w-full md:w-[40%] bg-lekki-black text-white p-8 md:p-16 flex flex-col relative overflow-hidden order-1 md:order-2 border-l border-white/5">
                        <div className="relative z-10 flex flex-col h-full">
                            <h3 className="text-sm font-black mb-12 text-lekki-lime opacity-80 uppercase tracking-widest">Order Abstract</h3>

                            <div className="flex-grow space-y-10 overflow-y-auto pr-4 mb-14 max-h-[450px] custom-scrollbar">
                                {items.length > 0 ? items.map((item) => (
                                    <div key={item.id} className="flex gap-6 items-start group">
                                        <div className="w-24 h-24 bg-lekki-gray rounded-md flex-shrink-0 flex items-center justify-center border border-white/5 group-hover:border-lekki-lime/20 transition-colors overflow-hidden p-4">
                                            <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
                                        </div>
                                        <div className="flex-grow pt-2">
                                            <p className="text-sm font-black leading-tight group-hover:text-lekki-lime transition-colors line-clamp-2 tracking-tight">{item.title}</p>
                                            <div className="flex justify-between items-center mt-4">
                                                <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Qty {item.quantity}</span>
                                                <span className="text-lekki-lime text-base font-black tracking-tighter">{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-24 text-center opacity-10">
                                        <p className="text-xs font-black uppercase tracking-widest">Inventory Empty</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto border-t border-white/5 pt-10 space-y-6">
                                <div className="flex justify-between items-center text-[10px] font-black text-white/30 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-white/30 uppercase tracking-widest">
                                    <span>Chowdeck Delivery</span>
                                    <span className="text-lekki-lime opacity-100">₦{logisticsFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-end pt-10 border-t border-white/5">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Grand Total</span>
                                    <span className="text-5xl font-antonio font-bold text-lekki-lime tracking-tighter">₦{grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
