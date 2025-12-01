'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddressPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, save address to context or DB
        router.push('/checkout');
    };

    return (
        <main className="min-h-screen bg-earth-milk relative overflow-hidden flex items-center justify-center py-20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-earth-red-brown opacity-20 blur-[100px] animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-earth-dark-brown opacity-20 blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-show-content">

                    {/* Left Side - Visual */}
                    <div className="w-full md:w-1/3 bg-earth-black text-white p-10 flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <Link href="/" className="text-2xl font-bold tracking-tighter mb-10 block">IKEMBA</Link>
                            <h2 className="text-4xl font-antonio leading-tight mb-4">SHIPPING<br />DETAILS</h2>
                            <p className="text-white/60 text-sm">Please enter your delivery information to proceed with the order.</p>
                        </div>
                        <div className="relative z-10 mt-10">
                            <div className="flex items-center gap-4 text-sm text-white/40">
                                <span className="text-white font-bold">01 Address</span>
                                <div className="h-[1px] w-10 bg-white/20"></div>
                                <span>02 Checkout</span>
                            </div>
                        </div>

                        {/* Decorative Circle */}
                        <div className="absolute bottom-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full border border-white/10"></div>
                        <div className="absolute bottom-[-30px] right-[-30px] w-[160px] h-[160px] rounded-full border border-white/10"></div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-2/3 p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-earth-black uppercase tracking-wider">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                        placeholder="John"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-earth-black uppercase tracking-wider">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                        placeholder="Doe"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-earth-black uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                    placeholder="john@example.com"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-earth-black uppercase tracking-wider">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                    placeholder="123 Fashion St"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-earth-black uppercase tracking-wider">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                        placeholder="New York"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-earth-black uppercase tracking-wider">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        required
                                        className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                        placeholder="NY"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-earth-black uppercase tracking-wider">Zip Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        required
                                        className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                        placeholder="10001"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-earth-black uppercase tracking-wider">Country</label>
                                <select
                                    name="country"
                                    className="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-earth-red-brown transition-colors"
                                    onChange={handleChange}
                                >
                                    <option value="">Select Country</option>
                                    <option value="US">United States</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="CA">Canada</option>
                                    <option value="NG">Nigeria</option>
                                </select>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-earth-black text-white font-bold tracking-widest hover:bg-earth-red-brown transition-colors rounded-full"
                                >
                                    CONTINUE TO CHECKOUT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
