import { NextResponse } from 'next/server';
import crypto from 'crypto';
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
        const signature = request.headers.get('x-paystack-signature');
        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        const rawBody = await request.text();
        const hash = crypto
            .createHmac('sha512', PAYSTACK_SECRET_KEY)
            .update(rawBody)
            .digest('hex');

        if (hash !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(rawBody);

        if (event.event !== 'charge.success') {
            return NextResponse.json({ received: true }, { status: 200 });
        }

        const { reference, amount, customer, metadata } = event.data;

        if (!reference) {
            console.error('[Webhook] No reference in event data');
            return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
        }

        // ── Step 1: Verify payment with Paystack API ──
        const verification = await verifyPaystackTransaction(reference);
        if (!verification.valid) {
            console.error(`[Webhook] Payment verification failed for ${reference}:`, verification.error);
            return NextResponse.json({ error: 'Payment not verified' }, { status: 400 });
        }

        // ── Step 2: Idempotency check — has this reference been processed? ──
        const { data: existingOrder } = await supabaseAdmin
            .from('orders')
            .select('id, webhook_processed')
            .eq('reference', reference)
            .single();

        if (existingOrder?.webhook_processed) {
            console.log(`[Webhook] Order ${reference} already processed — skipping (idempotent)`);
            return NextResponse.json({ received: true, skipped: true }, { status: 200 });
        }

        // ── Step 3: Extract delivery details from metadata ──
        const deliveryInfo = metadata?.delivery_info;
        if (!deliveryInfo) {
            console.warn(`[Webhook] No delivery_info in metadata for ref: ${reference}`);
            return NextResponse.json({ error: 'Missing delivery_info' }, { status: 400 });
        }

        const totalAmountNaira = amount / 100;
        const deliveryFeeNaira = totalAmountNaira - deliveryInfo.estimated_order_amount;

        // Extract user_id from metadata (passed from checkout if user is logged in)
        const userId = metadata?.user_id || null;

        // ── Step 4: Persist order to Supabase ──
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
            console.error(`[Webhook] Failed to persist order ${reference}:`, orderError);
            return NextResponse.json({ error: 'Failed to create order record' }, { status: 500 });
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

            const { error: itemsError } = await supabaseAdmin
                .from('order_items')
                .insert(orderItems);

            if (itemsError) {
                console.error(`[Webhook] Failed to insert order items for ${reference}:`, itemsError);
            }
        }

        // ── Step 6: Create Chowdeck delivery ──
        try {
            const deliveryResult = await createChowdeckDelivery({
                fee_id: deliveryInfo.fee_id,
                customer_name: deliveryInfo.customer_name,
                customer_phone: deliveryInfo.customer_phone,
                customer_email: deliveryInfo.customer_email,
                estimated_order_amount: deliveryInfo.estimated_order_amount,
                delivery_note: deliveryInfo.delivery_note,
                reference: reference,
            });

            // Update order with Chowdeck delivery reference
            if (deliveryResult?.id) {
                await supabaseAdmin
                    .from('orders')
                    .update({
                        chowdeck_delivery_ref: String(deliveryResult.id),
                        status: 'delivery_created',
                    })
                    .eq('id', order.id);
            }
        } catch (err) {
            console.error(`[Webhook] Chowdeck delivery failed for ${reference}:`, err);
            await supabaseAdmin
                .from('orders')
                .update({ status: 'payment_confirmed' })
                .eq('id', order.id);
        }

        // ── Step 7: Send confirmation email ──
        try {
            await sendOrderConfirmationEmail({
                email: deliveryInfo.customer_email,
                customerName: deliveryInfo.customer_name,
                orderReference: reference,
                deliveryAddress: deliveryInfo.delivery_note || '',
                items: items,
                totalAmount: totalAmountNaira,
            });
        } catch (err) {
            console.error(`[Webhook] Email failed for ${reference}:`, err);
        }

        console.log(`[Webhook] Fulfillment complete for ref: ${reference}`);
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error('[/api/payment/webhook] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
