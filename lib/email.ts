import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderConfirmationParams {
    email: string;
    customerName: string;
    orderReference: string;
    deliveryAddress: string;
    items: { title: string; quantity: number; price: string }[];
    totalAmount: number;
}

export async function sendOrderConfirmationEmail({
    email,
    customerName,
    orderReference,
    deliveryAddress,
    items,
    totalAmount
}: OrderConfirmationParams) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY missing. Skipping email.');
        return { success: false, error: 'API Key missing' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'Lekki Mart <onboarding@resend.dev>',
            to: [email],
            subject: `Order Locked: ${orderReference}`,
            html: `
                <div style="background-color: #000; color: #fff; font-family: sans-serif; padding: 40px; max-width: 600px; margin: auto; border-radius: 20px;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="color: #b4ff00; font-size: 32px; letter-spacing: -2px; margin: 0; text-transform: uppercase; font-style: italic;">LEKKI MART</h1>
                        <p style="color: #666; font-size: 12px; margin-top: 5px; text-transform: uppercase; font-weight: bold; letter-spacing: 2px;">Premium Provisions</p>
                    </div>
                    
                    <div style="background-color: #111; padding: 30px; border-radius: 15px; border: 1px solid #222; margin-bottom: 30px;">
                        <h2 style="font-size: 24px; margin-top: 10px; margin-bottom: 10px;">Hello, ${customerName}</h2>
                        <p style="color: #999; line-height: 1.6; font-size: 15px;">Your daily essentials are being packed. The Lekki Mart team has automated your logistics via Chowdeck.</p>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <p style="color: #b4ff00; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 10px;">Your Logistics Reference</p>
                        <div style="background-color: #1a1a1a; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 18px; color: #fff;">
                            ${orderReference}
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <p style="color: #b4ff00; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 15px;">Order Details</p>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${items.map(item => `
                                <li style="border-bottom: 1px solid #222; padding: 15px 0; display: flex; justify-content: space-between;">
                                    <span style="color: #fff; font-weight: 600;">${item.title} (x${item.quantity})</span>
                                    <span style="color: #b4ff00; font-weight: 800;">${item.price}</span>
                                </li>
                            `).join('')}
                        </ul>
                        <div style="margin-top: 20px; text-align: right;">
                            <span style="color: #666; text-transform: uppercase; font-size: 11px; font-weight: 800; margin-right: 15px;">Grand Total</span>
                            <span style="color: #b4ff00; font-size: 28px; font-weight: 800;">₦${totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div style="border-top: 1px solid #222; padding-top: 30px; margin-top: 30px; font-size: 13px; color: #666; line-height: 1.6;">
                        <p style="margin-bottom: 10px;"><strong>Delivery Address:</strong><br/>${deliveryAddress}</p>
                        <p>&copy; 2026 Lekki Mart Supermarket. Lagos, Nigeria.</p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Email sending failed:', err);
        return { success: false, error: err };
    }
}
