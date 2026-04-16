'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const items = [
    {
        id: 1,
        image: '/ikemba_images/camel_skin_leather_bag/camel_skin_leather_bag_1_no_bg.png',
        title: 'Camel Skin Leather Bag',
        topic: 'LEKKI MART COLLECTION',
        description: 'Handcrafted luxury camel skin leather bag featuring traditional African craftsmanship. Each piece is uniquely designed with authentic materials and exceptional attention to detail.',
        detail: {
            title: 'Camel Skin Leather Bag',
            description: 'This exquisite camel skin leather bag represents the pinnacle of African luxury craftsmanship. Made from premium camel leather, each bag is handcrafted by skilled artisans using traditional techniques passed down through generations. The rich texture and natural variations in the leather make each piece truly unique, embodying the authentic spirit of African design and quality.',
            specifications: [
                { label: 'Material', value: 'Genuine Camel Skin' },
                { label: 'Craftsmanship', value: 'Handcrafted' },
                { label: 'Origin', value: 'African Artisan' },
                { label: 'Style', value: 'Traditional' },
                { label: 'Quality', value: 'Premium' },
            ]
        }
    },
    {
        id: 2,
        image: '/ikemba_images/crocodile_skin_leather_bag/crocodile_skin_leather_bag_1_no_bg.png',
        title: 'Crocodile Skin Leather Bag',
        topic: 'LEKKI MART COLLECTION',
        description: 'Exquisite crocodile skin leather bag showcasing the finest in African luxury. Premium materials meet traditional craftsmanship in this stunning statement piece.',
        detail: {
            title: 'Crocodile Skin Leather Bag',
            description: 'Experience ultimate luxury with this crocodile skin leather bag. Crafted from the finest crocodile leather, this exceptional piece combines contemporary design with traditional African craftsmanship. The distinctive texture and natural beauty of crocodile skin creates a truly exclusive accessory that reflects the sophistication and heritage of African luxury goods.',
            specifications: [
                { label: 'Material', value: 'Genuine Crocodile' },
                { label: 'Finish', value: 'Premium Quality' },
                { label: 'Design', value: 'Contemporary African' },
                { label: 'Craftsmanship', value: 'Artisan Made' },
                { label: 'Exclusivity', value: 'Limited Edition' },
            ]
        }
    },
    {
        id: 3,
        image: '/ikemba_images/dune_cushion/dune_cushion_1_no_bg.png',
        title: 'Dune Cushion',
        topic: 'LEKKI MART COLLECTION',
        description: 'Beautifully designed dune-inspired cushions that bring the essence of African landscapes into your home. Handcrafted with premium materials and traditional patterns.',
        detail: {
            title: 'Dune Cushion Collection',
            description: 'Transform your living space with these stunning dune-inspired cushions. Each cushion features traditional African textile patterns and is crafted with premium materials that capture the natural beauty and warmth of African landscapes. The soft, comfortable design makes them perfect for both decorative and functional use in any modern home.',
            specifications: [
                { label: 'Material', value: 'Premium Fabric' },
                { label: 'Pattern', value: 'Traditional African' },
                { label: 'Design', value: 'Dune Inspired' },
                { label: 'Comfort', value: 'Premium Fill' },
                { label: 'Style', value: 'Contemporary' },
            ]
        }
    },
    {
        id: 4,
        image: '/ikemba_images/ahi__tote_bag/ahi__tote_bag_1_no_bg.png',
        title: 'Ahi Tote Bag',
        topic: 'LEKKI MART COLLECTION',
        description: 'Stylish and functional Ahi tote bag featuring contemporary African design elements. Perfect for everyday use while showcasing authentic cultural heritage.',
        detail: {
            title: 'Ahi Tote Bag',
            description: 'The Ahi tote bag combines modern functionality with traditional African aesthetics. Made from high-quality materials and featuring distinctive cultural patterns, this versatile bag is perfect for daily use while making a bold fashion statement. Its spacious design and durable construction make it ideal for work, travel, or casual outings.',
            specifications: [
                { label: 'Style', value: 'Contemporary African' },
                { label: 'Functionality', value: 'Multi-purpose' },
                { label: 'Durability', value: 'High Quality' },
                { label: 'Design', value: 'Cultural Heritage' },
                { label: 'Usage', value: 'Everyday' },
            ]
        }
    },
    {
        id: 5,
        image: '/ikemba_images/curlt_life_body_butter/curlt_life_body_butter_1_no_bg.png',
        title: 'Curl Life Body Butter',
        topic: 'LEKKI MART COLLECTION',
        description: 'Nourishing body butter specially formulated for natural hair care. Enriched with African botanical extracts and traditional ingredients for healthy, beautiful curls.',
        detail: {
            title: 'Curl Life Body Butter',
            description: 'Pamper your skin and hair with this luxurious body butter crafted with traditional African ingredients. Formulated with natural botanical extracts, shea butter, and coconut oil, this nourishing cream provides deep hydration while celebrating the beauty of natural hair textures. Perfect for daily use, it leaves skin soft, moisturized, and beautifully scented with authentic African aromas.',
            specifications: [
                { label: 'Ingredients', value: 'African Botanicals' },
                { label: 'Formula', value: 'Natural & Organic' },
                { label: 'Benefits', value: 'Deep Hydration' },
                { label: 'Scent', value: 'Traditional Aromas' },
                { label: 'Target', value: 'Natural Hair Care' },
            ]
        }
    }
];

