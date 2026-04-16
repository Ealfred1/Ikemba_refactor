import { NextResponse } from 'next/server';

const MERCHANT_REF = process.env.CHOWDECK_MERCHANT_REFERENCE || '133994';
const API_BASE = process.env.CHOWDECK_API_URL || 'https://api.chowdeck.com';
const API_TOKEN = process.env.CHOWDECK_API_TOKEN || '';

function chowdeckHeaders() {
    const h: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    if (API_TOKEN) h['Authorization'] = `Bearer ${API_TOKEN}`;
    return h;
}

/**
 * POST /api/delivery/fee
 * Body: { destination_lat: string, destination_lng: string, estimated_order_amount: number }
 *
 * Returns: { id, delivery_amount, total_amount } (amounts in naira)
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { destination_lat, destination_lng, estimated_order_amount = 0 } = body;

        if (!destination_lat || !destination_lng) {
            return NextResponse.json(
                { error: 'destination_lat and destination_lng are required' },
                { status: 400 }
            );
        }

        const payload = {
            source_address: {
                // Lekki Mart — 11b Shafi Sule St, Lekki Phase I, Lagos
                latitude: process.env.STORE_LATITUDE || '6.4310',
                longitude: process.env.STORE_LONGITUDE || '3.4748',
            },
            destination_address: {
                latitude: String(destination_lat),
                longitude: String(destination_lng),
            },
            estimated_order_amount: Math.round(estimated_order_amount * 100), // convert to kobo
        };

        const res = await fetch(`${API_BASE}/merchant/${MERCHANT_REF}/delivery/fee`, {
            method: 'POST',
            headers: chowdeckHeaders(),
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('[/api/delivery/fee] Chowdeck error:', err);
            return NextResponse.json(
                { error: 'Failed to calculate delivery fee' },
                { status: res.status }
            );
        }

        const json = await res.json();
        const data = json.data;

        return NextResponse.json({
            id: data.id,
            delivery_amount: data.delivery_amount / 100,   // kobo → naira
            total_amount: data.total_amount / 100,
            service_amount: data.service_amount / 100,
            safety_fee: data.safety_fee / 100,
        });
    } catch (error) {
        console.error('[/api/delivery/fee] Failed:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
