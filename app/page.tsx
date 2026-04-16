'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
    'Water': '💧',
    'Soda & Drinks': '🥤',
    'Energy': '⚡',
    'Juice': '🍊',
    'Alcohol': '🍾',
    'Snacks & Sweets': '🍿',
    'Breakfast': '🍳',
    'Milk/Milk Drinks': '🥛',
    'Noodles': '🍜',
    'Cooking Essentials': '🫙',
    'Deodorant & Perfume': '💎',
    'Household': '🏠',
    'Toiletries': '🧴',
    'Packs & Bundles': '📦',
    'Feminine Care': '🌸',
    'Smoking & Tobacco': '🚬',
};

interface CategoryInfo {
    name: string;
    count: number;
}

interface Product {
    sku: string;
    barcode: string;
    name: string;
    price: number;
    discountedPrice: number;
    image: string;
    category: string;
}

export default function Home() {
    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/categories')
            .then(r => r.json())
            .then(setCategories)
            .catch(console.error);
    }, []);

    const loadProducts = useCallback(async (category: string | null) => {
        setLoading(true);
        try {
            const url = category
                ? `/api/products?category=${encodeURIComponent(category)}`
                : '/api/products';
            const res = await fetch(url);
            const data = await res.json();
            setProducts(data);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCategorySelect = (name: string) => {
        const next = activeCategory === name ? null : name;
        setActiveCategory(next);
        setSearchQuery('');
        loadProducts(next);
    };

    const filteredProducts = searchQuery.trim()
        ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : products;

    return (
        <main className="min-h-screen bg-lekki-black text-white overflow-x-hidden font-sans">
            <Header />

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 md:px-12 relative overflow-hidden bg-lekki-black">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lekki-lime/10 rounded-full blur-[150px] -mr-40 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lekki-lime/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

                <div className="container mx-auto relative z-10">
                    <div className="max-w-5xl">
                        <h1 className="text-6xl md:text-9xl font-serif text-white leading-[0.85] tracking-tight mb-8">
                            LEKKI MART<br />
                            <span className="text-lekki-lime">DRINKS &amp; SNACKS</span><br />
                            WATER, GROCERIES.
                        </h1>
                        <p className="text-lg md:text-xl text-white/40 max-w-2xl font-medium leading-relaxed mb-12">
                            We stock premium beverages, snacks, toiletries, household supplies, and daily needs at quality.
                            Curated for the Lekki Phase I community.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => {
                                    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-10 py-5 bg-lekki-lime text-lekki-black font-black rounded-md hover:bg-white transition-all shadow-2xl shadow-lekki-lime/20 active:scale-95"
                            >
                                Start Shopping
                            </button>
                            <button className="px-10 py-5 bg-white/5 text-white font-bold rounded-md border border-white/10 hover:bg-white/10 transition-all active:scale-95">
                                Find Nearest Store
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section id="categories" className="py-24 px-6 md:px-12 bg-lekki-black border-t border-white/5">
                <div className="container mx-auto">
                    <div className="mb-16">
                        <p className="text-[10px] font-black text-lekki-lime mb-4">Shop by Category</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">What are you after?</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat.name;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => handleCategorySelect(cat.name)}
                                    className={`group flex flex-col items-start p-5 rounded-md border transition-all duration-300 text-left ${
                                        isActive
                                            ? 'bg-lekki-lime border-lekki-lime text-lekki-black'
                                            : 'bg-lekki-gray border-white/5 hover:border-lekki-lime/30 hover:bg-lekki-gray/80 text-white'
                                    }`}
                                >
                                    <span className="text-2xl mb-3 leading-none">{CATEGORY_ICONS[cat.name] ?? '🛒'}</span>
                                    <span className={`text-xs font-bold leading-tight mb-2 ${isActive ? 'text-lekki-black' : 'text-white'}`}>
                                        {cat.name}
                                    </span>
                                    <span className={`text-[10px] font-black ${isActive ? 'text-lekki-black/60' : 'text-lekki-lime'}`}>
                                        {cat.count} items
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Product listing — only shows when a category is selected */}
                    {(activeCategory || products.length > 0) && (
                        <div>
                            {/* Toolbar */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                <div>
                                    <p className="text-[10px] font-black text-lekki-lime mb-1">
                                        {activeCategory ?? 'All Products'}
                                    </p>
                                    <p className="text-white/40 text-xs font-bold">
                                        {filteredProducts.length} items
                                    </p>
                                </div>
                                <div className="relative">
                                    <svg
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder={`Search ${activeCategory ?? 'products'}…`}
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="pl-11 pr-5 py-3 bg-lekki-gray border border-white/10 rounded-md text-sm font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-lekki-lime/40 w-72 transition-colors"
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="py-32 text-center">
                                    <div className="inline-flex items-center gap-3 text-lekki-lime font-black text-xs">
                                        <div className="w-4 h-4 border-2 border-lekki-lime border-t-transparent rounded-full animate-spin" />
                                        Loading...
                                    </div>
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="py-32 text-center">
                                    <p className="text-white/20 font-black">No products found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                    {filteredProducts.map((product, index) => (
                                        <ProductCard
                                            key={`${product.sku}-${product.name}-${index}`}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-lekki-dark text-white py-32 px-6 md:px-12 border-t border-white/5">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
                        <div className="md:col-span-5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="relative w-12 h-12 overflow-hidden invert brightness-200">
                                    <Image src="/branding/logo.png" alt="Lekki Mart" fill className="object-contain" />
                                </div>
                                <h3 className="text-3xl font-antonio font-bold text-lekki-lime uppercase tracking-tighter leading-none">LEKKI MART</h3>
                            </div>
                            <p className="opacity-40 text-sm leading-relaxed max-w-sm mb-10">
                                Lekki Mart is a premium supermarket stocking high-quality beverages, snacks, toiletries,
                                and daily household supplies. Dedicated to agba service standards in Lekki Phase I.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-lekki-lime group-hover:text-lekki-black transition-all">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                                    </div>
                                    <span className="text-xs font-bold opacity-60">11b Shafi Sule St, Lekki Phase I, Lagos</span>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-lekki-lime group-hover:text-lekki-black transition-all">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                                    </div>
                                    <span className="text-xs font-bold opacity-60">learnlive524@gmail.com</span>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-lekki-lime group-hover:text-lekki-black transition-all">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                                    </div>
                                    <span className="text-xs font-bold opacity-60">07012428801</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-[10px] font-black mb-10 text-lekki-lime">Shop Tier</h4>
                            <ul className="space-y-4 text-xs font-bold opacity-40">
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Supermarket</li>
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Liquor Store</li>
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Daily Goods</li>
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Household</li>
                            </ul>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-[10px] font-black mb-10 text-lekki-lime">Service</h4>
                            <ul className="space-y-4 text-xs font-bold opacity-40">
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Onboarding</li>
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Delivery Maps</li>
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Returns Policy</li>
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Audit Logs</li>
                            </ul>
                        </div>

                        <div className="md:col-span-3">
                            <h4 className="text-[10px] font-black mb-10 text-lekki-lime">Connect</h4>
                            <div className="flex gap-4 mb-10">
                                <input
                                    type="email"
                                    placeholder="Supermarket News"
                                    className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-lekki-lime transition-colors w-full text-xs font-bold"
                                />
                                <button className="text-[10px] font-black text-lekki-lime hover:text-white transition-colors">Apply</button>
                            </div>
                            <div className="p-4 bg-lekki-lime/5 rounded-md border border-lekki-lime/10">
                                <p className="text-[10px] font-bold text-white mb-2">Business Tier</p>
                                <p className="text-xl font-antonio font-bold text-lekki-lime uppercase italic">AGBA TIER</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 text-[10px] font-black">
                        <div>&copy; 2026 Lekki Mart Supermarket. Lagos, Nigeria.</div>
                        <div className="flex gap-8">
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                            <a href="#">Developer</a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
