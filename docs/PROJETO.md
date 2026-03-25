# Portal de revista digital — visão do produto

## Objetivo

Portal onde autores publicam **mensalmente** conteúdos literários (editorial, poemas, contos, crônicas, artigos, galerias), organizados por **edição**. Cada edição pode ser lida como **revista folheada** (efeito de páginas), com experiência próxima a [Issuu](https://issuu.com/) ou [Flipsnack](https://www.flipsnack.com/).

## Stack (100% gratuita em planos básicos)

| Camada | Tecnologia | Hospedagem sugerida |
|--------|------------|---------------------|
| Frontend | Next.js, React, Tailwind, shadcn/ui, **StPageFlip** via `react-pageflip` | Vercel |
| Backend | Spring Boot (API REST, JWT) | Render ou Railway |
| Banco | PostgreSQL | Supabase ou Neon |
| Imagens | Cloudinary (crop 16:9, compressão, CDN, marca d’água opcional) | Cloudinary |

## Arquitetura lógica

```
Next.js (SSR/ISR, SEO)
    │  HTTPS + JSON + JWT
    ▼
Spring Boot (regras de negócio, validação, uploads assinados)
    │
    ├── PostgreSQL
    └── URLs de mídia → Cloudinary
```

## Experiência de leitura (revista)

- **Virar páginas** (arrastar cantos ou botões).
- **Sumário** com salto para página.
- **Zoom** na área da revista (acessibilidade e telas pequenas).
- **Telas largas**: modo paisagem com **duas páginas** visíveis (quando suportado pelo StPageFlip); mobile em retrato com página única.

## Área administrativa

Login (JWT), CRUD de edições, autores, textos, galerias, upload com validação **mín. 1200×675**, proporção **16:9**, editor rico (TipTap/Lexical) persistindo HTML/JSON.

## Extras desejáveis

Modo leitura, modo noturno, buscas (autor, edição, palavras-chave), Open Graph para compartilhamento.

## Entregáveis

| Entregável | Local |
|------------|--------|
| Estrutura de pastas | `docs/ESTRUTURA_PASTAS.md` |
| Modelo de dados | `docs/schema.sql` |
| Wireframes | `docs/WIREFRAMES.md` |
| Arquitetura técnica | `docs/ARQUITETURA.md` |
| Frontend | repositório `src/` |
| Backend | repositório `backend/` |
