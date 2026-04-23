import { NextResponse } from 'next/server';
import { createChowdeckDelivery } from '@/lib/chowdeck';

/**
 * POST /api/delivery/create
 * Body: {
 *   fee_id: number,
 *   customer_name: string,
 *   customer_phone: string,
 *   customer_email?: string,
 *   estimated_order_amount: number,  (naira)
 *   delivery_note?: string,
 * }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = await createChowdeckDelivery(body);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('[/api/delivery/create] Failed:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
