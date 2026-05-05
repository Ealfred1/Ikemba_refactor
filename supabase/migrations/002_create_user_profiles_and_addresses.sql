-- Migration: 002_create_user_profiles_and_addresses
-- Creates profiles table, saved_addresses, links orders to auth.users

-- ─── Profiles Table ─────────────────────────────────────────────────────────
-- Extends auth.users with additional user data
-- Created automatically via trigger on signup

CREATE TABLE profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           TEXT NOT NULL,
    full_name       TEXT,
    phone           TEXT,
    avatar_url      TEXT,

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ─── Auto-create profile on signup ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ─── Saved Addresses Table ──────────────────────────────────────────────────

CREATE TABLE saved_addresses (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label           TEXT NOT NULL,                   -- e.g. "Home", "Office", "Mom's house"
    is_default      BOOLEAN DEFAULT FALSE,
    
    -- Full address fields
    street_address  TEXT NOT NULL,
    building_number TEXT,
    floor_or_suite  TEXT,
    city            TEXT NOT NULL DEFAULT 'Lagos',
    state           TEXT NOT NULL DEFAULT 'Lagos',
    area            TEXT,                            -- e.g. "Lekki Phase 1", "VI"
    landmark        TEXT,                            -- helpful for delivery
    postal_code     TEXT,
    
    -- Delivery instructions
    delivery_notes  TEXT,                            -- e.g. "Call when you arrive", "Security desk"
    
    -- Contact override (optional, defaults to profile)
    recipient_name  TEXT,
    recipient_phone TEXT,
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_addresses_user_id ON saved_addresses(user_id);

ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses"
    ON saved_addresses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
    ON saved_addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
    ON saved_addresses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
    ON saved_addresses FOR DELETE
    USING (auth.uid() = user_id);

CREATE TRIGGER set_saved_addresses_updated_at
    BEFORE UPDATE ON saved_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ─── Update orders table: add user_id link ──────────────────────────────────

ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Update RLS: users can only see their own orders
DROP POLICY IF EXISTS "Anyone can view order by reference" ON orders;

CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (
        auth.uid() = user_id
        OR reference IS NOT NULL  -- Allow public lookup by reference (tracking page)
    );

CREATE POLICY "Users can insert own orders"
    ON orders FOR INSERT
    WITH CHECK (
        auth.uid() IS NULL  -- Allow guest checkout (no user_id)
        OR auth.uid() = user_id
    );

CREATE POLICY "Users can update own orders"
    ON orders FOR UPDATE
    USING (
        auth.uid() IS NULL  -- Service role handles webhook updates
        OR auth.uid() = user_id
    );
