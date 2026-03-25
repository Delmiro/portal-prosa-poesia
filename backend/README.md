# portal-revista-api (Spring Boot)

API REST para o portal da revista: edições, autores, artigos, poemas, contos, crônicas, galerias e imagens (URLs Cloudinary).

## Requisitos

- Java 17+
- Maven 3.9+

## Executar (perfil `dev`, H2 em memória)

```bash
cd backend
mvn spring-boot:run
```

- Health: `GET http://localhost:8080/api/health`
- Console H2 (dev): `http://localhost:8080/h2`

## Perfil `prod` (PostgreSQL)

Defina variáveis `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` e `SPRING_PROFILES_ACTIVE=prod`.

O esquema SQL alvo está em `../docs/schema.sql`.

## Próximos passos

- JWT + `User` login
- Controllers por recurso (edições, conteúdos)
- Serviço de upload assinado para Cloudinary
- Validação de imagens 16:9, mínimo 1200×675

## Entidades previstas

`Usuario` → `users`, `Autor` → `authors`, `EdicaoRevista` → `magazine_issues`, `Artigo`, `Poema`, `Conto`, `Cronica`, `Imagem`, `Galeria` — ver `docs/schema.sql` e expandir pacotes `domain`, `repository`, `service`, `web`.
