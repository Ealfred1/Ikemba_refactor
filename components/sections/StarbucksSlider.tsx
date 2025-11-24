'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

const items = [
    {
        id: 1,
        title: 'Nigeria Dreams Collection',
        price: '$ 45',
        description: 'Experience the vibrant spirit of Nigeria through our exclusive Dreams Collection. Each piece tells a story of hope, resilience, and cultural pride, crafted with traditional techniques passed down through generations of African artisans.',
        image: '/ikemba_images/nigeria_dreams/nigeria_dreams_1_no_bg.png',
        bgColor: '#8B4513'
    },
    {
        id: 2,
        title: 'No Child Left Out Initiative',
        price: '$ 35',
        description: 'Supporting education and opportunity for every child through our meaningful collection. Each purchase contributes to educational programs across Africa, ensuring no child is left behind in the journey of learning and growth.',
        image: '/ikemba_images/no_child_is_left_out/no_child_is_left_out_1_no_bg.png',
        bgColor: '#D2691E'
    },
    {
        id: 3,
        title: 'Delete Every Fear',
        price: '$ 40',
        description: 'Empowering individuals to overcome challenges and embrace their potential. Our Delete Every Fear collection represents courage, strength, and the power of positive transformation in every African community.',
        image: '/ikemba_images/delete_every_fear/delete_every_fear_1_no_bg.png',
        bgColor: '#CD853F'
    },
    {
        id: 4,
        title: 'A Cold Wall Collection',
        price: '$ 55',
        description: 'Contemporary African design meets modern aesthetics in our Cold Wall collection. Featuring bold patterns and innovative materials that celebrate African creativity while embracing contemporary lifestyle needs.',
        image: '/ikemba_images/a_cold_wall_/a_cold_wall__1_no_bg.png',
        bgColor: '#A0522D'
    },
    {
        id: 5,
        title: 'Public Figure Series',
        price: '$ 50',
        description: 'Celebrating influential African leaders and changemakers through our Public Figure series. Each piece honors the legacy of those who have shaped African history and continue to inspire future generations.',
        image: '/ikemba_images/public_figure/public_figure_1_no_bg.png',
        bgColor: '#8FBC8F'
    }
];

export default function StarbucksSlider() {
    const [active, setActive] = useState(0);
    const [direction, setDirection] = useState('');
    const sliderRef = useRef<HTMLElement>(null);

    const handleNext = () => {
        setDirection('next');
        setActive((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setDirection('prev');
        setActive((prev) => (prev - 1 + items.length) % items.length);
    };

    // Use useLayoutEffect to prevent animation flickering
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

    useIsomorphicLayoutEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            slider.classList.remove('next', 'prev');
            // Trigger reflow
            void slider.offsetWidth;
            if (direction) {
                slider.classList.add(direction);
            }
        }
    }, [active, direction]);

    const getOther1Index = () => {
        if (direction === 'next') {
            return (active - 1 + items.length) % items.length;
        } else {
            return (active + 1) % items.length;
        }
    };

    const getOther2Index = () => {
        if (direction === 'next') {
            return (active + 1) % items.length;
        } else {
            // In prev direction, other_2 is other_1 + 1
            const other1 = (active + 1) % items.length;
            return (other1 + 1) % items.length;
        }
    };

    return (
        <section className={`starbucks-carousel relative w-full h-screen overflow-hidden bg-starbucks-green mt-[-80px] ${direction}`} ref={sliderRef}>
            <div className="list h-full relative">
                {/* Background Circle Decoration */}
                <div className="absolute top-[50px] left-[50px] w-[400px] h-[300px] bg-red-500 rounded-[20px_50px_110px_230px] blur-[150px] opacity-60 pointer-events-none z-10"></div>

                {/* Vertical Lines Decoration */}
                <div className="absolute top-0 left-[calc(100%-calc(500px*1.5))] w-[500px] h-full border-l border-r border-white/20 pointer-events-none z-10 hidden lg:block"></div>

                {items.map((item, index) => {
                    let className = 'item absolute top-0 left-0 w-full h-full hidden';
                    if (index === active) className = 'item active absolute top-0 left-0 w-full h-full block z-20';
                    else if (index === getOther1Index()) className = 'item other_1 absolute top-0 left-0 w-full h-full block pointer-events-none';
                    else if (index === getOther2Index()) className = 'item other_2 absolute top-0 left-0 w-full h-full block pointer-events-none';

                    return (
                        <article key={item.id} className={className}>
                            <div className="main-content h-full grid grid-cols-1 lg:grid-cols-[calc(100%-calc(500px*1.5))]" style={{ backgroundColor: item.bgColor }}>
                                <div className="content p-[150px_20px_20px_80px] hidden lg:block">
                                    <h2 className="text-5xl font-aboreto text-white leading-[1.1] mb-5">{item.title}</h2>
                                    <p className="price font-aboreto text-3xl my-5 text-white">{item.price}</p>
                                    <p className="description text-white/90 text-lg leading-[1.6] my-5 max-w-[600px]">
                                        {item.description}
                                    </p>
                                    <button className="addToCard bg-starbucks-green text-white px-[30px] py-[10px] font-sans text-lg font-medium rounded-[30px] border-none mt-5 cursor-pointer transition-colors hover:bg-starbucks-dark-green">
                                        Add To Cart
                                    </button>
                                </div>
                            </div>
                            <figure className="image absolute top-0 left-0 lg:left-[calc(100%-calc(500px*1.5))] w-full lg:w-[500px] h-full p-5 flex flex-col justify-end lg:justify-center items-center font-medium">
                                <img src={item.image} alt={item.title} className="w-[90%] max-w-[400px] h-auto object-contain mb-5 drop-shadow-[0_150px_50px_rgba(158,12,12,0.33)]" />
                                <figcaption className="font-aboreto font-bold text-[1.3em] text-center mb-[30px] w-[90%] text-[#333]">
                                    {item.title}
                                </figcaption>
                            </figure>
                        </article>
                    );
                })}
            </div>

            <div className="arrows absolute bottom-5 w-full lg:w-[calc(100%-calc(500px*1.5))] grid grid-cols-[50px_50px] grid-rows-[50px] justify-center lg:justify-end gap-[10px] z-30 px-5">
                <button id="starbucks-prev" onClick={handlePrev} className="bg-transparent border border-white/20 text-white font-mono text-lg font-bold shadow-[0_10px_40px_rgba(85,85,85,0.33)] cursor-pointer transition-all hover:bg-white/20 flex items-center justify-center rounded-full">
                    &lt;
                </button>
                <button id="starbucks-next" onClick={handleNext} className="bg-transparent border border-white/20 text-white font-mono text-lg font-bold shadow-[0_10px_40px_rgba(85,85,85,0.33)] cursor-pointer transition-all hover:bg-white/20 flex items-center justify-center rounded-full">
                    &gt;
                </button>
            </div>
        </section>
    );
}
