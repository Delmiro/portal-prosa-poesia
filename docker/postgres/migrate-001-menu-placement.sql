-- Executar uma vez em bases já criadas (antes sem a coluna placement).
-- psql "$DATABASE_URL" -f docker/postgres/migrate-001-menu-placement.sql

ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS placement text NOT NULL DEFAULT 'MAIN';

UPDATE menu_items SET placement = 'MAIN' WHERE placement IS NULL OR trim(placement) = '';
