-- Revistas: metadados extra + tabela de textos por secção (CMS).
-- Executar em bases existentes: psql "$DATABASE_URL" -f docker/postgres/migrate-004-cms-magazines-content.sql

ALTER TABLE magazines ADD COLUMN IF NOT EXISTS edition_number integer;
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS volume integer;
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS location text;

CREATE TABLE IF NOT EXISTS content_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_slug text NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  excerpt text,
  body text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'DRAFT',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (section_slug, slug)
);
