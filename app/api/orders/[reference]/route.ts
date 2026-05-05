import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ reference: string }> }
) {
    try {
        const { reference } = await params;

        const { data: order, error } = await supabase
            .from('orders')
            .select(`
                id,
                reference,
                status,
                amount_naira,
                delivery_fee_naira,
                customer_name,
                customer_email,
                created_at,
                chowdeck_delivery_ref,
                paid_at,
                order_items (
                    product_name,
                    quantity,
                    price_naira
                )
            `)
            .eq('reference', reference)
            .single();

        if (error || !order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: order.id,
            reference: order.reference,
            status: order.status,
            totalAmount: order.amount_naira,
            deliveryFee: order.delivery_fee_naira,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            createdAt: order.created_at,
            paidAt: order.paid_at,
            chowDeliveryRef: order.chowdeck_delivery_ref,
            items: order.order_items?.map((item: { product_name: string; quantity: number; price_naira: number }) => ({
                name: item.product_name,
                quantity: item.quantity,
                price: item.price_naira,
            })) || [],
        });
    } catch (error) {
        console.error('[/api/orders/[reference]] Failed:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
