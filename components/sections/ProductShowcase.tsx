'use client';

import { useState } from 'react';

const products = [
    {
        id: 1,
        title: 'Premium Leather',
        price: '$299',
        image: '/ikemba_images/camel_skin_leather_bag/camel_skin_leather_bag_1_no_bg.png',
        bgImage: '/ikemba_images/camel_skin_leather_bag/camel_skin_leather_bag_1_no_bg.png'
    },
    {
        id: 2,
        title: 'Nigeria Dreams',
        price: '$45',
        image: '/ikemba_images/new_products/product_1_no_bg.png',
        bgImage: '/ikemba_images/new_products/product_1_no_bg.png'
    },
    {
        id: 3,
        title: 'Delete Fear',
        price: '$40',
        image: '/ikemba_images/new_products/product_2_no_bg.png',
        bgImage: '/ikemba_images/new_products/product_2_no_bg.png'
    },
    {
        id: 4,
        title: 'African Jewelry',
        price: '$85',
        image: '/ikemba_images/new_products/product_4_no_bg.png',
        bgImage: '/ikemba_images/new_products/product_4_no_bg.png'
    },
    {
        id: 5,
        title: 'Woven Basket',
        price: '$120',
        image: '/ikemba_images/new_products/product_5_no_bg.png',
        bgImage: '/ikemba_images/new_products/product_5_no_bg.png'
    },
    {
        id: 6,
        title: 'Leather Sandals',
        price: '$95',
        image: '/ikemba_images/new_products/product_6_no_bg.png',
        bgImage: '/ikemba_images/new_products/product_6_no_bg.png'
    },
    {
        id: 7,
        title: 'Traditional Pottery',
        price: '$150',
        image: '/ikemba_images/new_products/product_7_no_bg.png',
        bgImage: '/ikemba_images/new_products/product_7_no_bg.png'
    },
    {
        id: 8,
        title: 'African Textile',
        price: '$75',
        image: '/ikemba_images/new_products/product_8_no_bg.png',
        bgImage: '/ikemba_images/new_products/product_8_no_bg.png'
    },
    {
        id: 9,
        title: 'Handwoven Fabric',
        price: '$110',
        image: '/ikemba_images/new_products/product_9_no_bg.png',
        bgImage: '/ikemba_images/new_products/product_9_no_bg.png'
    },
    {
        id: 10,
        title: 'Cultural Art',
        price: '$200',
        image: '/ikemba_images/new_products/product_10_no_bg.png',
        bgImage: '/ikemba_images/new_products/product_10_no_bg.png'
    }
];

export default function ProductShowcase() {
    return (
        <section className="min-h-screen bg-[#CDCDCD] relative overflow-hidden py-20">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_right,transparent_0_150px,#0001_150px_151px),repeating-linear-gradient(to_bottom,transparent_0_150px,#0001_150px_151px)] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-[10vw] font-antonio leading-[0.8em] text-center mb-20 text-[#1E1E1E]">
                    FEATURED<br />PRODUCTS
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 h-auto items-end">
                    {products.map((product) => (
                        <div key={product.id} className="group relative w-full h-[400px] flex justify-center items-end cursor-pointer transition-all duration-700 hover:h-[500px]">
                            <div className="absolute bottom-0 w-full h-full flex justify-center items-end transition-all duration-700 group-hover:pb-20">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-[280px] object-contain drop-shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-10"
                                />
                            </div>

                            <div className="absolute bottom-10 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                <h3 className="text-3xl font-bebas text-[#1E1E1E]">{product.title}</h3>
                                <p className="text-xl font-sans text-[#1E1E1E]">{product.price}</p>
                                <button className="mt-4 px-6 py-2 bg-[#1E1E1E] text-white rounded-full hover:bg-black transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
