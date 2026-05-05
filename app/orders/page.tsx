'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

type OrderRow = {
    id: string;
    reference: string;
    status: string;
    amount_naira: number;
    delivery_fee_naira: number;
    created_at: string;
    chowdeck_delivery_ref: string | null;
    order_items: {
        product_name: string;
        quantity: number;
        price_naira: number;
    }[];
};

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

const STATUS_COLORS: Record<string, string> = {
    pending: 'text-yellow-500 bg-yellow-500/10',
    payment_confirmed: 'text-blue-500 bg-blue-500/10',
    delivery_created: 'text-purple-500 bg-purple-500/10',
    delivery_preparing: 'text-orange-500 bg-orange-500/10',
    delivery_picked_up: 'text-lekki-lime bg-lekki-lime/10',
    delivered: 'text-green-500 bg-green-500/10',
    cancelled: 'text-red-500 bg-red-500/10',
    failed: 'text-red-500 bg-red-500/10',
};

export default function OrdersPage() {
    const router = useRouter();
    const supabase = createBrowserSupabaseClient();

    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<OrderRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login?redirect=/orders');
                return;
            }

            setUser(user);

            const { data, error: fetchError } = await supabase
                .from('orders')
                .select(`
                    id,
                    reference,
                    status,
                    amount_naira,
                    delivery_fee_naira,
                    created_at,
                    chowdeck_delivery_ref,
                    order_items (
                        product_name,
                        quantity,
                        price_naira
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (fetchError) {
                setError(fetchError.message);
            } else {
                setOrders(data || []);
            }

            setIsLoading(false);
        };

        loadOrders();
    }, []);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-8 h-8 border-4 border-lekki-lime border-t-transparent rounded-full animate-spin" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />

            <div className="pt-28 pb-24 px-6 md:px-12">
                <div className="container mx-auto max-w-3xl">
                    <nav className="flex items-center gap-3 mb-12 text-xs font-black text-foreground/30 uppercase tracking-tight">
                        <Link href="/" className="hover:text-lekki-lime transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground/60">My Orders</span>
                    </nav>

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-5xl font-serif text-foreground tracking-tighter">My Orders</h1>
                            <p className="text-foreground/30 text-xs font-black mt-2 uppercase tracking-tight">
                                {orders.length} order{orders.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <Link
                            href="/settings"
                            className="text-xs font-black text-lekki-lime/60 hover:text-lekki-lime uppercase tracking-tight transition-colors"
                        >
                            Settings →
                        </Link>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-md mb-8">
                            {error}
                        </div>
                    )}

                    {orders.length === 0 ? (
                        <div className="bg-surface rounded-md border border-border p-16 text-center">
                            <p className="text-lg font-black text-foreground/20 mb-4">No orders yet</p>
                            <p className="text-foreground/30 text-xs mb-8">Your order history will appear here once you make a purchase.</p>
                            <Link
                                href="/"
                                className="inline-block bg-lekki-lime text-lekki-black px-8 py-4 rounded-md font-black text-sm hover:bg-white transition-all"
                            >
                                START SHOPPING
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const firstItem = order.order_items?.[0];
                                const itemCount = order.order_items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

                                return (
                                    <Link
                                        key={order.id}
                                        href={`/orders/${order.reference}`}
                                        className="block bg-surface rounded-md border border-border p-6 hover:border-lekki-lime/30 transition-colors group"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] || 'text-foreground/40 bg-foreground/10'}`}>
                                                        {STATUS_LABELS[order.status] || order.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-foreground truncate">
                                                    {firstItem ? `${firstItem.product_name}${itemCount > 1 ? ` +${itemCount - 1} more` : ''}` : 'Order'}
                                                </p>
                                                <p className="text-[10px] text-foreground/30 mt-1 font-mono">
                                                    {order.reference}
                                                </p>
                                            </div>

                                            <div className="text-right flex-shrink-0">
                                                <p className="text-lg font-antonio font-bold text-lekki-lime tracking-tighter">
                                                    ₦{Number(order.amount_naira).toLocaleString()}
                                                </p>
                                                <p className="text-[10px] text-foreground/30 mt-1">
                                                    {new Date(order.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
