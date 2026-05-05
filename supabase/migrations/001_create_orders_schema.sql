-- Migration: 001_create_orders_schema
-- Creates the core orders and order_items tables for Lekki Mart

-- ─── Orders Table ────────────────────────────────────────────────────────────

CREATE TYPE order_status AS ENUM (
    'pending',
    'payment_confirmed',
    'delivery_created',
    'delivery_preparing',
    'delivery_picked_up',
    'delivered',
    'cancelled',
    'failed'
);

CREATE TABLE orders (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reference       TEXT NOT NULL UNIQUE,           -- Paystack transaction reference
    status          order_status DEFAULT 'pending' NOT NULL,

    -- Payment
    amount_kobo     BIGINT NOT NULL,                 -- Amount charged in kobo
    amount_naira    NUMERIC(10,2) NOT NULL,          -- Amount in Naira (for display)
    payment_method  TEXT DEFAULT 'paystack',
    paid_at         TIMESTAMPTZ,

    -- Customer
    customer_name   TEXT NOT NULL,
    customer_email  TEXT NOT NULL,
    customer_phone  TEXT NOT NULL,

    -- Delivery
    delivery_address TEXT NOT NULL,
    delivery_city    TEXT NOT NULL,
    delivery_fee_naira NUMERIC(10,2) DEFAULT 0,
    chowdeck_fee_id  BIGINT,
    chowdeck_delivery_ref TEXT UNIQUE,

    -- Idempotency: track webhook processing
    webhook_processed BOOLEAN DEFAULT FALSE,
    webhook_verified  BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by reference (used in webhook and tracking)
CREATE INDEX idx_orders_reference ON orders(reference);

-- Index for customer lookups
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

-- Index for status-based queries
CREATE INDEX idx_orders_status ON orders(status);

-- ─── Order Items Table ──────────────────────────────────────────────────────

CREATE TABLE order_items (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      BIGINT,                        -- Chowdeck product ID
    product_name    TEXT NOT NULL,
    quantity        INTEGER NOT NULL DEFAULT 1,
    price_naira     NUMERIC(10,2) NOT NULL,        -- Unit price at time of order
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ─── Trigger: auto-update updated_at ────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ─── Row Level Security (RLS) ───────────────────────────────────────────────

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public can read orders by reference (for tracking page)
CREATE POLICY "Anyone can view order by reference"
    ON orders FOR SELECT
    USING (true);

-- Public can read order items via join (for tracking page)
CREATE POLICY "Anyone can view order items"
    ON order_items FOR SELECT
    USING (true);

-- Service role can do everything (server-side only)
CREATE POLICY "Service role full access orders"
    ON orders FOR ALL
    USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access order_items"
    ON order_items FOR ALL
    USING (true) WITH CHECK (true);

-- ─── Views: convenient order summary ────────────────────────────────────────

CREATE VIEW order_summary AS
SELECT
    o.id,
    o.reference,
    o.status,
    o.amount_naira AS total_amount,
    o.delivery_fee_naira,
    o.customer_name,
    o.customer_email,
    o.created_at,
    o.chowdeck_delivery_ref,
    json_agg(
        json_build_object(
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.price_naira
        )
    ) AS items
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id;
