# Express TypeScript Setup

## Stack

- Node.js 24
- TypeScript 7
- Express 5
- esbuild 0.28
- Zod 4
- Biome

## Scripts

```bash
pnpm dev        # desarrollo con hot reload
pnpm typecheck  # validación de tipos sin compilar
pnpm build      # typecheck + bundle con esbuild
pnpm preview    # ejecuta dist/index.js
```

## Alias

Definidos en `package.json` (Node runtime), `tsconfig.json` (TypeScript) y `esbuild.config.ts` (bundle).

| Alias | Ruta |
|---|---|
| `#lib/*` | `src/lib/*` |
| `#config/*` | `src/config/*` |
| `#middlewares/*` | `src/middlewares/*` |

Para agregar un alias nuevo, actualizarlo en los tres lugares.

## Estructura

```
src/
  config/
    env.ts           # validación de variables de entorno con zod
  lib/
    app-error.ts     # clase AppError
    code.ts          # utilidades: uuid, randomDigits, randomString, generatePassword
  middlewares/
    cors-config.ts   # configuración de CORS
    error-handler.ts # manejo global de errores
    not-found.ts     # handler 404
    rate-limiter.middleware.ts
    requirequire-role.ts
    validate-zod.ts  # validación de request con zod schemas
  index.ts           # entry point
esbuild.config.ts    # config de bundle
tsconfig.json        # config de TypeScript (src/)
tsconfig.node.json   # config de TypeScript (esbuild.config.ts)
```

## Variables de entorno

```env
PORT=3000                          # opcional, default 3000
NODE_ENV=development               # opcional, default development
FRONTEND_URL=http://localhost:5173 # requerido
```

## Notas

- `tsc` solo se usa para typecheck, nunca para compilar
- esbuild externaliza todas las `dependencies` del `package.json` automáticamente
- `--strip-types` de Node 24 no soporta parameter properties de TypeScript — usar asignación explícita en constructores
- El error handler debe registrarse después del `notFoundHandler` en `index.ts`
