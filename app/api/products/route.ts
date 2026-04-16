import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/chowdeck';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') ?? undefined;
        const products = await getProducts(category);
        return NextResponse.json(products);
    } catch (error) {
        console.error('[/api/products] Failed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
