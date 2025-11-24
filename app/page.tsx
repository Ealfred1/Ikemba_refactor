import HeroCarousel from '@/components/sections/HeroCarousel';
import StarbucksSlider from '@/components/sections/StarbucksSlider';
import ProductShowcase from '@/components/sections/ProductShowcase';
import FeaturedCollections from '@/components/sections/FeaturedCollections';

export default function Home() {
  return (
    <main className="min-h-screen bg-earth-milk overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="logo font-bold text-2xl tracking-tighter">IKEMBA</div>
        <nav className="flex gap-8">
          <a href="#" className="text-gray-800 hover:text-black font-medium">Home</a>
          <a href="#" className="text-gray-800 hover:text-black font-medium">Products</a>
          <a href="#" className="text-gray-800 hover:text-black font-medium">About</a>
          <a href="#" className="text-gray-800 hover:text-black font-medium">Contact</a>
        </nav>
      </header>

      <HeroCarousel />

      {/* "Discover" section with matching background style - using a gradient that blends with the hero/slider */}
      <div className="relative z-10 py-20 bg-gradient-to-b from-transparent to-earth-milk mt-[-50px]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif mb-6 text-earth-black">Discover African Luxury</h2>
          <p className="max-w-2xl mx-auto text-gray-700 font-medium">
            Ikemba brings you the finest handcrafted goods from across the continent.
            Each piece tells a story of heritage, craftsmanship, and timeless beauty.
          </p>
        </div>
      </div>

      <StarbucksSlider />

      <FeaturedCollections />

      <ProductShowcase />

      <footer className="bg-earth-black text-earth-milk py-20 px-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-6">IKEMBA</h3>
            <p className="opacity-70">Celebrating African excellence through design and craftsmanship.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 opacity-70">
              <li><a href="#" className="hover:text-white">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white">Collections</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">About</h4>
            <ul className="space-y-2 opacity-70">
              <li><a href="#" className="hover:text-white">Our Story</a></li>
              <li><a href="#" className="hover:text-white">Artisans</a></li>
              <li><a href="#" className="hover:text-white">Sustainability</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="bg-transparent border-b border-white/30 py-2 outline-none focus:border-white w-full" />
              <button className="text-sm font-bold uppercase tracking-wider">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-10 border-t border-white/10 text-center opacity-50 text-sm">
          &copy; 2024 Ikemba. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
