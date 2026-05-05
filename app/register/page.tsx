'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createBrowserSupabaseClient();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (!form.phone || form.phone.length < 8) {
            setError('Please provide a valid phone number.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const { data, error: authError } = await supabase.auth.signUp({
            email: form.email.trim().toLowerCase(),
            password: form.password,
            options: {
                data: {
                    full_name: form.fullName.trim(),
                    phone: form.phone.trim(),
                },
                emailRedirectTo: typeof window !== 'undefined'
                    ? `${window.location.origin}/login`
                    : undefined,
            },
        });

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
            return;
        }

        if (data.user) {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="bg-surface p-12 rounded-[3rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.15)] text-center max-w-md border border-border animate-show-content text-foreground">
                    <div className="w-24 h-24 bg-lekki-lime text-lekki-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-lekki-lime/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-serif text-foreground mb-4 tracking-tighter">Welcome to Lekki Mart!</h2>
                    <p className="text-foreground/40 mb-8 font-medium tracking-tight">
                        Your account has been created. Check your email to verify, then start shopping.
                    </p>
                    <Link href="/login" className="inline-block bg-lekki-lime text-lekki-black px-12 py-5 rounded-md font-black hover:bg-white transition-all shadow-xl active:scale-95 uppercase tracking-tight text-sm">
                        Go to Sign In
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background relative flex font-sans text-foreground overflow-hidden">
            {/* Left Panel - Brand */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12 xl:p-16">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-tl from-lekki-lime/20 via-background/80 to-background z-10"></div>
                    <Image
                        src="/o8x5ZQT9LFCkNbmR8zcin.png"
                        alt="Lekki Mart"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-lekki-lime/5 animate-float"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-lekki-lime/5 animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-lekki-lime/5 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-lekki-lime/5 rounded-full"></div>
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative w-14 h-14 overflow-hidden">
                            <Image
                                src="/o8x5ZQT9LFCkNbmR8zcin.png"
                                alt="Lekki Mart"
                                fill
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <div className="logo font-antonio text-3xl font-bold tracking-tighter text-lekki-lime uppercase leading-none">
                            LEKKI MART
                        </div>
                    </Link>
                </div>

                {/* Hero Text */}
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-7xl xl:text-8xl font-serif text-foreground leading-[0.8] tracking-tighter mb-6">
                        Join<br />
                        <span className="text-lekki-lime">Lekki Mart.</span>
                    </h1>
                    <p className="text-xl text-foreground/30 font-medium leading-relaxed max-w-sm">
                        Create your account for seamless shopping, saved addresses, and order tracking.
                    </p>
                </div>

                {/* Bottom Features */}
                <div className="relative z-10 space-y-4 pt-8 border-t border-foreground/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-lekki-lime/10 flex items-center justify-center text-lekki-lime">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-foreground/60">Save delivery addresses for faster checkout</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-lekki-lime/10 flex items-center justify-center text-lekki-lime">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-foreground/60">Track all your orders in one place</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-lekki-lime/10 flex items-center justify-center text-lekki-lime">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-foreground/60">Never re-enter your details again</p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 md:p-12 xl:p-16 relative overflow-y-auto">
                {/* Mobile Logo */}
                <div className="lg:hidden absolute top-8 left-6">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-10 h-10 overflow-hidden">
                            <Image
                                src="/o8x5ZQT9LFCkNbmR8zcin.png"
                                alt="Lekki Mart"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="logo font-antonio text-xl font-bold tracking-tighter text-lekki-lime uppercase leading-none">
                            LEKKI MART
                        </div>
                    </Link>
                </div>

                <div className="w-full max-w-md py-16 lg:py-0">
                    {/* Header */}
                    <div className="mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif text-foreground tracking-tighter mb-2">
                            Create Account
                        </h2>
                        <div className="h-1 w-16 bg-lekki-lime rounded-full"></div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-md mb-8">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-3 group">
                            <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Full Name</label>
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                                type="text"
                                className="w-full bg-transparent border-b-2 border-border py-4 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                placeholder="Ikemba Efe"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3 group">
                                <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Email</label>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    type="email"
                                    className="w-full bg-transparent border-b-2 border-border py-4 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div className="space-y-3 group">
                                <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Phone</label>
                                <div className="flex items-center border-b-2 border-border focus-within:border-lekki-lime transition-colors">
                                    <span className="text-foreground/30 font-bold text-sm py-4 pr-3 select-none">+234</span>
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                        type="tel"
                                        className="flex-1 bg-transparent py-4 focus:outline-none text-foreground font-medium placeholder:text-foreground/20"
                                        placeholder="0701 242 8801"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3 group">
                                <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Password</label>
                                <input
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    type="password"
                                    className="w-full bg-transparent border-b-2 border-border py-4 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                    placeholder="At least 6 characters"
                                />
                            </div>
                            <div className="space-y-3 group">
                                <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Confirm</label>
                                <input
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    type="password"
                                    className="w-full bg-transparent border-b-2 border-border py-4 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                    placeholder="Re-enter password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-lekki-lime text-lekki-black font-black rounded-md shadow-2xl shadow-lekki-lime/10 hover:bg-foreground hover:text-background transition-all text-center active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3 tracking-tight uppercase text-sm mt-8"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-lekki-black/20 border-t-lekki-black rounded-full animate-spin"></div>
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-border"></div>
                        <span className="text-xs font-black text-foreground/20 uppercase tracking-tight">or</span>
                        <div className="flex-1 h-px bg-border"></div>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm font-medium text-foreground/40">
                        Already have an account?{' '}
                        <Link href="/login" className="text-lekki-lime font-bold hover:text-lekki-lime/80 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
