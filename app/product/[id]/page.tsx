'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// Mock data - in a real app this would come from an API or database
const items = [
    {
        id: 1,
        image: '/ikemba_images/camel_skin_leather_bag/camel_skin_leather_bag_1_no_bg.png',
        title: 'Camel Skin Leather Bag',
        topic: 'IKEMBA COLLECTION',
        description: 'Handcrafted luxury camel skin leather bag featuring traditional African craftsmanship.',
        detail: {
            title: 'Camel Skin Leather Bag',
            description: 'This exquisite camel skin leather bag represents the pinnacle of African luxury craftsmanship. Made from premium camel leather, each bag is handcrafted by skilled artisans using traditional techniques passed down through generations.',
            specifications: [
                { label: 'Material', value: 'Genuine Camel Skin' },
                { label: 'Craftsmanship', value: 'Handcrafted' },
                { label: 'Origin', value: 'African Artisan' },
                { label: 'Style', value: 'Traditional' },
                { label: 'Quality', value: 'Premium' },
            ]
        }
    },
    // ... add other items if needed for demo, but for now we'll just mock ID 1
];

export default function ProductPage() {
    const params = useParams();
    const [showDetail, setShowDetail] = useState(false);

    // In a real app, fetch item based on params.id
    const item = items[0]; // Default to first item for demo

    useEffect(() => {
        // Trigger the "showDetail" animation on mount
        const timer = setTimeout(() => {
            setShowDetail(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    if (!item) return <div>Product not found</div>;

    return (
        <main className="min-h-screen bg-earth-milk overflow-hidden relative">
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <Link href="/" className="logo font-bold text-2xl tracking-tighter">IKEMBA</Link>
                <nav className="flex gap-8">
                    <Link href="/" className="text-gray-800 hover:text-black font-medium">Home</Link>
                    <Link href="#" className="text-gray-800 hover:text-black font-medium">Products</Link>
                </nav>
            </header>

            {/* Reusing the carousel structure for the animation effect */}
            <div className={`carousel ${showDetail ? 'showDetail' : ''} h-screen mt-0 pt-20`}>
                <div className="list">
                    <div className="item" style={{ width: '100%' }}>
                        <div className="detail" style={{ opacity: 1, pointerEvents: 'auto' }}>
                            <div className="title text-4xl font-bold mb-4 text-earth-black">{item.detail.title}</div>
                            <div className="des text-sm text-gray-700 mb-6">{item.detail.description}</div>
                            <div className="specifications flex gap-4 border-t border-gray-400 pt-4 mt-4 overflow-auto">
                                {item.detail.specifications.map((spec, i) => (
                                    <div key={i} className="flex-shrink-0 w-24 text-center text-earth-black">
                                        <p className="font-bold text-sm">{spec.label}</p>
                                        <p className="text-xs text-gray-600">{spec.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="checkout mt-6 flex gap-4">
                                <button className="px-6 py-2 border border-earth-black text-earth-black bg-transparent font-medium tracking-wider hover:bg-gray-100 transition-colors">ADD TO CART</button>
                                <button className="px-6 py-2 bg-earth-red-brown text-white font-medium tracking-wider hover:bg-earth-dark-brown transition-colors">CHECKOUT</button>
                            </div>
                        </div>
                        {/* Image positioned to match the "showDetail" state */}
                        <div className="absolute right-[50%] top-[50%] translate-y-[-50%] w-[50%] h-full">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="object-contain w-full h-full p-10"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
