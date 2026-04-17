import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/chowdeck';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://lekkimart.com';
    
    // Core pages
    const routes = ['', '/address', '/checkout'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        // Dynamic product pages from Chowdeck API
        const products = await getProducts();
        const productEntries = products.map((product) => ({
            url: `${baseUrl}/product/${product.id}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.6,
        }));

        return [...routes, ...productEntries];
    } catch (error) {
        console.error('Sitemap generation failed:', error);
        return routes;
    }
}
