# Compraventa El Primo S.A.S.

Showroom editorial para vehículos, línea Prestige, importación bajo pedido y parcelas. Next.js en Vercel, Lakebase Postgres en Neon con Prisma, y archivos en Cloudflare R2 mediante URLs prefirmadas.

## Arranque

```bash
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

La identidad comercial vive en `src/config/site.config.ts`: nombre legal, WhatsApp, sede, redes y parámetros del simulador de crédito.

## Variables

Copia `.env.example` a `.env`. Neon escribe `DATABASE_URL` y `DATABASE_URL_UNPOOLED`. Completa las credenciales de administrador y del bucket S3/R2 antes de publicar medios.

## Rutas

- `/` inicio
- `/vehiculos` y `/vehiculos/[slug]`
- `/prestige` y `/importacion`
- `/parcelas` y `/parcelas/[slug]`
- `/nosotros#formteam`
- `/contacto`
- `/admin` panel protegido con sesión JWT
