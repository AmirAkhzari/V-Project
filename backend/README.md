# V-Project backend

First backend drop: Prisma/Postgres schema with RLS, cart (one distributor), switch-distributor, delivery capacity, and idempotent place-order.

See [CONTRACT.md](./CONTRACT.md) for the locked product rules mapped to code.

## Stack

- TypeScript, Fastify, Prisma, PostgreSQL 16
- App role `vproject_app` is subject to row-level security. Migrations/seed use `DATABASE_ADMIN_URL`.

## Setup

```bash
# Postgres (or: docker compose up -d)
cp .env.example .env
npx prisma migrate deploy
npx prisma generate
npm test
npm run dev
```

Shopkeeper identity is taken only from `Authorization: Bearer <jwt>` (`shopkeeper_id` claim). Client `shopkeeper_id` in body or query is `401`.
