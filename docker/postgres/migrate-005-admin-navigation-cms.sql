-- Estrutura complementar para navegação e secções administráveis.
-- Execute em bases já existentes:
--   psql "$DATABASE_URL" -f docker/postgres/migrate-005-admin-navigation-cms.sql
--
-- Objetivo:
-- 1) Consolidar o catálogo de secções visíveis no menu e no CMS.
-- 2) Garantir integridade de dados em menu_items e content_entries.
-- 3) Pré-carregar secções padrão usadas no site.

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

ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'menu_items_placement_check'
  ) THEN
    ALTER TABLE menu_items
      ADD CONSTRAINT menu_items_placement_check
      CHECK (
        placement IN (
          'MAIN',
          'QUICK',
          'FOOTER_REVISTA',
          'FOOTER_CONTEUDO',
          'FOOTER_CONTACTO'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'menu_items_label_not_blank'
  ) THEN
    ALTER TABLE menu_items
      ADD CONSTRAINT menu_items_label_not_blank
      CHECK (length(trim(label)) > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'menu_items_href_not_blank'
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
SELECT
  ce.section_slug,
  initcap(replace(ce.section_slug, '-', ' ')),
  initcap(replace(ce.section_slug, '-', ' ')),
  'Conteúdo administrado via painel.',
  'Ainda não há textos publicados nesta secção.',
  'CONTENT_LIST',
  999,
  true
FROM content_entries ce
WHERE ce.section_slug IS NOT NULL
ON CONFLICT (slug) DO NOTHING;
