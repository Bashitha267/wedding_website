-- ==============================================
-- Template Prices Table Setup
-- Run this in your Supabase SQL Editor
-- ==============================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS template_prices (
  template_id TEXT PRIMARY KEY,       -- matches id in app/data.ts (e.g. 'earthy', 'classic')
  price       NUMERIC(10, 2),         -- price in LKR, NULL = "Price on request"
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE template_prices ENABLE ROW LEVEL SECURITY;

-- 3. Allow public READ (so the homepage can fetch prices without auth)
CREATE POLICY "Allow public read on template_prices"
  ON template_prices
  FOR SELECT
  USING (true);

-- 4. Allow authenticated users (admin) to INSERT / UPDATE
CREATE POLICY "Allow authenticated upsert on template_prices"
  ON template_prices
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Seed initial rows for all templates (prices are NULL = "Price on request")
--    You can then set prices from the Admin → Template Pricing tab.
INSERT INTO template_prices (template_id, price) VALUES
  ('classic',     NULL),
  ('earthy',      NULL),
  ('monochrome',  NULL),
  ('icy',         NULL),
  ('homecoming',  NULL),
  ('weddingwalk', NULL),
  ('aviation',    NULL),
  ('christian',   NULL),
  ('poruwa',      NULL),
  ('minimal',     NULL),
  ('car',         NULL)
ON CONFLICT (template_id) DO NOTHING;
