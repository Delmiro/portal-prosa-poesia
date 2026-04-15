-- Bootstrap completo de banco para produção (Cloudflare + Postgres).
-- Idempotente: pode ser executado mais de uma vez sem quebrar.
--
-- Uso (PowerShell):
--   psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f docker/postgres/cloudflare-bootstrap.sql
--
-- Uso (bash):
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f docker/postgres/cloudflare-bootstrap.sql

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'USER',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio text,
  avatar_media_id uuid,
  social_links_json text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  stored_path text NOT NULL,
  public_url text NOT NULL,
  mime_type text NOT NULL,
  byte_size bigint NOT NULL,
  kind text NOT NULL DEFAULT 'OTHER',
  uploaded_by_id uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS magazines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  edition_number integer,
  volume integer,
  location text,
  description text,
  cover_image_url text NOT NULL,
  published_at date,
  status text NOT NULL DEFAULT 'DRAFT',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS magazine_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  magazine_id uuid NOT NULL REFERENCES magazines(id) ON DELETE CASCADE,
  sort_order integer NOT NULL,
  pdf_url text NOT NULL,
  label text
);

CREATE TABLE IF NOT EXISTS site_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  blocks_json text,
  status text NOT NULL DEFAULT 'DRAFT',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  placement text NOT NULL DEFAULT 'MAIN',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS cms_sections (
  slug text PRIMARY KEY,
  label text NOT NULL,
  page_title text NOT NULL,
  page_description text NOT NULL,
  empty_message text NOT NULL,
  kind text NOT NULL DEFAULT 'CONTENT_LIST',
  sort_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'menu_items_placement_check'
  ) THEN
    ALTER TABLE menu_items
      ADD CONSTRAINT menu_items_placement_check
      CHECK (placement IN ('MAIN', 'QUICK', 'FOOTER_REVISTA', 'FOOTER_CONTEUDO', 'FOOTER_CONTACTO'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'menu_items_label_not_blank'
  ) THEN
    ALTER TABLE menu_items
      ADD CONSTRAINT menu_items_label_not_blank
      CHECK (length(trim(label)) > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'menu_items_href_not_blank'
  ) THEN
    ALTER TABLE menu_items
      ADD CONSTRAINT menu_items_href_not_blank
      CHECK (length(trim(href)) > 0);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS menu_items_placement_sort_uq
  ON menu_items (placement, sort_order);

CREATE INDEX IF NOT EXISTS menu_items_visible_placement_idx
  ON menu_items (visible, placement, sort_order);

CREATE INDEX IF NOT EXISTS content_entries_section_status_order_idx
  ON content_entries (section_slug, status, sort_order, created_at DESC);

INSERT INTO cms_sections (
  slug,
  label,
  page_title,
  page_description,
  empty_message,
  kind,
  sort_order,
  enabled
)
VALUES
  ('editorial', 'Editorial', 'Editorial', 'Textos de abertura e posicionamento da revista.', 'Ainda não há textos publicados nesta secção.', 'CONTENT_LIST', 0, true),
  ('poemas', 'Poemas', 'Poemas', 'Versos com respiro tipográfico e leitura confortável.', 'Ainda não há textos publicados nesta secção.', 'CONTENT_LIST', 1, true),
  ('contos', 'Contos', 'Contos', 'Narrativas breves e contos literários da edição.', 'Ainda não há textos publicados nesta secção.', 'CONTENT_LIST', 2, true),
  ('cronicas', 'Crônicas', 'Crônicas', 'Textos curtos de atualidade e observação — integrados por edição da revista.', 'Ainda não há textos publicados nesta secção.', 'CONTENT_LIST', 3, true),
  ('artigos', 'Artigos', 'Artigos', 'Ensaios, crónicas e artigos de fundo.', 'Ainda não há textos publicados nesta secção.', 'CONTENT_LIST', 4, true),
  ('galeria', 'Galeria', 'Galeria de fotos', 'Imagens em proporção 16:9, otimizadas para leitura em tela.', 'Ainda não há textos publicados nesta secção.', 'CONTENT_LIST', 5, true),
  ('autores', 'Autores', 'Autores', 'Participantes da edição atual.', 'Ainda não há autores publicados nesta edição.', 'AUTHORS_LIST', 6, true),
  ('edicoes', 'Edições', 'Edições da revista', 'Cada edição reúne textos, imagens e vozes — como um número impresso, em formato digital.', 'Ainda não há edições publicadas. Configure-as no painel de administração.', 'MAGAZINE_LIST', 7, true),
  ('sobre', 'Sobre', 'Sobre o periódico', 'Apresentação institucional e editorial da revista.', 'Conteúdo em atualização.', 'STATIC_PAGE', 8, true),
  ('contato', 'Contato', 'Contato', 'Envie mensagens à redação ou propostas de parceria.', 'Em breve: formulário com validação e envio via API.', 'STATIC_PAGE', 9, true)
ON CONFLICT (slug) DO UPDATE
SET
  label = EXCLUDED.label,
  page_title = EXCLUDED.page_title,
  page_description = EXCLUDED.page_description,
  empty_message = EXCLUDED.empty_message,
  kind = EXCLUDED.kind,
  sort_order = EXCLUDED.sort_order,
  enabled = EXCLUDED.enabled,
  updated_at = now();

WITH has_menu AS (
  SELECT COUNT(*)::int AS c FROM menu_items
)
INSERT INTO menu_items (label, href, placement, sort_order, visible)
SELECT label, href, placement, sort_order, visible
FROM (
  VALUES
    ('Início', '/', 'MAIN', 0, true),
    ('Edições', '/edicoes', 'MAIN', 1, true),
    ('Autores', '/autores', 'MAIN', 2, true),
    ('Editorial', '/editorial', 'MAIN', 3, true),
    ('Poemas', '/poemas', 'MAIN', 4, true),
    ('Contos', '/contos', 'MAIN', 5, true),
    ('Crônicas', '/cronicas', 'MAIN', 6, true),
    ('Artigos', '/artigos', 'MAIN', 7, true),
    ('Galeria', '/galeria', 'MAIN', 8, true),
    ('Sobre', '/sobre', 'MAIN', 9, true),
    ('Administração', '/admin', 'MAIN', 10, true),
    ('Contato', '/contato', 'MAIN', 11, true),
    ('Autores', '/autores', 'QUICK', 0, true),
    ('Edições', '/edicoes', 'QUICK', 1, true),
    ('Leitura folheada', '/edicoes', 'QUICK', 2, true),
    ('Contatos', '/contato', 'QUICK', 3, true),
    ('Edições', '/edicoes', 'FOOTER_REVISTA', 0, true),
    ('Leitura folheada', '/edicoes', 'FOOTER_REVISTA', 1, true),
    ('Editorial', '/editorial', 'FOOTER_REVISTA', 2, true),
    ('Galeria', '/galeria', 'FOOTER_REVISTA', 3, true),
    ('Poemas', '/poemas', 'FOOTER_CONTEUDO', 0, true),
    ('Contos', '/contos', 'FOOTER_CONTEUDO', 1, true),
    ('Crônicas', '/cronicas', 'FOOTER_CONTEUDO', 2, true),
    ('Artigos', '/artigos', 'FOOTER_CONTEUDO', 3, true),
    ('Autores', '/autores', 'FOOTER_CONTACTO', 0, true),
    ('Sobre', '/sobre', 'FOOTER_CONTACTO', 1, true),
    ('Administração', '/admin', 'FOOTER_CONTACTO', 2, true),
    ('Contato', '/contato', 'FOOTER_CONTACTO', 3, true)
) AS v(label, href, placement, sort_order, visible)
WHERE (SELECT c FROM has_menu) = 0;

COMMIT;
