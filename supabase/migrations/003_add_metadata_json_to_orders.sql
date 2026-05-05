-- Migration: 003_add_metadata_json_to_orders
-- Adds JSONB column to store delivery info at init time (webhook doesn't always get it)

ALTER TABLE orders ADD COLUMN IF NOT EXISTS metadata_json JSONB;
