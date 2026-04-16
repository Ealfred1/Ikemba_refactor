import { NextRequest, NextResponse } from 'next/server';
import { getProductBySku } from '@/lib/products';

export async function GET(
    request: NextRequest,
    { params }: { params: { sku: string } }
) {
    try {
        const sku = params.sku;
        const product = await getProductBySku(sku);
        
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        
        return NextResponse.json(product);
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}
