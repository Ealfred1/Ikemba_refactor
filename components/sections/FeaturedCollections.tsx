'use client';

import Image from 'next/image';

const collections = [
    {
        id: 1,
        title: 'Heritage Series',
        image: '/ikemba_images/camel_skin_leather_bag/camel_skin_leather_bag_1_no_bg.png',
        description: 'Timeless pieces that celebrate our roots.',
        bgColor: '#8B4513'
    },
    {
        id: 2,
        title: 'Modern Africa',
        image: '/ikemba_images/a_cold_wall_/a_cold_wall__1_no_bg.png',
        description: 'Contemporary designs for the modern world.',
        bgColor: '#2F4F4F'
    },
    {
        id: 3,
        title: 'Artisan Crafted',
        image: '/ikemba_images/mbe__wooden_tortoise_figurine/mbe__wooden_tortoise_figurine_1_no_bg.png',
        description: 'Handmade with love and precision.',
        bgColor: '#A0522D'
    }
];

export default function FeaturedCollections() {
    return (
        <section className="py-20 bg-earth-milk">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-serif text-center mb-12 text-earth-black">Featured Collections</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {collections.map((collection) => (
                        <div key={collection.id} className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer h-[400px]">
                            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: collection.bgColor }}>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                            </div>
                            <div className="relative h-full flex flex-col items-center justify-center p-6 text-center z-10">
                                <div className="w-48 h-48 relative mb-6 transform group-hover:-translate-y-4 transition-transform duration-300">
                                    <Image
                                        src={collection.image}
                                        alt={collection.title}
                                        fill
                                        className="object-contain drop-shadow-xl"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">{collection.title}</h3>
                                <p className="text-white/90 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    {collection.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
