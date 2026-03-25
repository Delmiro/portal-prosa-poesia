# O LÚMEN DA ALAAS — portal de revista digital

Portal **Next.js** com leitura estilo revista física (folhear páginas com **StPageFlip** via `react-pageflip`), inspirado em experiências como [Issuu](https://issuu.com/) e [Flipsnack](https://www.flipsnack.com/). API **Spring Boot** e **PostgreSQL** para conteúdo e administração; imagens via **Cloudinary** (planejado).

## Frontend

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Leitura folheada: `/edicoes/20/revista`.

## Backend

```bash
cd backend
mvn spring-boot:run
```

Health: `GET http://localhost:8080/api/health`

## Documentação

| Documento | Conteúdo |
|-----------|------------|
| [docs/PROJETO.md](docs/PROJETO.md) | Objetivo, stack, arquitetura, hospedagem |
| [docs/ESTRUTURA_PASTAS.md](docs/ESTRUTURA_PASTAS.md) | Pastas frontend e backend |
| [docs/schema.sql](docs/schema.sql) | Modelo PostgreSQL |
| [docs/WIREFRAMES.md](docs/WIREFRAMES.md) | Wireframes de telas |
| [docs/ARQUITETURA.md](docs/ARQUITETURA.md) | Visão técnica complementar |

## Hospedagem sugerida

- Frontend: **Vercel**
- API: **Render** ou **Railway**
- Banco: **Supabase** ou **Neon**
- Imagens: **Cloudinary**
