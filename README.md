# Compraventa El Primo S.A.S.

Plantilla white-label Cloud-Light (Next.js + TypeScript + Tailwind) para compraventa de vehículos y parcelas, con CMS en Google Sheets, uploads a Cloudinary y formularios vía Google Apps Script.

## Arranque rápido

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## White-label (clonar para otro cliente)

Edita un solo archivo: [`src/config/site.config.ts`](src/config/site.config.ts)

1. Cambia `name`, `shortName`, contacto, dirección, horarios y redes.
2. Ajusta colores en `theme` (se inyectan como variables CSS).
3. Completa `integrations`:
   - `googleSheetId`
   - `appsScriptUrl`
   - `cloudinaryCloudName`
   - `cloudinaryUploadPreset`
   - `uploaderPin`

Si `googleSheetId` está vacío, la web usa datos mock realistas.

## Google Sheets (CMS)

Crea un spreadsheet público (o con acceso de lectura) con dos pestañas:

### `Vehiculos`

`id`, `marca`, `modelo`, `anio`, `kilometraje`, `transmision`, `combustible`, `motor`, `precio`, `linea`, `estado`, `destacado`, `descripcion`, `fotos`

### `Parcelas`

`id`, `titulo`, `ubicacion`, `area_m2`, `precio`, `servicios`, `estado`, `destacado`, `descripcion`, `fotos`

- `linea`: `Normal` | `Prestige` | `Importacion`
- `estado`: `Disponible` | `Reservado` | `Vendido`
- `destacado`: `SI` | `NO`
- `fotos`: URLs separadas por comas

## Subida de fotos

Ruta oculta: `/subir-fotos` (PIN por defecto `2026`).

Sube imágenes a Cloudinary (preset sin firma) y copia el CSV de URLs para pegarlo en Sheets.

## Scripts

- `pnpm dev` — desarrollo
- `pnpm build` — build de producción
- `pnpm start` — servidor de producción
- `pnpm lint` — ESLint

## Deploy $0/mes

Despliega en Vercel Free. No requiere base de datos propia.
