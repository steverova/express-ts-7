# Express TypeScript Setup

## Stack

- Node.js 24
- TypeScript 7
- Express 5
- Drizzle ORM
- esbuild 0.28
- Zod 4
- Biome

## Scripts

```bash
pnpm dev          # desarrollo con hot reload
pnpm typecheck    # validación de tipos sin compilar
pnpm build        # typecheck + bundle con esbuild
pnpm preview      # ejecuta dist/index.js
```

## Alias

Definidos en `package.json` (Node runtime), `tsconfig.json` (TypeScript) y `esbuild.config.ts` (bundle).

| Alias | Ruta |
|---|---|
| `#lib/*` | `src/lib/*` |
| `#config/*` | `src/config/*` |
| `#middlewares/*` | `src/middlewares/*` |
| `#features/*` | `src/features/*` |

Para agregar un alias nuevo, actualizarlo en los tres lugares.

## Estructura

```
src/
  config/
    env.ts              # validación de variables de entorno con zod (discriminated union)
  db/
    index.ts            # instancia del cliente de Drizzle
    client.ts           # factory: crea cliente SQLite o MySQL según DB_DRIVER
    schema/
      mysql/
        index.ts        # re-exports de todas las tablas MySQL
        tables/
          users.ts
          loginAttempts.ts
          refreshTokens.ts
          passwordResetTokens.ts
      sqlite/
        index.ts        # re-exports de todas las tablas SQLite
        tables/
          users.ts
          loginAttempts.ts
          refreshTokens.ts
          passwordResetTokens.ts
    sql/                # scripts SQL originales (referencia)
  lib/
    app-error.ts        # clase AppError
    code.ts             # utilidades: uuid, randomDigits, randomString, generatePassword
  middlewares/
    cors-config.ts      # configuración de CORS
    error-handler.ts    # manejo global de errores
    not-found.ts        # handler 404
    rate-limiter.middleware.ts
    require-role.ts
    validate-zod.ts     # validación de request con zod schemas
  index.ts              # entry point
drizzle.config.mysql.ts   # config de Drizzle Kit para MySQL
drizzle.config.sqllite.ts # config de Drizzle Kit para SQLite
esbuild.config.ts         # config de bundle
tsconfig.json             # config de TypeScript (src/)
tsconfig.node.json        # config de TypeScript (esbuild.config.ts)
```

## Variables de entorno

Usa un discriminated union en `DB_DRIVER` para validar los campos requeridos según el driver.

### SQLite (default)

```env
DB_DRIVER=sqlite
SQLITE_PATH=./local.db             # opcional, default ./local.db
```

### MySQL

```env
DB_DRIVER=mysql
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=mydb
```

### Comunes

```env
PORT=3000                          # opcional, default 3000
NODE_ENV=development               # opcional, default development
FRONTEND_URL=http://localhost:5173 # requerido
JWT_SECRET=mínimo32caracteres      # requerido
```

## Base de datos

Ver [DB_SCRIPTS.md](./DB_SCRIPTS.md) para la guía completa de scripts de Drizzle Kit.

Resumen rápido:

```bash
pnpm db:studio                # UI visual para inspeccionar la DB
pnpm db:push:sqlite           # desarrollo: empuja schema a SQLite
pnpm db:generate:mysql        # genera migraciones SQL para MySQL
pnpm db:migrate:mysql         # ejecuta migraciones pendientes
```

## Notas

- `tsc` solo se usa para typecheck, nunca para compilar
- esbuild externaliza todas las `dependencies` del `package.json` automáticamente
- `--strip-types` de Node 24 no soporta parameter properties de TypeScript — usar asignación explícita en constructores
- El error handler debe registrarse después del `notFoundHandler` en `index.ts`
