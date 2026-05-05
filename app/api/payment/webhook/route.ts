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

        const { reference, amount } = event.data;

        if (!reference) {
            console.error('[Webhook] No reference in event data');
            return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
        }

        // ── Step 1: Look up pending order (created at init time) ──
        const { data: order } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('reference', reference)
            .single();

        if (!order) {
            console.error(`[Webhook] No order found for reference: ${reference}`);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // ── Step 2: Idempotency — skip if already processed ──
        if (order.webhook_processed) {
            console.log(`[Webhook] Order ${reference} already processed — skipping`);
            return NextResponse.json({ received: true, skipped: true }, { status: 200 });
        }

        // ── Step 3: Verify payment with Paystack API ──
        const verification = await verifyPaystackTransaction(reference);
        if (!verification.valid) {
            await supabaseAdmin
                .from('orders')
                .update({ status: 'failed', webhook_processed: true, webhook_verified: false })
                .eq('id', order.id);
            return NextResponse.json({ error: 'Payment not verified' }, { status: 400 });
        }

        // ── Step 4: Extract delivery info from stored metadata ──
        let deliveryInfo: Record<string, unknown> = {};
        try {
            deliveryInfo = order.metadata_json ? JSON.parse(order.metadata_json) : {};
        } catch {
            // Fallback: extract from webhook event data if available
            const webhookMeta = event.data?.metadata;
            if (webhookMeta?.delivery_info) {
                deliveryInfo = webhookMeta.delivery_info as Record<string, unknown>;
            }
        }

        // ── Step 5: Update order to payment_confirmed ──
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                status: 'payment_confirmed',
                paid_at: new Date().toISOString(),
                webhook_processed: true,
                webhook_verified: true,
                amount_kobo: amount,
                amount_naira: amount / 100,
            })
            .eq('id', order.id);

        if (updateError) {
            console.error(`[Webhook] Failed to update order ${reference}:`, updateError);
            return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
        }

        // ── Step 6: Create Chowdeck delivery ──
        try {
            const deliveryResult = await createChowdeckDelivery({
                fee_id: String(deliveryInfo.fee_id || order.chowdeck_fee_id),
                customer_name: order.customer_name,
                customer_phone: order.customer_phone,
                customer_email: order.customer_email,
                estimated_order_amount: Number(deliveryInfo.estimated_order_amount) || order.amount_naira,
                delivery_note: order.delivery_address,
                reference,
            });

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
        }

        // ── Step 7: Send confirmation email ──
        try {
            const items = deliveryInfo.items || [];
            await sendOrderConfirmationEmail({
                email: order.customer_email,
                customerName: order.customer_name,
                orderReference: reference,
                deliveryAddress: order.delivery_address,
                items: items as Array<{ title: string; quantity: number; price: number | string }>,
                totalAmount: amount / 100,
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
