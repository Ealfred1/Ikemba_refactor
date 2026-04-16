'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';

// Mock data - in a real app this would come from an API or database
const items = [
    {
        id: 1,
        image: '/ikemba_images/camel_skin_leather_bag/camel_skin_leather_bag_1_no_bg.png',
        title: 'Camel Skin Leather Bag',
        topic: 'LEKKIMART COLLECTION',
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

import { Header } from '@/components/Header';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCart();
    const [showDetail, setShowDetail] = useState(false);
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const id = params.id as string;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`);
                if (!response.ok) throw new Error('Product not found');
                const data = await response.json();
                
                // Construct a detail object if not present (since CSV only has flat data)
                const mockDetail = {
                    title: data.name,
                    description: `Experience the best of ${data.name}. This premium selection has been curated for the Lekki Phase I community, ensuring top-tier quality and absolute freshness.`,
                    specifications: [
                        { label: 'Category', value: 'Daily Need' },
                        { label: 'Price', value: `₦${data.price?.toLocaleString()}` },
                        { label: 'Tier', value: 'Agba' },
                        { label: 'Quality', value: 'Premium' },
                    ]
                };

                setItem({
                    ...data,
                    detail: mockDetail
                });
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        
        const timer = setTimeout(() => {
            setShowDetail(true);
        }, 300);
        return () => clearTimeout(timer);
    }, [id]);

    const handleAddToCart = () => {
        if (!item) return;
        addItem({
            id: Number(id) || Math.random(),
            title: item.name,
            price: `₦${item.discountedPrice.toLocaleString()}`, 
            image: item.image
        });
    };

    const handleCheckout = () => {
        router.push('/address');
    };

    if (loading) return <div className="min-h-screen bg-lekki-black flex items-center justify-center font-black text-lekki-lime">SECURE LOGISTICS IN PROGRESS...</div>;
    if (!item) return <div className="min-h-screen bg-lekki-black flex items-center justify-center font-black text-white">PRODUCT NOT FOUND</div>;

    return (
        <main className="min-h-screen bg-lekki-black overflow-hidden relative">
            <Header />

            {/* Reusing the carousel structure for the animation effect */}
            <div className={`carousel ${showDetail ? 'showDetail' : ''} h-screen mt-0 pt-20`}>
                <div className="list">
                    {/* Dummy item to satisfy CSS nth-child(2) selector for active state */}
                    <div className="item"></div>

                    <div className="item" style={{ width: '100%' }}>
                        <div className="detail" style={{ opacity: 1, pointerEvents: 'auto' }}>
                            <div className="title text-4xl font-bold mb-4 text-white">{item.detail.title}</div>
                            <div className="des text-sm text-white/60 mb-6">{item.detail.description}</div>
                            <div className="specifications flex gap-4 border-t border-white/10 pt-4 mt-4 overflow-auto text-white">
                                {item.detail.specifications.map((spec, i) => (
                                    <div key={i} className="flex-shrink-0 w-24 text-center text-white">
                                        <p className="font-bold text-sm text-lekki-lime">{spec.label}</p>
                                        <p className="text-xs text-white/40">{spec.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="checkout mt-6 flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="px-6 py-2 border border-lekki-lime/30 text-lekki-lime bg-transparent font-medium hover:bg-lekki-lime/10 transition-colors"
                                >
                                    Add to cart
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="px-6 py-2 bg-lekki-lime text-lekki-black font-medium hover:bg-white transition-colors"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                        {/* Image positioned to match the "showDetail" state */}
                        <div className="absolute right-[50%] top-[50%] translate-y-[-50%] w-[50%] h-full">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="object-contain w-full h-full p-10 drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
