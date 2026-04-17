import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/checkout/', '/address/'],
        },
        sitemap: 'https://lekkimart.com/sitemap.xml',
    };
}
