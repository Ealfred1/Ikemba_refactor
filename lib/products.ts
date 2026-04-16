import fs from 'fs';
import path from 'path';

export interface Product {
    sku: string;
    barcode: string;
    name: string;
    price: number;
    discountedPrice: number;
    image: string;
}

export async function getProducts(): Promise<Product[]> {
    const csvPath = path.join(process.cwd(), 'public/data/products.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');

    const lines = csvData.split('\n');
    const products: Product[] = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        if (parts.length >= 5) {
            const name = parts[2].replace(/^"|"$/g, '');
            products.push({
                sku: parts[0],
                barcode: parts[1],
                name: name,
                price: parseFloat(parts[3]) || 0,
                discountedPrice: parseFloat(parts[4]) || 0,
                image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop` // Placeholder
            });
        }
    }

    return products;
}

export async function getProductBySku(skuId: string): Promise<Product | null> {
    // For now, since it's a small CSV, we'll just reuse getProducts and filter
    // In a real DB we'd query by ID.
    const products = await getProducts();
    // Also handling the case where ID might be the hashed version if SKU is empty
    return products.find(p => {
        const productHash = p.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString();
        return p.sku === skuId || productHash === skuId;
    }) || null;
}
