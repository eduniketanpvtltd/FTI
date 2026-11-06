-- Migration 002: Fix Mandi Benchmark Seed Entries
-- Resolves the issue where Billet and Ingot benchmark rows from Mandi Gobindgarh
-- were incorrectly categorized as a standalone material named 'Mandi Benchmark'.

-- 1. Update Mandi Gobindgarh Billet row to properly belong to 'billet' category
UPDATE market_materials
SET 
  category_slug = 'billet',
  category_name = 'Billet',
  name = 'Billet - Mandi Gobindgarh',
  hub_city = 'Mandi Gobindgarh',
  notes = 'Billet spot fixing ex-Mandi Gobindgarh. Applicable Sales Tax extra (ast).'
WHERE symbol = 'MANDI-BEN-01'
   OR (category_slug = 'benchmark' AND (name ILIKE '%billet%' OR hub_city ILIKE '%billet%'));

-- 2. Update Mandi Gobindgarh Ingot row to properly belong to 'ingot' category
UPDATE market_materials
SET 
  category_slug = 'ingot',
  category_name = 'Ingot',
  name = 'Ingot - Mandi Gobindgarh',
  hub_city = 'Mandi Gobindgarh',
  notes = 'Ingot spot fixing ex-Mandi Gobindgarh. Applicable Sales Tax extra (ast).'
WHERE symbol = 'MANDI-BEN-02'
   OR (category_slug = 'benchmark' AND (name ILIKE '%ingot%' OR hub_city ILIKE '%ingot%'));

-- 3. Remove duplicate benchmark scrap rows (MANDI-SCR-20 and MANDI-SCR-21 already track Mandi Gobindgarh & Mandi Melting scrap)
DELETE FROM market_materials
WHERE symbol IN ('MANDI-BEN-03', 'MANDI-BEN-04')
   OR (category_slug = 'benchmark' AND (name ILIKE '%scrap%' OR hub_city ILIKE '%scrap%'));
