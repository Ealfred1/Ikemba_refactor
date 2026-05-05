'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';

export default function ForgotPasswordPage() {
    const supabase = createBrowserSupabaseClient();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
            redirectTo: typeof window !== 'undefined'
                ? `${window.location.origin}/reset-password`
                : undefined,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
            return;
        }

        setSuccess(true);
    };

    if (success) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="bg-surface p-12 rounded-[3rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.15)] text-center max-w-md border border-border text-foreground">
                    <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-lekki-lime/10 flex items-center justify-center">
                        <svg className="w-10 h-10 text-lekki-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-serif text-foreground mb-4 tracking-tighter">Check Your Email</h2>
                    <p className="text-foreground/40 mb-2 font-medium tracking-tight">
                        We sent a password reset link to
                    </p>
                    <p className="text-lekki-lime font-bold mb-8">{email}</p>
                    <Link href="/login" className="inline-block bg-lekki-lime text-lekki-black px-12 py-5 rounded-md font-black hover:bg-white transition-all shadow-xl active:scale-95 uppercase tracking-tight text-sm">
                        Back to Sign In
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background relative flex font-sans text-foreground overflow-hidden">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12 xl:p-16">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-lekki-lime/15 via-background/80 to-background z-10"></div>
                    <Image
                        src="/o8x5ZQT9LFCkNbmR8zcin.png"
                        alt="Lekki Mart"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                </div>

                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-lekki-lime/5 animate-float"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-lekki-lime/5 animate-float" style={{ animationDelay: '2s' }}></div>
                </div>

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

                <div className="relative z-10 max-w-xl">
                    <h1 className="text-7xl xl:text-8xl font-serif text-foreground leading-[0.8] tracking-tighter mb-6">
                        Reset<br />
                        <span className="text-lekki-lime">Password.</span>
                    </h1>
                    <p className="text-xl text-foreground/30 font-medium leading-relaxed max-w-sm">
                        No worries. Enter your email and we will send you a secure reset link.
                    </p>
                </div>

                <div className="relative z-10 pt-8 border-t border-foreground/5">
                    <Link href="/login" className="text-sm font-bold text-foreground/40 hover:text-lekki-lime transition-colors">
                        ← Back to Sign In
                    </Link>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 md:p-12 xl:p-16 relative">
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

                <div className="w-full max-w-md">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-lekki-lime/10 flex items-center justify-center text-lekki-lime mb-10">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif text-foreground tracking-tighter mb-2">
                            Forgot Password
                        </h2>
                        <div className="h-1 w-16 bg-lekki-lime rounded-full"></div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-md mb-8">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleReset} className="space-y-8">
                        <div className="space-y-3 group">
                            <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">Email Address</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                type="email"
                                className="w-full bg-transparent border-b-2 border-border py-4 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-lekki-lime text-lekki-black font-black rounded-md shadow-2xl shadow-lekki-lime/10 hover:bg-foreground hover:text-background transition-all text-center active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3 tracking-tight uppercase text-sm mt-8"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-lekki-black/20 border-t-lekki-black rounded-full animate-spin"></div>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <div className="lg:hidden mt-8">
                        <Link href="/login" className="text-sm font-bold text-foreground/40 hover:text-lekki-lime transition-colors">
                            ← Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
