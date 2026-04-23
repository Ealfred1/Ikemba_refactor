import { NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
    if (!PAYSTACK_SECRET_KEY) {
        return NextResponse.json({ error: 'Paystack secret key not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { email, amount, metadata } = body;

        if (!email || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Email and positive amount are required' }, { status: 400 });
        }

        // Paystack expects amount in kobo (minor unit)
        const amountInKobo = Math.round(amount * 100);

        const res = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: amountInKobo,
                metadata,
            }),
        });

        const data = await res.json();
        
        if (!data.status) {
            console.error('Paystack API error:', data);
            return NextResponse.json({ error: data.message || 'Paystack initialization failed' }, { status: 400 });
        }

        return NextResponse.json(data.data);
    } catch (error) {
        console.error('[/api/payment/initialize] Failed:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
