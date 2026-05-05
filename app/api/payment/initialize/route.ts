import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

        const deliveryInfo = metadata?.delivery_info;
        if (!deliveryInfo) {
            return NextResponse.json({ error: 'Missing delivery_info in metadata' }, { status: 400 });
        }

        const amountInKobo = Math.round(amount * 100);

        // ── Step 1: Create pending order BEFORE calling Paystack ──
        const { data: paystackInit } = await fetch('https://api.paystack.co/transaction/initialize', {
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
        }).then(res => res.json());

        if (!paystackInit || paystackInit.status !== true) {
            console.error('Paystack API error:', paystackInit);
            return NextResponse.json({ error: paystackInit?.message || 'Paystack initialization failed' }, { status: 400 });
        }

        const { access_code, reference } = paystackInit.data;

        const userId = metadata?.user_id || null;
        const deliveryFeeNaira = amount - deliveryInfo.estimated_order_amount;

        // Create the pending order — webhook will update it after payment
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                reference,
                status: 'pending',
                amount_kobo: amountInKobo,
                amount_naira: amount,
                payment_method: 'paystack',
                customer_name: deliveryInfo.customer_name,
                customer_email: deliveryInfo.customer_email || email,
                customer_phone: deliveryInfo.customer_phone,
                delivery_address: deliveryInfo.delivery_note || '',
                delivery_city: 'Lagos',
                delivery_fee_naira: Math.max(0, deliveryFeeNaira),
                chowdeck_fee_id: deliveryInfo.fee_id,
                user_id: userId,
                metadata_json: JSON.stringify(deliveryInfo),
            })
            .select()
            .single();

        if (orderError || !order) {
            console.error('[Initialize] Failed to create pending order:', orderError);
            return NextResponse.json({ error: 'Failed to create order record' }, { status: 500 });
        }

        // Create order items immediately
        const items = deliveryInfo.items || [];
        if (items.length > 0) {
            const orderItems = items.map((item: { title: string; quantity: number; price: number | string }) => ({
                order_id: order.id,
                product_name: item.title,
                quantity: item.quantity,
                price_naira: typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0,
            }));

            await supabaseAdmin.from('order_items').insert(orderItems);
        }

        return NextResponse.json({ access_code, reference });

    } catch (error) {
        console.error('[/api/payment/initialize] Failed:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
