import { NextResponse } from 'next/server';
import { createChowdeckDelivery } from '@/lib/chowdeck';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { supabaseAdmin } from '@/lib/supabase';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

async function verifyPaystackTransaction(reference: string) {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
    });

    const data = await res.json();

    if (!data.status) {
        return { valid: false, error: data.message || 'Verification failed' };
    }

    if (data.data.status !== 'success') {
        return { valid: false, error: `Payment status: ${data.data.status}` };
    }

    return { valid: true, data: data.data };
}

export async function POST(request: Request) {
    if (!PAYSTACK_SECRET_KEY) {
        return NextResponse.json({ error: 'Paystack secret key not configured' }, { status: 500 });
    }

    try {
        const { reference } = await request.json();

        if (!reference) {
            return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
        }

        // ── Step 1: Check if order already exists (idempotency) ──
        const { data: existingOrder } = await supabaseAdmin
            .from('orders')
            .select('id')
            .eq('reference', reference)
            .single();

        if (existingOrder) {
            return NextResponse.json({ order: existingOrder, created: false });
        }

        // ── Step 2: Verify payment with Paystack API ──
        const verification = await verifyPaystackTransaction(reference);
        if (!verification.valid) {
            return NextResponse.json(
                { error: verification.error || 'Payment not verified' },
                { status: 400 }
            );
        }

        const paystackData = verification.data;
        const { customer, metadata } = paystackData;
        const amount = paystackData.amount;

        // ── Step 3: Extract delivery details from metadata ──
        const deliveryInfo = metadata?.delivery_info;
        if (!deliveryInfo) {
            return NextResponse.json({ error: 'Missing delivery_info in payment metadata' }, { status: 400 });
        }

        const totalAmountNaira = amount / 100;
        const deliveryFeeNaira = totalAmountNaira - deliveryInfo.estimated_order_amount;
        const userId = metadata?.user_id || null;

        // ── Step 4: Create order ──
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                reference,
                status: 'payment_confirmed',
                amount_kobo: amount,
                amount_naira: totalAmountNaira,
                payment_method: 'paystack',
                paid_at: new Date().toISOString(),
                customer_name: deliveryInfo.customer_name,
                customer_email: deliveryInfo.customer_email || customer?.email || '',
                customer_phone: deliveryInfo.customer_phone,
                delivery_address: deliveryInfo.delivery_note || '',
                delivery_city: 'Lagos',
                delivery_fee_naira: Math.max(0, deliveryFeeNaira),
                chowdeck_fee_id: deliveryInfo.fee_id,
                webhook_processed: true,
                webhook_verified: true,
                user_id: userId,
            })
            .select()
            .single();

        if (orderError || !order) {
            console.error(`[POST /api/orders] Failed to create order ${reference}:`, orderError);
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        // ── Step 5: Insert order items ──
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

        // ── Step 6: Create Chowdeck delivery (fire-and-forget) ──
        try {
            const deliveryResult = await createChowdeckDelivery({
                fee_id: deliveryInfo.fee_id,
                customer_name: deliveryInfo.customer_name,
                customer_phone: deliveryInfo.customer_phone,
                customer_email: deliveryInfo.customer_email,
                estimated_order_amount: deliveryInfo.estimated_order_amount,
                delivery_note: deliveryInfo.delivery_note,
                reference,
            });

            if (deliveryResult?.id) {
                await supabaseAdmin
                    .from('orders')
                    .update({ chowdeck_delivery_ref: String(deliveryResult.id), status: 'delivery_created' })
                    .eq('id', order.id);
            }
        } catch (err) {
            console.error(`[POST /api/orders] Chowdeck failed for ${reference}:`, err);
        }

        // ── Step 7: Send confirmation email (fire-and-forget) ──
        try {
            await sendOrderConfirmationEmail({
                email: deliveryInfo.customer_email,
                customerName: deliveryInfo.customer_name,
                orderReference: reference,
                deliveryAddress: deliveryInfo.delivery_note || '',
                items,
                totalAmount: totalAmountNaira,
            });
        } catch (err) {
            console.error(`[POST /api/orders] Email failed for ${reference}:`, err);
        }

        return NextResponse.json({ order, created: true });

    } catch (error) {
        console.error('[POST /api/orders] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
