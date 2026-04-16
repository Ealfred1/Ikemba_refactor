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
        const {
            fee_id,
            customer_name,
            customer_phone,
            customer_email,
            estimated_order_amount = 0,
            delivery_note,
        } = body;

        if (!fee_id || !customer_name || !customer_phone) {
            return NextResponse.json(
                { error: 'fee_id, customer_name, and customer_phone are required' },
                { status: 400 }
            );
        }

        // Normalize Nigerian phone number — strip leading 0 and add country code
        const phone = customer_phone.replace(/\D/g, '').replace(/^0/, '');

        const payload = {
            destination_contact: {
                name: customer_name,
                phone: phone,
                email: customer_email || undefined,
                country_code: 'NG',
            },
            source_contact: {
                phone: process.env.STORE_PHONE || '08012345678',
                email: process.env.STORE_EMAIL || 'orders@lekkimart.com',
                country_code: 'NG',
            },
            fee_id,
            item_type: 'food',
            user_action: 'sending',
            customer_delivery_note: delivery_note || 'Handle with care',
            customer_vendor_note: 'Fresh groceries from Lekki Mart',
            estimated_order_amount: Math.round(estimated_order_amount * 100), // kobo
            reference: `LKMT-${Date.now()}`,
        };

        const res = await fetch(`${API_BASE}/merchant/${MERCHANT_REF}/delivery`, {
            method: 'POST',
            headers: chowdeckHeaders(),
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('[/api/delivery/create] Chowdeck error:', err);
            return NextResponse.json(
                { error: 'Failed to create delivery' },
                { status: res.status }
            );
        }

        const json = await res.json();
        return NextResponse.json(json.data);
    } catch (error) {
        console.error('[/api/delivery/create] Failed:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
