import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createChowdeckDelivery } from '@/lib/chowdeck';

import { sendOrderConfirmationEmail } from '@/lib/email';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

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

        // Process successful charges
        if (event.event === 'charge.success') {
            const { metadata, reference, amount } = event.data;
            
            // Extract delivery details from metadata
            const deliveryInfo = metadata?.delivery_info;
            
            if (deliveryInfo) {
                try {
                    console.log(`[Webhook] Processing successful payment for ref: ${reference}`);
                    
                    await createChowdeckDelivery({
                        fee_id: deliveryInfo.fee_id,
                        customer_name: deliveryInfo.customer_name,
                        customer_phone: deliveryInfo.customer_phone,
                        customer_email: deliveryInfo.customer_email,
                        estimated_order_amount: deliveryInfo.estimated_order_amount,
                        delivery_note: deliveryInfo.delivery_note,
                        reference: reference, // Link the Paystack ref to Chowdeck
                    });
                    
                    console.log(`[Webhook] Chowdeck delivery created. Sending confirmation email...`);

                    // Send Confirmation Email
                    await sendOrderConfirmationEmail({
                        email: deliveryInfo.customer_email,
                        customerName: deliveryInfo.customer_name,
                        orderReference: reference,
                        deliveryAddress: deliveryInfo.delivery_note,
                        items: deliveryInfo.items || [],
                        totalAmount: amount / 100, // Convert kobo to Naira
                    });
                    
                    console.log(`[Webhook] Fulfillment complete for ref: ${reference}`);
                } catch (err) {
                    console.error(`[Webhook] Failed to fulfill order for ref ${reference}:`, err);
                    // Return 500 so Paystack retries the webhook
                    return NextResponse.json({ error: 'Fulfillment failed' }, { status: 500 });
                }
            } else {
                console.warn(`[Webhook] No delivery_info found in metadata for ref: ${reference}`);
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error('[/api/payment/webhook] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
