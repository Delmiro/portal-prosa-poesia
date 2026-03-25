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
├── backend/                # API Spring Boot (projeto Maven)
└── README.md
```

## Backend (`/backend`)

```
backend/
├── pom.xml
├── src/main/java/com/portalrevista/
│   ├── PortalRevistaApplication.java
│   ├── config/             # Security, CORS, JWT, OpenAPI
│   ├── domain/             # Entidades JPA
│   ├── repository/       # Spring Data JPA
│   ├── service/            # Regras de negócio
│   └── web/
│       ├── controller/     # REST
│       └── dto/            # Request/response
└── src/main/resources/
    └── application.yml
```

## Convenções

- **Controller**: apenas HTTP e validação de entrada.
- **Service**: regras de domínio e orquestração (Cloudinary, paginação).
- **Repository**: apenas persistência.
