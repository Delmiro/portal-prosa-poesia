# O LÚMEN DA ALAAS — portal de revista digital

Portal **Next.js** com leitura estilo revista física (folhear páginas com **StPageFlip** via `react-pageflip`). O conteúdo público continua em grande parte **estático** (`src/content/`). A **API administrativa e pública** está integrada no próprio Next.js em **`/api/*`** (Route Handlers), com **PostgreSQL** via **Drizzle ORM**, **JWT** (`jose`) e palavras-passe com **bcryptjs**. Uploads em disco local (`UPLOAD_DIR`); **Cloudinary** pode ser acrescentado depois.

## O que está implementado (stack única Next.js)

- **Autenticação:** `POST /api/auth/login`, `POST /api/auth/register` (JWT Bearer).
- **RBAC:** `USER`, `ADMIN`, `MASTER_ADMIN` (verificação nas rotas admin).
- **Utilizadores (MASTER):** `GET/PUT/DELETE /api/admin/users/...`, edição de perfil alheio, exclusão.
- **Perfil:** `GET/PUT /api/profile/me`.
- **Mídia:** upload multipart, listagem, eliminação; ficheiros em `GET /api/media/files/{id}`.
- **Revista:** CRUD, páginas PDF (upload), reordenação.
- **Páginas CMS:** `slug` + `blocksJson` (JSON).
- **Menu:** itens ordenados; `PUT` substitui a lista.
- **Dashboard:** contagens e atividade recente.
- **API pública:** `GET /api/public/menu`, `/api/public/pages/[slug]`, `/api/public/magazines`, `/api/public/magazines/[id]`.
- **Site público** em `src/app/(site)/` (inalterado); shell **`/admin`** para evolução da UI.

## Pré-requisitos locais

- Node **20+** e npm
- **PostgreSQL** (ou só Docker — ver abaixo)

## Variáveis de ambiente

Copie [`.env.example`](.env.example) para `.env.local` e ajuste. Obrigatórios para a API:

- `DATABASE_URL` — PostgreSQL
- `JWT_SECRET` — mínimo 32 caracteres em produção

## Desenvolvimento

0. **Variáveis:** copie `.env.example` para `.env.local` na raiz do projeto. Sem `DATABASE_URL`, o login e as rotas `/api/*` que usam a base de dados falham (erro 500/503).

1. Crie a base e o esquema (primeira vez com Postgres vazio):

   - Com Docker: `docker compose up -d db` e use `DATABASE_URL=postgresql://portal:portal@localhost:5432/portal`
   - O ficheiro [`docker/postgres/init.sql`](docker/postgres/init.sql) cria as tabelas ao iniciar o contentor `db`.

   Em bases já existentes, aplique as migrações manualmente (na raiz do projeto):

```bash
psql "$DATABASE_URL" -f docker/postgres/migrate-001-menu-placement.sql
psql "$DATABASE_URL" -f docker/postgres/migrate-004-cms-magazines-content.sql
psql "$DATABASE_URL" -f docker/postgres/migrate-005-admin-navigation-cms.sql
```

   > A migração `migrate-005-admin-navigation-cms.sql` cria a tabela `cms_sections` e reforça constraints/índices para o menu gerido no admin.

2. Instalar dependências e popular conta administrativa (opcional):

```bash
npm install
npm run db:seed
```

3. Arrancar o site + API:

```bash
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)  
- Health: [http://localhost:3000/api/health](http://localhost:3000/api/health)  
- **Seed** (se correu `db:seed`): `admin@localhost` / `ChangeMe123!` (ou defina `APP_ADMIN_EMAIL` / `APP_ADMIN_PASSWORD`)

## Docker (aplicação única)

Na raiz do repositório:

```bash
docker compose up --build
```

- Tudo: **http://localhost:3000** (inclui `/api/*`).  
- O serviço `web` corre `npm run db:seed` no arranque (ignora erro se já existir dados).  
- Postgres na porta **5432** (mapeada para o host).

## Documentação

| Documento | Conteúdo |
|-----------|------------|
| [docs/PROJETO.md](docs/PROJETO.md) | Objetivo, stack, hospedagem |
| [docs/ESTRUTURA_PASTAS.md](docs/ESTRUTURA_PASTAS.md) | Pastas do projeto |
| [docs/schema.sql](docs/schema.sql) | Modelo PostgreSQL (referência) |
| [docs/WIREFRAMES.md](docs/WIREFRAMES.md) | Wireframes |
| [docs/ARQUITETURA.md](docs/ARQUITETURA.md) | Visão técnica (histórico) |

## Hospedagem sugerida

- **Frontend + API:** Vercel (Postgres gerido: Neon) ou **Netlify** com adaptador Node e Postgres externo  
- **Banco:** Neon, Supabase, Railway  
- **Ficheiros:** disco local não persiste em serverless — usar **Cloudinary**, **S3** ou **Vercel Blob** em produção
