# Estrutura de pastas

## Frontend (`/` raiz do repositório)

```
portal-revista/
├── public/                 # Assets estáticos (favicon, capas locais)
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Raiz: fontes, metadata, idioma
│   │   ├── globals.css     # Tema shadcn + estilo revista
│   │   └── (site)/         # Site público (grupo de rotas)
│   │       ├── layout.tsx  # Header + footer
│   │       ├── template.tsx# Transição entre páginas
│   │       ├── page.tsx    # Home / capa da edição atual
│   │       ├── edicoes/
│   │       ├── edicoes/[id]/ ou edicoes/20/  # Edição + link para leitura flip
│   │       ├── autores/
│   │       ├── editorial/
│   │       ├── poemas/
│   │       ├── contos/
│   │       ├── cronicas/
│   │       ├── artigos/
│   │       ├── galeria/
│   │       ├── sobre/
│   │       ├── contato/
│   │       └── admin/      # (futuro) ou /admin em rota separada
│   ├── components/
│   │   ├── ui/             # shadcn (button, etc.)
│   │   ├── magazine/       # Flipbook, página de revista
│   │   ├── site-header.tsx
│   │   └── site-footer.tsx
│   ├── content/            # Dados estáticos / mock até API
│   ├── hooks/              # useMediaQuery, tema, etc.
│   └── lib/                # utils, siteConfig, fetch API
├── docs/                   # Documentação do produto e BD
├── docker/                 # Postgres init (SQL)
├── src/db/                 # Drizzle schema + seed
├── src/app/api/            # API REST (auth, admin, público)
└── README.md
```

## API (Next.js Route Handlers)

A API vive em `src/app/api/` (auth, admin, público, mídia). Persistência em PostgreSQL com Drizzle (`src/db/schema.ts`).

## Convenções

- **Controller**: apenas HTTP e validação de entrada.
- **Service**: regras de domínio e orquestração (Cloudinary, paginação).
- **Repository**: apenas persistência.
