# Air in Rio — Ranking del incentivo

Sitio para el incentivo de ventas "Air in Rio". Los clientes ingresan su número
de cliente y ven si están dentro del Top 20 de cada marca participante.

- **Sitio público:** `/` — buscador + grilla de marcas
- **Panel de carga:** `/admin` — subir el Excel con el Top 20 de cada marca (protegido por contraseña)

## Formato del Excel

Un archivo `.xlsx` con **una hoja por marca**:

- El nombre de la hoja = nombre de la marca (así se muestra en el sitio).
- Columna A = números de cliente del Top 20, uno por fila, en orden de posición
  (la fila 2 es el N° 1 del ranking). La fila 1 puede tener el título "Cliente" (opcional).
- Se toman como máximo los primeros 20 valores de cada hoja.

Hay una plantilla lista para completar en `/admin` → "Descargar plantilla de Excel"
(o en `public/templates/plantilla-top20.xlsx`).

## Cómo funciona el guardado de datos

Cada vez que subís un Excel nuevo desde `/admin`, **reemplaza por completo** el
ranking anterior. Los datos se guardan en Vercel Blob, así que no hace falta
tocar código ni volver a deployar para actualizar el Top 20.

## Variables de entorno

Ver `.env.example`. Las importantes:

- `ADMIN_PASSWORD` — obligatoria en producción, sin ella `/admin` no deja subir nada.
- `BLOB_READ_WRITE_TOKEN` — la agrega Vercel automáticamente al conectar un Blob Store.
- `NEXT_PUBLIC_DEADLINE`, `NEXT_PUBLIC_DEADLINE_LABEL`, `NEXT_PUBLIC_CLAIM` — opcionales,
  para cambiar la fecha límite y el texto del hero sin tocar código.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y completá ADMIN_PASSWORD
npm run dev
```

Sin `BLOB_READ_WRITE_TOKEN`, en local los datos se guardan en un archivo dentro
de `.data/` (ignorado por git) — solo para probar, no sirve en producción.

## Deploy en Vercel

Ver la guía paso a paso que te pasé en el chat. En resumen: subir a GitHub →
importar en Vercel → conectar un Blob Store (Storage → Create Database → Blob)
→ agregar `ADMIN_PASSWORD` en Settings → Environment Variables → redeploy.

## Nota sobre las fotos del hero

`public/assets/arena.png` y `agua.png` son las imágenes que ya venían en tu
mockup. Si querés reemplazarlas por fotos propias del evento, son esos mismos
dos archivos (mismo nombre, mismas proporciones).
