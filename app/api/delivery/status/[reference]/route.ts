import { NextResponse } from 'next/server';

const MERCHANT_REF = process.env.CHOWDECK_MERCHANT_REFERENCE || '133994';
const API_BASE = process.env.CHOWDECK_API_URL || 'https://api.chowdeck.com';
const API_TOKEN = process.env.CHOWDECK_API_TOKEN || '';

function chowdeckHeaders() {
    const h: Record<string, string> = {
        Accept: 'application/json',
    };
    if (API_TOKEN) h['Authorization'] = `Bearer ${API_TOKEN}`;
    return h;
}

/**
 * GET /api/delivery/status/[reference]
 * 
 * Fetches the current status of a Chowdeck delivery (preparing, picked_up, received, etc.)
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ reference: string }> }
) {
    try {
        const { reference } = await params;

        const res = await fetch(`${API_BASE}/merchant/delivery/${reference}`, {
            method: 'GET',
            headers: chowdeckHeaders(),
            // No-store for status tracking to get real-time data
            cache: 'no-store',
        });

        if (!res.ok) {
            const err = await res.text();
            console.error(`[/api/delivery/status/${reference}] Chowdeck error:`, err);
            return NextResponse.json(
                { error: 'Failed to fetch delivery status' },
                { status: res.status }
            );
        }

        const json = await res.json();
        const data = json.data;

        // Simplify the response for our frontend
        return NextResponse.json({
            id: data.id,
            total_price: data.total_price / 100,
            reference: data.reference,
            status: data.status,
            summary: data.summary,
            created_at: data.created_at,
            delivery_price: data.delivery_price / 100,
            driver: data.driver || null,
        });
    } catch (error) {
        console.error('[/api/delivery/status] Failed:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
