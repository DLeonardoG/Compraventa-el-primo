# Compraventa El Primo S.A.S.

Plantilla white-label Cloud-Light (Next.js + TypeScript + Tailwind + pnpm) para compraventa de vehículos y parcelas, con estética editorial de showroom, CMS en Google Sheets, uploads a Cloudinary y formularios vía Google Apps Script.

## Arranque rápido

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## White-label

Edita [`src/config/site.config.ts`](src/config/site.config.ts):

1. `companyName`, `shortName`, contacto, horarios y redes.
2. Colores en `theme` (champagne `#C5A059`, WhatsApp `#15803D`).
3. Integraciones: `googleSheetId`, `appsScriptUrl`, Cloudinary y `uploaderPin`.

Sin `googleSheetId`, la web usa mocks realistas.

## Google Sheets

### `Vehiculos`

`id`, `marca`, `modelo`, `anio`, `kilometraje`, `transmision`, `combustible`, `motor`, `traccion`, `color`, `placa`, `blindaje`, `precio`, `linea`, `estado`, `destacado`, `descripcion`, `fotos`

### `Parcelas`

`id`, `titulo`, `ubicacion`, `area_m2`, `precio`, `servicios`, `topografia`, `documentacion`, `estado`, `destacado`, `descripcion`, `fotos`

## Rutas

- `/` Home editorial
- `/vehiculos` y `/vehiculos/[id]`
- `/prestige` y `/importacion`
- `/parcelas` y `/parcelas/[id]`
- `/nosotros#formteam`
- `/contacto`
- `/subir-fotos` (PIN interno)

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
