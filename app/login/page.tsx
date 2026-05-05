"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const supabase = createBrowserSupabaseClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-background relative flex font-sans text-foreground overflow-hidden">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12 xl:p-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-lekki-lime/20 via-black/80 to-background z-10"></div>
          <Image
            src="/o8x5ZQT9LFCkNbmR8zcin.png"
            alt="Lekki Mart"
            fill
            className="object-cover opacity-90"
            priority
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-lekki-lime/5 animate-float"></div>
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-lekki-lime/5 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
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
            Welcome
            <br />
            <span className="text-lekki-lime">Back.</span>
          </h1>
          <p className="text-xl text-foreground/30 font-medium leading-relaxed max-w-sm">
            Sign in to manage your orders, saved addresses, and enjoy a seamless
            shopping experience.
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 flex items-center gap-8 pt-8 border-t border-foreground/5">
          <div>
            <p className="text-3xl font-antonio font-bold text-lekki-lime">
              5 min
            </p>
            <p className="text-xs font-black text-foreground/30 uppercase tracking-tight">
              Express Delivery
            </p>
          </div>
          <div className="w-px h-12 bg-foreground/10"></div>
          <div>
            <p className="text-3xl font-antonio font-bold text-lekki-lime">
              24/7
            </p>
            <p className="text-xs font-black text-foreground/30 uppercase tracking-tight">
              Order Tracking
            </p>
          </div>
          <div className="w-px h-12 bg-foreground/10"></div>
          <div>
            <p className="text-3xl font-antonio font-bold text-lekki-lime">
              100%
            </p>
            <p className="text-xs font-black text-foreground/30 uppercase tracking-tight">
              Secure Payments
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 md:p-12 xl:p-16 relative">
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

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground tracking-tighter mb-2">
              Sign In
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
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3 group">
              <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                className="w-full bg-transparent border-b-2 border-border py-4 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-3 group">
              <label className="text-xs font-black text-lekki-lime opacity-40 group-focus-within:opacity-100 transition-opacity uppercase tracking-tight">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                className="w-full bg-transparent border-b-2 border-border py-4 focus:outline-none focus:border-lekki-lime transition-colors text-foreground font-medium placeholder:text-foreground/20"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/forgot-password"
                className="text-xs font-black text-lekki-lime/60 hover:text-lekki-lime transition-colors uppercase tracking-tight"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-lekki-lime text-lekki-black font-black rounded-md shadow-2xl shadow-lekki-lime/10 hover:bg-foreground hover:text-background transition-all text-center active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3 tracking-tight uppercase text-sm mt-8"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-lekki-black/20 border-t-lekki-black rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs font-black text-foreground/20 uppercase tracking-tight">
              or
            </span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm font-medium text-foreground/40">
            New to Lekki Mart?{" "}
            <Link
              href="/register"
              className="text-lekki-lime font-bold hover:text-lekki-lime/80 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
