-- Portal Revista Literária — esquema PostgreSQL inicial
-- Ajuste nomes de schema/constraints conforme convenção do time.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'AUTHOR' CHECK (role IN ('ADMIN', 'EDITOR', 'AUTHOR')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users (id) ON DELETE SET NULL,
    display_name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    bio TEXT,
    photo_url VARCHAR(1024),
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE magazine_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    issue_number INT NOT NULL,
    cover_image_url VARCHAR(1024) NOT NULL,
    published_at DATE NOT NULL,
    editorial_html TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_key VARCHAR(512) NOT NULL,
    public_url VARCHAR(1024) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    alt_text VARCHAR(500),
    watermark_applied BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES magazine_issues (id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (issue_id, slug)
);

CREATE TABLE gallery_images (
    gallery_id UUID NOT NULL REFERENCES galleries (id) ON DELETE CASCADE,
    image_id UUID NOT NULL REFERENCES images (id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (gallery_id, image_id)
);

CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES magazine_issues (id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES authors (id) ON DELETE RESTRICT,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    excerpt TEXT,
    body_html TEXT NOT NULL,
    featured_image_id UUID REFERENCES images (id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    reading_time_minutes INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (issue_id, slug)
);

CREATE TABLE poems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES magazine_issues (id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES authors (id) ON DELETE RESTRICT,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    body_html TEXT NOT NULL,
    featured_image_id UUID REFERENCES images (id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (issue_id, slug)
);

CREATE TABLE short_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES magazine_issues (id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES authors (id) ON DELETE RESTRICT,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    excerpt TEXT,
    body_html TEXT NOT NULL,
    featured_image_id UUID REFERENCES images (id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    reading_time_minutes INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (issue_id, slug)
);

CREATE TABLE issue_authors (
    issue_id UUID NOT NULL REFERENCES magazine_issues (id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES authors (id) ON DELETE CASCADE,
    PRIMARY KEY (issue_id, author_id)
);

CREATE TABLE cronicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES magazine_issues (id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES authors (id) ON DELETE RESTRICT,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    excerpt TEXT,
    body_html TEXT NOT NULL,
    featured_image_id UUID REFERENCES images (id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    reading_time_minutes INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (issue_id, slug)
);

CREATE INDEX idx_articles_issue ON articles (issue_id);
CREATE INDEX idx_poems_issue ON poems (issue_id);
CREATE INDEX idx_stories_issue ON short_stories (issue_id);
CREATE INDEX idx_cronicas_issue ON cronicas (issue_id);
CREATE INDEX idx_magazine_issues_published ON magazine_issues (published_at DESC) WHERE status = 'PUBLISHED';
CREATE INDEX idx_articles_search ON articles USING gin (to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(excerpt, '')));
