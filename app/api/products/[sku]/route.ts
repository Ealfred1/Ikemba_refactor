import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/chowdeck';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ sku: string }> }
) {
    try {
        const { sku } = await params;
        const product = await getProductById(sku);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('[/api/products/[sku]] Failed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}
