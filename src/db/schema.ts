import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  bigint,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("USER"),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio"),
  avatarMediaId: uuid("avatar_media_id"),
  socialLinksJson: text("social_links_json"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  filename: text("filename").notNull(),
  storedPath: text("stored_path").notNull(),
  publicUrl: text("public_url").notNull(),
  mimeType: text("mime_type").notNull(),
  byteSize: bigint("byte_size", { mode: "number" }).notNull(),
  kind: text("kind").notNull().default("OTHER"),
  uploadedById: uuid("uploaded_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const magazines = pgTable("magazines", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  /** Número da edição (ex.: 20). */
  editionNumber: integer("edition_number"),
  volume: integer("volume"),
  /** Cidade/região (ex.: Fortaleza, CE). */
  location: text("location"),
  description: text("description"),
  coverImageUrl: text("cover_image_url").notNull(),
  publishedAt: date("published_at"),
  status: text("status").notNull().default("DRAFT"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const magazinePages = pgTable("magazine_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  magazineId: uuid("magazine_id")
    .notNull()
    .references(() => magazines.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  label: text("label"),
});

export const sitePages = pgTable("site_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  blocksJson: text("blocks_json"),
  status: text("status").notNull().default("DRAFT"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const menuItems = pgTable("menu_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  /** MAIN | QUICK | FOOTER_REVISTA | FOOTER_CONTEUDO | FOOTER_CONTACTO */
  placement: text("placement").notNull().default("MAIN"),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

/** Textos por secção do site (Poemas, Contos, etc.) — geridos no admin. */
export const contentEntries = pgTable(
  "content_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sectionSlug: text("section_slug").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    /** HTML simples ou texto; sanitizar na renderização pública se necessário. */
    body: text("body").notNull(),
    imageUrl: text("image_url"),
    status: text("status").notNull().default("DRAFT"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    sectionSlugIdx: uniqueIndex("content_entries_section_slug_slug").on(t.sectionSlug, t.slug),
  }),
);

export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
