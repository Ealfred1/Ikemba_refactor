'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    reference: string;
    status: string;
    totalAmount: number;
    deliveryFee: number;
    customerName: string;
    customerEmail: string;
    createdAt: string;
    paidAt: string;
    chowDeliveryRef: string | null;
    items: OrderItem[];
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Order Pending',
    payment_confirmed: 'Payment Confirmed',
    delivery_created: 'Delivery Created',
    delivery_preparing: 'Preparing for Pickup',
    delivery_picked_up: 'Rider on the Way',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    failed: 'Payment Failed',
};

const STATUS_STEPS = [
    'pending',
    'payment_confirmed',
    'delivery_created',
    'delivery_picked_up',
    'delivered',
];

export default function OrderTrackingPage({ params }: { params: Promise<{ reference: string }> }) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refParam, setRefParam] = useState<string | null>(null);

    useEffect(() => {
        params.then(p => setRefParam(p.reference));
    }, [params]);

    const fetchOrder = async (ref: string) => {
        try {
            const res = await fetch(`/api/orders/${ref}`);
            if (!res.ok) {
                setError('Order not found');
                return;
            }
            const data = await res.json();
            setOrder(data);
        } catch {
            setError('Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!refParam) return;
        fetchOrder(refParam);

        const interval = setInterval(() => {
            fetchOrder(refParam);
        }, 30000);

        return () => clearInterval(interval);
    }, [refParam]);

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-8 h-8 border-4 border-lekki-lime border-t-transparent rounded-full animate-spin" />
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
                    <p className="text-4xl font-black text-foreground/20">Order Not Found</p>
                    <p className="text-foreground/40 text-sm">Check the reference and try again.</p>
                    <Link href="/" className="px-8 py-4 bg-lekki-lime text-lekki-black font-black rounded-md text-sm hover:bg-foreground hover:text-background transition-colors">
                        Back to Store
                    </Link>
                </div>
            </main>
        );
    }

    const currentStatusIndex = STATUS_STEPS.indexOf(order.status);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />

            <div className="pt-28 pb-24 px-6 md:px-12">
                <div className="container mx-auto max-w-3xl">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-3 mb-12 text-xs font-black text-foreground/30 uppercase tracking-tight">
                        <Link href="/" className="hover:text-lekki-lime transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground/60">Order {order.reference.slice(0, 12)}…</span>
                    </nav>

                    {/* Status Header */}
                    <div className="bg-surface rounded-md border border-border p-8 mb-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-lekki-lime/10 rounded-full flex items-center justify-center text-lekki-lime">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-serif text-foreground tracking-tighter">
                                    {STATUS_LABELS[order.status] || order.status}
                                </h1>
                                <p className="text-foreground/40 text-xs font-medium">Ref: {order.reference}</p>
                            </div>
                        </div>

                        {/* Progress Steps */}
                        <div className="mt-8 flex items-center gap-0">
                            {STATUS_STEPS.map((step, i) => {
                                const isCompleted = i <= currentStatusIndex;
                                const isCurrent = i === currentStatusIndex;
                                return (
                                    <React.Fragment key={step}>
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                                isCompleted
                                                    ? 'bg-lekki-lime text-lekki-black'
                                                    : 'bg-foreground/10 text-foreground/30'
                                            } ${isCurrent ? 'ring-2 ring-lekki-lime ring-offset-2 ring-offset-background' : ''}`}>
                                                {isCompleted ? '✓' : i + 1}
                                            </div>
                                        </div>
                                        {i < STATUS_STEPS.length - 1 && (
                                            <div className={`flex-1 h-0.5 ${i < currentStatusIndex ? 'bg-lekki-lime' : 'bg-foreground/10'}`} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-surface rounded-md border border-border p-8 mb-8">
                        <h2 className="text-sm font-black text-lekki-lime uppercase tracking-tight mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{item.name}</p>
                                        <p className="text-xs text-foreground/40">Qty {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-black text-lekki-lime">₦{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-4 border-t border-border">
                            <div className="flex justify-between text-xs font-black text-foreground/30 uppercase">
                                <span>Subtotal</span>
                                <span>₦{(order.totalAmount - order.deliveryFee).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-black text-foreground/30 uppercase">
                                <span>Delivery</span>
                                <span>₦{order.deliveryFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-border">
                                <span className="text-xs font-black text-foreground/40 uppercase">Total Paid</span>
                                <span className="text-3xl font-antonio font-bold text-lekki-lime tracking-tighter">₦{order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-surface rounded-md border border-border p-8">
                        <h2 className="text-sm font-black text-lekki-lime uppercase tracking-tight mb-4">Delivery</h2>
                        <div className="space-y-2 text-sm">
                            <p className="text-foreground/60">
                                <span className="font-bold text-foreground">Name:</span> {order.customerName}
                            </p>
                            <p className="text-foreground/60">
                                <span className="font-bold text-foreground">Email:</span> {order.customerEmail}
                            </p>
                            {order.chowDeliveryRef && (
                                <p className="text-foreground/60">
                                    <span className="font-bold text-foreground">Chowdeck Ref:</span> {order.chowDeliveryRef}
                                </p>
                            )}
                            <p className="text-foreground/60">
                                <span className="font-bold text-foreground">Placed:</span> {new Date(order.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
