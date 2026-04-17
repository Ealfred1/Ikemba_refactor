'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';

// Mock coordinates for Lekki clusters to demonstrate fee calculation
const CLUSTER_COORDINATES: Record<string, { lat: string; lng: string }> = {
    'Lekki Phase I': { lat: '6.4474', lng: '3.4839' },
    'Oniru': { lat: '6.4358', lng: '3.4542' },
    'Ikoyi': { lat: '6.4500', lng: '3.4411' },
    'Victoria Island': { lat: '6.4245', lng: '3.4019' },
    'Jakande': { lat: '6.4423', lng: '3.5117' },
};

export default function AddressPage() {
    const router = useRouter();
    const { items, deliveryInfo, updateDeliveryInfo } = useCart();
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state initialized from Context (if user returns to this page)
    const [form, setForm] = useState({
        firstName: deliveryInfo.firstName || '',
        lastName: deliveryInfo.lastName || '',
        address: deliveryInfo.address || '',
        city: deliveryInfo.city || 'Lekki Phase I',
        postalCode: deliveryInfo.postalCode || '106104',
        phone: deliveryInfo.phone || '',
        email: deliveryInfo.email || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const totalOrderAmount = items.reduce((acc, item) => {
        const price = parseFloat(item.price.replace(/[₦,]/g, ''));
        return acc + (isNaN(price) ? 0 : price * item.quantity);
    }, 0);

    const handleProceed = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.firstName || !form.phone || !form.address) {
            setError('Please fill in required fields (Name, Phone, Address)');
            return;
        }

        setIsCalculating(true);
        setError(null);

        try {
            // Get coordinates based on cluster or use default
            const coords = CLUSTER_COORDINATES[form.city] || CLUSTER_COORDINATES['Lekki Phase I'];

            const res = await fetch('/api/delivery/fee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination_lat: coords.lat,
                    destination_lng: coords.lng,
                    estimated_order_amount: totalOrderAmount,
                }),
            });

            if (!res.ok) throw new Error('Failed to fetch delivery fee');

            const feeData = await res.json();

            // Save info to context
            updateDeliveryInfo({
                ...form,
                feeId: feeData.id,
                deliveryFee: feeData.delivery_amount,
            });

            router.push('/checkout');
        } catch (err) {
            console.error('Fee calculation error:', err);
            setError('Could not calculate delivery fee. Please check your internet or try again.');
        } finally {
            setIsCalculating(false);
        }
    };

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
                            <div className="flex items-center gap-4 mb-12">
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className="relative w-10 h-10 overflow-hidden group-hover:scale-110 transition-transform">
                                        <Image
                                            src="/o8x5ZQT9LFCkNbmR8zcin.png"
                                            alt="Lekki Mart"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="logo font-antonio text-2xl font-bold tracking-tighter text-lekki-lime uppercase leading-none">
                                        LEKKI MART
                                    </div>
                                </Link>
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

                        <form onSubmit={handleProceed} className="space-y-10">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">First Name</label>
                                    <input name="firstName" value={form.firstName} onChange={handleChange} required type="text" className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium" placeholder="Agba" />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">Last Name</label>
                                    <input name="lastName" value={form.lastName} onChange={handleChange} required type="text" className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium" placeholder="User" />
                                </div>
                            </div>

                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">Street Address</label>
                                <input name="address" value={form.address} onChange={handleChange} required type="text" className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium" placeholder="11b Shafi Sule St" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="space-y-3 group md:col-span-2">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">City / Area</label>
                                    <input name="city" value={form.city} onChange={handleChange} required type="text" className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium" placeholder="Lekki Phase I" />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">Postal Code</label>
                                    <input name="postalCode" value={form.postalCode} onChange={handleChange} required type="text" className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium" placeholder="106104" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">Phone Number</label>
                                    <div className="flex items-center border-b-2 border-white/5 focus-within:border-lekki-lime transition-colors">
                                        <span className="text-white/30 font-bold text-sm py-4 pr-3 select-none">+234</span>
                                        <input
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            required
                                            type="tel"
                                            className="flex-1 bg-transparent py-4 focus:outline-none text-white font-medium"
                                            placeholder="0701 242 8801"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-[10px] font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-widest">Email Address <span className="text-white/20 font-bold normal-case opacity-50">(optional)</span></label>
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        type="email"
                                        className="w-full bg-transparent border-b-2 border-white/5 py-4 focus:outline-none focus:border-lekki-lime transition-colors text-white font-medium"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-10 flex flex-col md:flex-row gap-6">
                                <button 
                                    type="submit"
                                    disabled={isCalculating}
                                    className="flex-grow py-6 bg-lekki-lime text-lekki-black font-black rounded-md shadow-2xl hover:bg-white transition-all text-center active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3"
                                >
                                    {isCalculating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-lekki-black/20 border-t-lekki-black rounded-full animate-spin"></div>
                                            Calculating Logistics...
                                        </>
                                    ) : (
                                        'Proceed to payment'
                                    )}
                                </button>
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
