# Arquitetura do sistema — O LÚMEN DA ALAAS

Documento complementar a [PROJETO.md](PROJETO.md) (objetivo, stack, hospedagem e entregáveis).

## Visão geral

Portal de conteúdo editorial com **folhear páginas** (StPageFlip), área administrativa e padronização de imagens. Duas variantes de implantação: **Supabase (rápido)** ou **Spring Boot + PostgreSQL + Cloudinary (portfólio/empresa)**.

### Opção A — Supabase (MVP e custo zero)

| Camada | Tecnologia | Papel |
|--------|------------|--------|
| Frontend | Next.js (App Router), Tailwind, shadcn/ui | UI pública, admin, SEO |
| BaaS | Supabase | Auth (email/OAuth), PostgreSQL, Row Level Security, Storage |
| Mídia | Supabase Storage + transformações ou Cloudinary | Upload, 16:9, compressão |
| Hospedagem | Vercel | Deploy do Next.js |

**Prós:** time-to-market, menos servidores, API gerada. **Contras:** lógica complexa de negócio fica em Edge Functions ou no cliente; padronização de imagem exige pipeline (Storage trigger ou Cloudinary).

### Opção B — Spring Boot (recomendada para portfólio e regras no servidor)

```
┌─────────────┐     HTTPS / REST + JWT     ┌─────────────────┐
│   Vercel    │ ◄────────────────────────► │ Render / Railway │
│  Next.js    │                             │   Spring Boot    │
└─────────────┘                             └────────┬────────┘
                                                     │
                    ┌────────────────────────────────┼────────────────────┐
                    ▼                                ▼                    ▼
              ┌───────────┐                  ┌─────────────┐      ┌─────────────┐
              │ Supabase  │                  │    Neon     │      │ Cloudinary  │
              │ ou Neon   │                  │ PostgreSQL  │      │  imagens    │
              └───────────┘                  └─────────────┘      └─────────────┘
```

| Camada | Tecnologia | Papel |
|--------|------------|--------|
| Frontend | Next.js | Páginas, ISR/SSR, formulários admin |
| API | Spring Boot 3.x | Domínio, validação, jobs de imagem, JWT |
| BD | PostgreSQL | Modelagem relacional |
| Imagens | Cloudinary | Upload assinado, `c_fill`, `ar_16:9`, `w_1200`, marca d’água |
| Auth | Spring Security + JWT | Login admin/autor; refresh opcional |

## Módulos funcionais

1. **Público:** home estilo capa, edições, tipos de conteúdo (artigo, poema, conto, editorial), autores, galeria, sobre, contato.
2. **Admin:** CRUD de edições, autores, textos, galerias; upload com validação 16:9 e mínimo 1200×675; editor rich text (TipTap ou Lexical) persistindo HTML ou JSON.
3. **Imagens:** serviço dedicado (ex.: `ImageProcessingService`) chamando Cloudinary ou processamento local (Thumbnailator) antes de gravar URL.

## Fluxo de autenticação (JWT)

1. `POST /api/auth/login` → valida credenciais → retorna `accessToken` (+ `refreshToken` opcional).
2. Next.js admin: armazena token em `httpOnly` cookie (preferível) ou memória + BFF route handlers que repassam o cookie.
3. Requisições à API com `Authorization: Bearer <token>`.

## SEO e performance

- Metadados por rota (`generateMetadata`), Open Graph para compartilhamento.
- Imagens: `next/image` com URLs Cloudinary otimizadas.
- Cache: ISR para páginas de edição e artigos; revalidação on-demand após publicação.

## Escalabilidade e riscos

| Risco | Mitigação |
|-------|-----------|
| Pico de tráfego na home | CDN (Vercel), cache ISR, imagens via Cloudinary |
| Upload abusivo | rate limit no API Gateway / Spring; quotas por usuário |
| Conteúdo grande (HTML) | JSONB ou TEXT indexado; paginação na listagem admin |
| Marca d’água | Cloudinary overlay ou processamento server-side único na ingestão |

## Decisão técnica resumida

- **Frontend único em Next.js** alinha SEO, transições de página (`template.tsx` + CSS) e um só repositório de componentes.
- **PostgreSQL** modela bem edição → conteúdos → autores → mídia.
- **Cloudinary** no plano gratuito cobre compressão, recorte 16:9 e entrega global, reduzindo custo de CPU no backend.
