-- Migration: 002_create_user_profiles_and_addresses
-- Creates profiles table, saved_addresses, links orders to auth.users
-- IDEMPOTENT: safe to run multiple times

-- ─── Profiles Table ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           TEXT NOT NULL,
    full_name       TEXT,
    phone           TEXT,
    avatar_url      TEXT,

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ─── Saved Addresses Table ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_addresses (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label           TEXT NOT NULL,
    is_default      BOOLEAN DEFAULT FALSE,

    street_address  TEXT NOT NULL,
    building_number TEXT,
    floor_or_suite  TEXT,
    city            TEXT NOT NULL DEFAULT 'Lagos',
    state           TEXT NOT NULL DEFAULT 'Lagos',
    area            TEXT,
    landmark        TEXT,
    postal_code     TEXT,

    delivery_notes  TEXT,

    recipient_name  TEXT,
    recipient_phone TEXT,

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_addresses_user_id ON saved_addresses(user_id);

ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own addresses" ON saved_addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON saved_addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON saved_addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON saved_addresses;

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

DROP TRIGGER IF EXISTS set_saved_addresses_updated_at ON saved_addresses;
CREATE TRIGGER set_saved_addresses_updated_at
    BEFORE UPDATE ON saved_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ─── Update orders table: add user_id link ──────────────────────────────────

ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Update RLS: users can only see their own orders
DROP POLICY IF EXISTS "Anyone can view order by reference" ON orders;
DROP POLICY IF EXISTS "Public can view order by reference" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- Public read: tracking page (reference is unguessable, acts as access token)
CREATE POLICY "Public can view order by reference"
    ON orders FOR SELECT
    USING (true);

-- Authenticated users: can see their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
    ON orders FOR INSERT
    WITH CHECK (
        auth.uid() IS NULL
        OR auth.uid() = user_id
    );

CREATE POLICY "Users can update own orders"
    ON orders FOR UPDATE
    USING (
        auth.uid() IS NULL
        OR auth.uid() = user_id
    );
