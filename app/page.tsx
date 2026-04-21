'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';

// Category icons mapping removed

interface CategoryInfo {
    name: string;
    count: number;
}

interface Product {
    id: number;
    sku: string;
    name: string;
    description: string;
    price: number;
    discountedPrice: number;
    inStock: boolean;
    image: string;
    category: string;
}

export default function Home() {
    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    useEffect(() => {
        fetch('/api/categories')
            .then(r => r.json())
            .then(data => {
                setCategories(data);
                if (data.length > 0) {
                    const firstCategory = data[0].name;
                    setActiveCategory(firstCategory);
                    loadProducts(firstCategory);
                }
            })
            .catch(console.error);
    }, [loadProducts]);

    const handleCategorySelect = (name: string) => {
        const next = activeCategory === name ? null : name;
        setActiveCategory(next);
        setSearchQuery('');
        loadProducts(next);

        // Auto-scroll to products on mobile/small screens if a category is selected
        if (next) {
            setTimeout(() => {
                document.getElementById('product-list')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    };

    const filteredProducts = searchQuery.trim()
        ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : products;

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
            <Header />

            {/* Hero */}
            <section className="pt-32 md:pt-24 pb-12 relative overflow-hidden bg-background">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lekki-lime/10 rounded-full blur-[150px] -mr-40 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lekki-lime/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

                <div className="container mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-6xl md:text-7xl font-serif text-foreground leading-[0.8] tracking-tighter mb-5">
                                LEKKI MART<br />
                                DRINKS, SNACKS,<br />
                                <span className="text-lekki-lime">WATER.</span>
                            </h1>
                            <p className="text-xl text-foreground/40 max-w-md font-medium leading-tight mb-10">
                                Premium essentials curated for the Lekki Phase I community.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => {
                                        document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-8 py-4 bg-lekki-lime text-lekki-black font-black rounded-sm hover:bg-foreground hover:text-background transition-all shadow-2xl shadow-lekki-lime/20 active:scale-95 uppercase tracking-tighter text-sm"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        </div>
                        <div className="relative group flex justify-center lg:justify-end">
                            <div className="absolute inset-0 rounded-full scale-75 group-hover:scale-90 transition-transform duration-1000" />
                            <div className="relative z-10 w-full max-w-[800px] h-auto aspect-square scale-110">
                                <Image
                                    src="/data/hero-groceries.png"
                                    alt="Lekki Mart Groceries"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section id="categories" className="py-24 bg-background border-t border-border">
                <div className="container mx-auto">
                    <div className="mb-8">
                        <p className="text-xs font-black text-foreground/60 mb-4 text-center md:text-left uppercase tracking-tight">Shop by Category</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight text-center md:text-left">What are you after?</h2>
                    </div>

                    <div className="flex overflow-x-auto gap-3 mb-16 pb-4 no-scrollbar -mx-6 px-6 md:-mx-12 md:px-12 scroll-smooth">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat.name;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => handleCategorySelect(cat.name)}
                                    className={`group flex items-center justify-center px-6 py-2.5 rounded-full border whitespace-nowrap transition-all duration-300 ${isActive
                                        ? 'bg-lekki-lime border-lekki-lime text-lekki-black shadow-[0_10px_20px_rgba(164,230,0,0.1)]'
                                        : 'bg-surface border-border hover:border-lekki-lime/30 text-foreground'
                                        }`}
                                >
                                    <span className={`text-[11px] font-black tracking-wider uppercase ${isActive ? 'text-lekki-black' : 'text-foreground'}`}>
                                        {cat.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Product listing — only shows when a category is selected */}
                    {(activeCategory || products.length > 0) && (
                        <div id="product-list" className="scroll-mt-32">
                            {/* Toolbar */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                <div>
                                    <p className="text-xs font-black text-foreground mb-1 uppercase tracking-tight bg-lekki-lime px-2 py-0.5 inline-block rounded-sm">
                                        {activeCategory ?? 'All Products'}
                                    </p>
                                    <p className="text-foreground/70 text-sm font-bold mt-1">
                                        {filteredProducts.length} items
                                    </p>
                                </div>
                                <div className="relative">
                                    <svg
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder={`Search ${activeCategory ?? 'products'}…`}
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="pl-11 pr-5 py-3 bg-surface border border-border rounded-md text-sm font-medium text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-lekki-lime/40 w-72 transition-colors"
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
                                    <p className="text-foreground/20 font-black">No products found</p>
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
            <footer className="bg-surface text-foreground py-32 border-t border-border">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
                        <div className="md:col-span-5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="relative w-12 h-12 overflow-hidden">
                                    <Image src="/branding/logo.png" alt="Lekki Mart" fill className="object-contain" />
                                </div>
                                <h3 className="text-3xl font-sans font-black text-lekki-lime uppercase tracking-tighter leading-none italic">LEKKI MART</h3>
                            </div>
                            <p className="text-foreground/90 text-sm font-medium leading-relaxed max-w-sm mb-10">
                                Lekki Mart is a premium supermarket stocking high-quality beverages, snacks, toiletries,
                                and daily household supplies. Dedicated to premium service standards in Lekki Phase I.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group text-foreground/80">
                                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-lekki-lime group-hover:text-lekki-black transition-all">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                                    </div>
                                    <span className="text-xs font-bold">11b Shafi Sule St, Lekki Phase I, Lagos</span>
                                </div>
                                <div className="flex items-center gap-4 group text-foreground/80">
                                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-lekki-lime group-hover:text-lekki-black transition-all">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                                    </div>
                                    <span className="text-xs font-bold">learnlive524@gmail.com</span>
                                </div>
                                <div className="flex items-center gap-4 group text-foreground/80">
                                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-lekki-lime group-hover:text-lekki-black transition-all">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                                    </div>
                                    <span className="text-xs font-bold">07012428801</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-sm font-black mb-10 text-lekki-lime uppercase tracking-tight">Browse</h4>
                            <ul className="space-y-4 text-xs font-bold text-foreground">
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Supermarket</li>
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Liquor Store</li>
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Daily Goods</li>
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Household</li>
                            </ul>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-sm font-black mb-10 text-lekki-lime uppercase tracking-tight">Service</h4>
                            <ul className="space-y-4 text-xs font-bold text-foreground">
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Delivery Maps</li>
                                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Returns Policy</li>
                            </ul>
                        </div>

                        <div className="md:col-span-3">
                            <h4 className="text-sm font-black mb-10 text-lekki-lime uppercase tracking-tight">Connect</h4>
                            <div className="flex gap-4 mb-10">
                                <input
                                    type="email"
                                    placeholder="Supermarket News"
                                    className="bg-transparent border-b border-foreground/20 py-3 outline-none focus:border-lekki-lime transition-colors w-full text-xs font-bold"
                                />
                                <button className="text-xs font-black text-lekki-lime hover:text-foreground transition-colors shrink-0">Apply</button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-foreground/80 text-xs font-black uppercase tracking-tight">
                        <div>&copy; 2026 Lekki Mart Supermarket. Lagos, Nigeria.</div>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-lekki-lime transition-colors">Privacy</a>
                            <a href="#" className="hover:text-lekki-lime transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