export default function HeroCarousel() {
    const [carouselItems, setCarouselItems] = useState(items);
    const [showDetail, setShowDetail] = useState(false);
    const [direction, setDirection] = useState('');
    const carouselRef = useRef<HTMLDivElement>(null);

    const handleNext = () => {
        setDirection('next');
        setShowDetail(false);
        setCarouselItems((prev) => {
            const newItems = [...prev];
            const first = newItems.shift();
            if (first) newItems.push(first);
            return newItems;
        });
    };

    const handlePrev = () => {
        setDirection('prev');
        setShowDetail(false);
        setCarouselItems((prev) => {
            const newItems = [...prev];
            const last = newItems.pop();
            if (last) newItems.unshift(last);
            return newItems;
        });
    };

    const handleSeeMore = () => {
        setShowDetail(true);
    };

    const handleBack = () => {
        setShowDetail(false);
    };

    // Use useLayoutEffect to prevent animation flickering ("slides twice")
    // This ensures classes are added before the browser paints the DOM updates
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

    useIsomorphicLayoutEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.classList.remove('next', 'prev');
            // Trigger reflow
            void carousel.offsetWidth;
            if (direction) {
                carousel.classList.add(direction);
            }
        }
    }, [carouselItems, direction]);

    return (
        <div className={`carousel ${showDetail ? 'showDetail' : ''} ${direction}`} ref={carouselRef}>
            <div className="list">
                {carouselItems.map((item, index) => (
                    <div className="item" key={item.id}>
                        <div className="relative w-full h-full">
                            <img src={item.image} alt={item.title} className="object-contain" />
                        </div>
                        <div className="introduce">
                            <div className="title text-2xl font-medium leading-none text-earth-black">{item.topic}</div>
                            <div className="topic text-6xl font-medium text-earth-black">{item.title}</div>
                            <div className="des text-sm text-gray-600 mt-4 font-medium">{item.description}</div>
                            <button className="seeMore mt-4 px-4 py-2 border-b border-earth-black text-earth-black bg-transparent font-bold hover:bg-gray-100 transition-colors" onClick={handleSeeMore}>
                                SEE MORE &#8599;
                            </button>
                        </div>
                        <div className="detail">
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
                                <button className="px-6 py-2 border border-earth-black text-earth-black bg-transparent font-medium hover:bg-gray-100 transition-colors">ADD TO CART</button>
                                <button className="px-6 py-2 bg-earth-red-brown text-white font-medium hover:bg-earth-dark-brown transition-colors">CHECKOUT</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="arrows absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[1140px] flex justify-between z-50">
                <button id="prev" onClick={handlePrev} className="w-10 h-10 rounded-full border border-earth-black text-earth-black bg-transparent font-mono text-lg hover:bg-gray-200 transition-colors">&lt;</button>
                <button id="next" onClick={handleNext} className="w-10 h-10 rounded-full border border-earth-black text-earth-black bg-transparent font-mono text-lg hover:bg-gray-200 transition-colors">&gt;</button>
                <button id="back" onClick={handleBack} className={`absolute bottom-0 left-1/2 -translate-x-1/2 border-b border-earth-black text-earth-black bg-transparent font-bold p-2 transition-opacity duration-500 ${showDetail ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    See All &#8599;
                </button>
            </div>
        </div>
    );
}
