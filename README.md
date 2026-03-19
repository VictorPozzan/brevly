<div align="center">
  <img src=".github/logo.svg" alt="Brev.ly" width="120" />
  
  <h1>Brevly</h1>
  <p>Encurtador de URLs simples, rápido e com relatório de acessos.</p>

  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
  ![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
</div>

---

## Sobre o projeto

O **Brev.ly** é um trabalho da pós-graduação em desenvolvimento Full-Stack. A proposta era construir um encurtador de URLs do zero — desde o banco de dados até a interface visual — integrando tudo com boas práticas de DevOps.

O projeto ficou dividido em duas partes: um backend com API REST feita em Fastify e um frontend React, ambos em TypeScript. Aproveitei pra experimentar algumas coisas que eu queria testar na prática, como o Drizzle ORM e a integração com Cloudflare R2 pra hospedar os relatórios em CSV.

O design foi baseado no [Figma oficial do desafio](https://www.figma.com/design/iUqOe8RE30hUkxouYtryHi/Encurtador-de-Links--Community-?node-id=3-376).


## Funcionalidades

- **Criar link** — informe a URL original e defina um slug personalizado
- **Listar links** — visualize todos os links com contagem de acessos em tempo real
- **Deletar link** — remova links que não precisa mais com um clique
- **Redirecionar** — acesse `brev.ly/seu-slug` e seja redirecionado para a URL original
- **Exportar CSV** — baixe um relatório completo com URL original, slug, acessos e data de criação

---

## Estrutura do repositório
```
brevly/
├── web/        # Frontend (React + Vite)
└── server/     # Backend (Fastify + Drizzle) + DevOps (Docker)
```

---

## Stack

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + Fastify | Servidor HTTP e roteamento |
| TypeScript | Tipagem em todo o projeto |
| PostgreSQL | Banco de dados relacional |
| Drizzle ORM | Queries e migrations |
| Cloudflare R2 | Armazenamento do CSV exportado |
| Docker | Container do banco em desenvolvimento |
| Zod | Validação de schemas |

### Frontend
| Tecnologia | Uso |
|---|---|
| React + Vite | SPA com build rápido |
| TypeScript | Tipagem de componentes e hooks |
| React Query | Gerenciamento de estado assíncrono |
| React Hook Form | Formulários com validação |
| Tailwind CSS | Estilização utilitária |

---

## Como rodar localmente

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- pnpm

### Backend
```bash
cd server

# Sobe o banco com Docker
docker-compose up -d

# Instala dependências
pnpm install

# Copia e preenche as variáveis de ambiente
cp .env.example .env

# Roda as migrations
pnpm run db:migrate

# Inicia o servidor
pnpm run dev
```

O servidor vai rodar em `http://localhost:3333`.

### Frontend
```bash
cd web

# Instala dependências
pnpm install

# Copia e preenche as variáveis de ambiente
cp .env.example .env

# Inicia a aplicação
pnpm run dev
```

A aplicação vai rodar em `http://localhost:3000`.

---

## Variáveis de ambiente

### `server/.env`
```env
PORT=3333
NODE_ENV=development
DATABASE_URL=postgresql://docker:docker@localhost:5432/brevly

CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
CLOUDFLARE_BUCKET=
CLOUDFLARE_PUBLIC_URL=
```

### `web/.env`
```env
VITE_BACKEND_URL=http://localhost:3333
VITE_FRONTEND_URL=http://localhost:3000
```

---

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/links` | Cria um novo link |
| `GET` | `/links` | Lista todos os links |
| `GET` | `/links/:shortCode` | Busca URL original pelo slug |
| `PATCH` | `/links/:shortCode/access` | Incrementa contador de acessos |
| `DELETE` | `/links/:shortCode` | Remove um link |
| `GET` | `/links/export` | Gera e retorna CSV via CDN |

---

