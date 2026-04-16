import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Header } from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-lekki-black text-white overflow-x-hidden font-sans">
      <Header />

      {/* Hero Section - High Contrast Cyber Aesthetic */}
      <section className="pt-40 pb-20 px-6 md:px-12 relative overflow-hidden bg-lekki-black">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lekki-lime/10 rounded-full blur-[150px] -mr-40 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lekki-lime/5 rounded-full blur-[100px] -ml-20 -mb-20"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-lekki-lime/20 bg-lekki-lime/5 mb-8 animate-show-content">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lekki-lime opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lekki-lime"></span>
                </span>
                <span className="text-[10px] font-bold text-lekki-lime">Open for Refined Essentials</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-serif text-white leading-[0.85] tracking-tight mb-8">
              LEKKI MART<br />
              <span className="text-lekki-lime">DRINKS & SNACKS</span><br />
              WATER, GROCERIES.
            </h1>
            
            <p className="text-lg md:text-xl text-white/40 max-w-2xl font-medium leading-relaxed mb-12 animate-show-content" style={{ animationDelay: '0.2s' }}>
              We stock premium beverages, snacks, toiletries, household supplies, and daily needs at quality. 
              Curated for the Lekki Phase I community.
            </p>

            <div className="flex flex-wrap gap-4">
                <button className="px-10 py-5 bg-lekki-lime text-lekki-black font-black rounded-md hover:bg-white transition-all shadow-2xl shadow-lekki-lime/20 active:scale-95">
                    Start Shopping
                </button>
                <button className="px-10 py-5 bg-white/5 text-white font-bold rounded-md border border-white/10 hover:bg-white/10 transition-all active:scale-95">
                    Find Nearest Store
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Listing - Dark Grid */}
      <section className="py-24 px-6 md:px-12 bg-lekki-black">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-[10px] font-black text-lekki-lime mb-4">Stock Availability</h2>
              <p className="text-4xl md:text-5xl font-serif text-white leading-tight">Handpicked Quality Selection</p>
            </div>
            <div className="flex items-center gap-4 bg-lekki-gray p-2 rounded-md border border-white/5">
                <div className="px-6 py-3 bg-lekki-dark rounded-md text-xs font-bold text-lekki-lime border border-lekki-lime/20">All Products</div>
                <div className="px-6 py-3 text-xs font-bold text-white/30 hover:text-white transition-colors cursor-pointer">Best Sellers</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((product, index) => (
              <ProductCard key={`${product.sku}-${product.name}-${index}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Full Business Info */}
      <footer className="bg-lekki-dark text-white py-32 px-6 md:px-12 border-t border-white/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
            <div className="md:col-span-5">
              <div className="flex items-center gap-4 mb-8">
                <div className="relative w-12 h-12 overflow-hidden rounded-md border border-white/10">
                    <Image 
                        src="/branding/logo.png" 
                        alt="Lekki Mart" 
                        fill 
                        className="object-contain"
                    />
                </div>
                <h3 className="text-3xl font-antonio font-bold text-lekki-lime uppercase tracking-tighter leading-none">LEKKI MART</h3>
              </div>
              <p className="opacity-40 text-sm leading-relaxed max-w-sm mb-10">
                Lekki Mart is a premium supermarket stocking high-quality beverages, snacks, toiletries, and daily household supplies. 
                Dedicated to agba service standards in Lekki Phase I.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-lekki-lime group-hover:text-lekki-black transition-all">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </div>
                    <span className="text-xs font-bold opacity-60">11b Shafi Sule St, Lekki Phase I, Lagos</span>
                </div>
                <div className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-lekki-lime group-hover:text-lekki-black transition-all">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    </div>
                    <span className="text-xs font-bold opacity-60">learnlive524@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-lekki-lime group-hover:text-lekki-black transition-all">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </div>
                    <span className="text-xs font-bold opacity-60">07012428801</span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-[10px] font-black mb-10 text-lekki-lime">Shop Tier</h4>
              <ul className="space-y-4 text-xs font-bold opacity-40">
                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Supermarket</li>
                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Liquor Store</li>
                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Daily Goods</li>
                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Household</li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-[10px] font-black mb-10 text-lekki-lime">Service</h4>
              <ul className="space-y-4 text-xs font-bold opacity-40">
                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Onboarding</li>
                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Delivery Maps</li>
                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Returns Policy</li>
                <li className="hover:text-lekki-lime transition-colors cursor-pointer">Audit Logs</li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="text-[10px] font-black mb-10 text-lekki-lime">Connect</h4>
              <div className="flex gap-4 mb-10">
                <input 
                  type="email" 
                  placeholder="Supermarket News" 
                  className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-lekki-lime transition-colors w-full text-xs font-bold tracking-widest" 
                />
                <button className="text-[10px] font-black text-lekki-lime hover:text-white transition-colors">Apply</button>
              </div>
              <div className="p-4 bg-lekki-lime/5 rounded-md border border-lekki-lime/10">
                <p className="text-[10px] font-bold text-white mb-2">Business Tier</p>
                <p className="text-xl font-antonio font-bold text-lekki-lime uppercase italic">AGBA TIER</p>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 text-[10px] font-black">
            <div>&copy; 2026 Lekki Mart Supermarket. Lagos, Nigeria.</div>
            <div className="flex gap-8">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Developer</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
