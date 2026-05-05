'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import Script from 'next/script';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: Record<string, unknown>) => { openIframe: () => void };
        };
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, clearCart, deliveryInfo, updateDeliveryInfo } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [orderReference, setOrderReference] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);

    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const supabase = createBrowserSupabaseClient();

    useEffect(() => {
        setIsMounted(true);
        if (!deliveryInfo.feeId && items.length > 0) {
            router.push('/address');
        }
    }, [deliveryInfo.feeId, items.length, router]);

    useEffect(() => {
        const checkPaystack = setInterval(() => {
            const w = window as unknown as Record<string, unknown>;
            const paystack = w.PaystackPop;
            if (paystack && typeof (paystack as Record<string, unknown>).setup === 'function') {
                setIsPaystackLoaded(true);
                clearInterval(checkPaystack);
            }
        }, 100);

        const timeout = setTimeout(() => {
            clearInterval(checkPaystack);
        }, 15000);

        return () => {
            clearInterval(checkPaystack);
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsAuthLoading(false);

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, phone')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    const nameParts = (profile.full_name || '').split(' ');
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts.slice(1).join(' ') || '';

                    const updates: Record<string, string> = {
                        email: user.email || deliveryInfo.email,
                    };
                    if (firstName && !deliveryInfo.firstName) updates.firstName = firstName;
                    if (lastName && !deliveryInfo.lastName) updates.lastName = lastName;
                    if (profile.phone && !deliveryInfo.phone) updates.phone = profile.phone;

                    if (Object.keys(updates).length > 0) {
                        updateDeliveryInfo(updates);
                    }
                }

                const { data: defaultAddress } = await supabase
                    .from('saved_addresses')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('is_default', true)
                    .single();

                if (defaultAddress && !deliveryInfo.address) {
                    updateDeliveryInfo({
                        address: defaultAddress.street_address,
                        city: defaultAddress.city || 'Lagos',
                    });
                }
            }
        };

        loadUser();
    }, []);

    const subtotal = items.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
    }, 0);

    const logisticsFee = deliveryInfo.deliveryFee || 0;
    const grandTotal = subtotal + logisticsFee;

    const handlePayment = async () => {
        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

        if (!publicKey) {
            setError('Payment gateway configuration missing.');
            return;
        }

        if (!isPaystackLoaded) {
            setError('Payment system is loading, please wait...');
            return;
        }

        if (!deliveryInfo.email || !deliveryInfo.email.includes('@')) {
            setError('Please provide a valid email address.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        const paymentMetadata: Record<string, unknown> = {
            delivery_info: {
                fee_id: deliveryInfo.feeId,
                customer_name: `${deliveryInfo.firstName} ${deliveryInfo.lastName}`,
                customer_phone: deliveryInfo.phone,
                customer_email: deliveryInfo.email.trim(),
                estimated_order_amount: subtotal,
                delivery_note: `Delivery to ${deliveryInfo.address}, ${deliveryInfo.city}`,
                items: items.map(i => ({ title: i.title, quantity: i.quantity, price: i.price }))
            }
        };

        if (user) {
            paymentMetadata.user_id = user.id;
        }

        try {
            const initRes = await fetch('/api/payment/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: deliveryInfo.email.trim(),
                    amount: grandTotal,
                    metadata: paymentMetadata
                }),
            });

            if (!initRes.ok) {
                const errData = await initRes.json();
                throw new Error(errData.error || 'Failed to initialize payment');
            }

            const { access_code, reference } = await initRes.json();

            if (!window.PaystackPop) {
                throw new Error('Payment gateway not loaded. Please refresh and try again.');
            }

            window.PaystackPop.setup({
                key: publicKey.trim(),
                email: deliveryInfo.email.trim(),
                amount: Math.round(grandTotal * 100),
                access_code: access_code,
                callback: (response: { reference: string }) => {
                    setOrderReference(response.reference || reference);
                    setIsSuccess(true);
                    clearCart();
                },
                onClose: () => {
                    setIsProcessing(false);
                },
            }).openIframe();

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong.';
            console.error('Payment Error:', err);
            setError(message);
            setIsProcessing(false);
        }
    };

    if (!isMounted || isAuthLoading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-lekki-lime/20 border-t-lekki-lime rounded-full animate-spin"></div>
            </main>
        );
    }

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-surface p-12 rounded-[3rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.15)] text-center max-w-md border border-border animate-show-content text-foreground">
                    <div className="w-24 h-24 bg-lekki-lime text-lekki-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-lekki-lime/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-serif text-foreground mb-4 tracking-tighter">Order Successful!</h2>
                    <p className="text-foreground/40 mb-6 font-medium tracking-tight">Your daily needs are being packed by the Lekki Mart team.</p>

                    <div className="bg-background p-4 rounded-xl mb-4 border border-border">
                        <p className="text-[10px] font-black text-lekki-lime uppercase tracking-tight mb-1">Delivery Reference</p>
                        <p className="text-foreground font-mono text-sm tracking-tight">{orderReference}</p>
                    </div>

                    <Link href={`/orders/${orderReference}`} className="block text-center text-xs font-black text-lekki-lime/60 hover:text-lekki-lime mb-10 transition-colors">
                        Track your order →
                    </Link>

                    <Link href="/" className="inline-block bg-lekki-lime text-lekki-black px-12 py-5 rounded-md font-black hover:bg-white transition-all shadow-xl active:scale-95">
                        RETURN TO STORE
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background relative flex items-center justify-center py-10 md:py-20 px-6 md:px-12 font-sans text-foreground">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden blur-[120px] opacity-10">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-lekki-lime animate-float"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-lekki-lime animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />

            <div className="container mx-auto relative z-10 max-w-6xl">
                <div className="bg-surface rounded-[3rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-border">

                    <div className="w-full md:w-[60%] p-8 md:p-16 order-2 md:order-1">
                        <div className="mb-14">
                            <div className="flex items-center gap-4 mb-10">
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className="relative w-10 h-10 overflow-hidden group-hover:scale-110 transition-transform">
                                        <Image
                                            src="/o8x5ZQT9LFCkNbmR8zcin.png"
                                            alt="Lekki Mart"
                                            fill
                                            sizes="40px"
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="logo font-antonio text-2xl font-bold tracking-tighter text-lekki-lime uppercase leading-none">
                                        LEKKI MART
                                    </div>
                                </Link>
                            </div>
                            <h2 className="text-5xl font-serif text-foreground mb-4 tracking-tighter">Complete Order</h2>

                            {user && (
                                <div className="mt-4 p-4 bg-lekki-lime/5 border border-lekki-lime/20 rounded-md">
                                    <p className="text-[10px] font-black text-lekki-lime uppercase tracking-tight mb-1">Signed in as</p>
                                    <p className="text-xs font-bold text-foreground/60">{user.email}</p>
                                    <Link href="/settings" className="text-[10px] font-black text-lekki-lime/60 hover:text-lekki-lime transition-colors mt-1 block">
                                        Update your details →
                                    </Link>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-md mb-8">
                                {error}
                            </div>
                        )}

                        <div className="space-y-12">
                            <div className="p-8 bg-background border border-border rounded-2xl flex items-center gap-6 group hover:border-lekki-lime transition-all cursor-pointer select-none ring-1 ring-border hover:ring-lekki-lime/50">
                                <div className="w-14 h-14 bg-lekki-lime/10 rounded-full flex items-center justify-center text-lekki-lime group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-sm uppercase tracking-tight mb-1">Paystack Gateway</h4>
                                    <p className="text-foreground/40 text-xs font-medium">International & local payments enabled</p>
                                </div>
                                <div className="w-4 h-4 rounded-full border-2 border-lekki-lime bg-lekki-lime shadow-[0_0_15px_rgba(180,255,0,0.4)]"></div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing || items.length === 0 || !isPaystackLoaded}
                                className="w-full py-7 bg-lekki-lime text-lekki-black font-black rounded-md shadow-2xl hover:bg-white active:scale-[0.98] transition-all disabled:opacity-20 flex items-center justify-center gap-5"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-lekki-black/20 border-t-lekki-black rounded-full animate-spin"></div>
                                        PROCESSING...
                                    </>
                                ) : !isPaystackLoaded ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-lekki-black/20 border-t-lekki-black rounded-full animate-spin"></div>
                                        LOADING PAYMENT...
                                    </>
                                ) : (
                                    <>
                                        <span>CONFIRM BILL</span>
                                        <span className="w-2 h-2 rounded-full bg-lekki-black/30"></span>
                                        <span>₦{grandTotal.toLocaleString()}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:w-[40%] bg-background text-foreground p-8 md:p-16 flex flex-col relative overflow-hidden order-1 md:order-2 border-l border-border">
                        <div className="relative z-10 flex flex-col h-full">
                            <h3 className="text-base font-black mb-12 text-lekki-lime opacity-80 uppercase tracking-tight">Order Abstract</h3>

                            <div className="flex-grow space-y-10 overflow-y-auto pr-4 mb-14 max-h-[450px] custom-scrollbar">
                                {items.length > 0 ? items.map((item) => (
                                    <div key={item.id} className="flex gap-6 items-start group">
                                        <div className="w-24 h-24 bg-lekki-gray rounded-md flex-shrink-0 flex items-center justify-center border border-white/5 group-hover:border-lekki-lime/20 transition-colors overflow-hidden p-4">
                                            <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
                                        </div>
                                        <div className="flex-grow pt-2">
                                            <p className="text-sm font-black leading-tight group-hover:text-lekki-lime transition-colors line-clamp-2 tracking-tight">{item.title}</p>
                                            <div className="flex justify-between items-center mt-4">
                                                <span className="text-foreground/30 text-xs font-black uppercase tracking-tight">Qty {item.quantity}</span>
                                                <span className="text-lekki-lime text-base font-black tracking-tighter">₦{item.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-24 text-center opacity-10">
                                        <p className="text-sm font-black uppercase tracking-tight">Inventory Empty</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto border-t border-border pt-10 space-y-6">
                                <div className="flex justify-between items-center text-xs font-black text-foreground/30 uppercase tracking-tight">
                                    <span>Subtotal</span>
                                    <span>₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-black text-foreground/30 uppercase tracking-tight">
                                    <span>Chowdeck Delivery</span>
                                    <span className="text-lekki-lime opacity-100">
                                        {logisticsFee > 0 ? `₦${logisticsFee.toLocaleString()}` : 'Free'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end pt-10 border-t border-border">
                                    <span className="text-xs font-black text-foreground/30 uppercase tracking-tight mb-2">Grand Total</span>
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
