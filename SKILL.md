---
name: express-ts-server
description: Scaffold and build an Express 5 + TypeScript 7 server with the same architecture as the "myapp/server" reference project. Use this skill whenever the user asks to create a backend API, set up an Express + TS project, add a new feature/module to an existing Express server, or wants the same patterns (feature-based modules, Zod validation, AppError handling, Swagger docs, CORS, rate limiting, Biome). Covers stack, scripts, aliases, folder structure, the controller/service/repository/schema/router pattern, middlewares, and build setup.
---

# Express TypeScript Server (reference: myapp/server)

This skill documents the architecture of an Express 5 + TypeScript 7 backend so similar projects can be built consistently. The reference lives at `C:\Users\steve\Desktop\myapp\server`.

## Stack

- Node.js 24
- TypeScript 7 (strict mode, `tsc` used ONLY for typecheck, never to compile)
- Express 5
- esbuild 0.28 (bundle to `dist/`, externalizes all `dependencies` automatically)
- Zod 4 (request validation + env validation)
- Biome 2 (format + lint via `biome check`)
- Swagger UI (`swagger-jsdoc` + `swagger-ui-express`) at `/docs`
- Security: `helmet`, `cors`, `compression`, `cookie-parser`, `morgan`, `express-rate-limit`
- `http-status-codes`, `jose` (JWT), `dayjs`, `winston` (logging)

## Scripts (package.json)

```json
{
  "scripts": {
    "dev": "npx tsx watch src/index.ts",
    "typecheck": "tsc --noEmit",
    "build": "pnpm run typecheck && node --strip-types esbuild.config.ts",
    "preview": "node dist/index.js"
  }
}
```

Notes:
- `tsc` only typechecks. Compilation is done by esbuild.
- Node 24 `--strip-types` does NOT support TypeScript parameter properties in constructors — use explicit assignment (`this.x = x`) in constructor bodies.
- esbuild reads `package.json` `dependencies` and externalizes all of them, so `node_modules` stay required at runtime.

## Path aliases

Defined in THREE places — keep them in sync when adding a new one:

1. `package.json` `imports` (Node runtime, ESM `#` prefix):
```json
"imports": {
  "#lib/*": "./src/lib/*.ts",
  "#config/*": "./src/config/*.ts",
  "#middlewares/*": "./src/middlewares/*.ts",
  "#features/*": "./src/features/*"
}
```
2. `tsconfig.json` `compilerOptions.paths` (TypeScript resolution).
3. `esbuild.config.ts` `alias` (so the bundle resolves them).

## Folder structure

```
src/
  index.ts                      # entry point: app wiring + listen
  config/
    env.ts                      # zod-validated env vars (process.exit(1) on bad env)
    swagger.ts                  # swagger-jsdoc Options, $ref schemas
  lib/
    app-error.ts                # AppError class (message, status)
    code.ts                     # uuid, randomDigits, randomString, generatePassword
  middlewares/
    cors-config.ts              # cors({ origin: [...], credentials: true })
    error-handler.ts            # global error handler (MUST be after notFoundHandler)
    not-found.ts                # 404 handler
    rate-limiter.middleware.ts  # limiterConfig, authRateLimiter
    requirequire-role.ts        # requireRole(...roles) guard (uses req.user)
    validate-zod.ts             # validate(schema) middleware
  router/
    index.ts                    # aggregates feature routers under /api
  features/
    <feature-name>/
      index.ts                  # re-exports the router
      <feature>.router.ts       # route defs + swagger @openapi comments
      <feature>.controller.ts   # thin: parse req, call service, res.json
      <feature>.service.ts      # business logic, throws AppError
      <feature>.repository.ts   # data access (in-memory or DB)
      <feature>.schema.ts       # zod schemas + inferred types
      <feature>.data.ts         # (optional) seed/in-memory data
  types/
    express.d.ts                # augment Express Request with req.user etc.
```

## Key patterns

### env.ts — validate on boot
```ts
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.url()
})

const result = envSchema.safeParse(process.env)
if (!result.success) {
  // print issues, process.exit(1)
}
export const env = result.data
```

### lib/app-error.ts
```ts
import { StatusCodes } from 'http-status-codes'
export class AppError extends Error {
  status: number
  constructor(message: string, status: number = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message)
    this.name = 'AppError'
    this.status = status
  }
}
```

### middlewares/validate-zod.ts
Schemas are shaped as `{ body, query, params, cookies }` nested objects, validated together:
```ts
export const validate = (schema: ZodType) => async (req, res, next) => {
  try {
    await schema.parseAsync({ body: req.body, query: req.query, params: req.params, cookies: req.cookies })
    return next()
  } catch (error) {
    if (error instanceof ZodError) {
      const validationErrors = error.issues.map(i => ({ key: i.path.join('.') || 'unknown', message: i.message }))
      return res.status(400).json(validationErrors)
    }
    return res.status(500).json([{ key: 'server', message: 'Internal server error' }])
  }
}
```

### middlewares/error-handler.ts
```ts
export function errorHandler(err, _req, res, _next): void {
  if (err instanceof AppError) {
    res.status(err.status).json({ status: 'error', message: err.message })
    return
  }
  console.error(err)
  res.status(500).json({ status: 'error', message: 'Internal server error' })
}
```
Register order in `index.ts`: `app.use(notFoundHandler)` THEN `app.use(errorHandler)`.

### middlewares/requirequire-role.ts
```ts
export function requireRole(...roles: string[]) {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError('UNAUTHORIZED', StatusCodes.UNAUTHORIZED))
    if (!req.user.role || !roles.includes(req.user.role))
      return next(new AppError('FORBIDDEN', StatusCodes.FORBIDDEN))
    next()
  }
}
```
Requires `Request` augmented with `user` in `types/express.d.ts`.

## Feature module template

Each feature follows controller → service → repository layering. Example: a `products` feature.

**schema** (`products.schema.ts`) — one zod schema per concern, nested `{ body, query, params }`:
```ts
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    price: z.number().positive(),
    category: z.string().min(1),
    description: z.string().min(1).max(500),
    stock: z.number().int().min(0),
    rating: z.number().min(0).max(5)
  })
})
export type CreateProductBody = z.infer<typeof createProductSchema>['body']
```
Note: query/param values come as strings — use `z.coerce.number()` for numbers.

**controller** (`products.controller.ts`) — thin, wraps service in try/catch, forwards errors with `next(error)`:
```ts
export const productsController = {
  create(req, res, next): void {
    try {
      const result = productsService.create(req.body as CreateProductBody)
      res.status(201).json(result)
    } catch (error) { next(error) }
  }
}
```

**service** (`products.service.ts`) — business logic, throws `AppError` for domain errors:
```ts
export const productsService = {
  getById(params: ProductParam) {
    const product = productsRepository.findById(params)
    if (!product) throw new AppError(`Product ${params.id} not found`, StatusCodes.NOT_FOUND)
    return { data: product }
  }
}
```

**repository** (`products.repository.ts`) — pure data access; returns typed entities.

**router** (`products.router.ts`) — wires `validate(schema)` + controller, with `@openapi` JSDoc comments for Swagger:
```ts
productsRouter.post('/', validate(createProductSchema), productsController.create)
```

**index.ts** — `export { productsRouter } from './products.router'`

**register** in `src/router/index.ts`:
```ts
import { productsRouter } from '#features/products-placeholder/index'
router.use('/products', productsRouter)
```

### Response shapes (convention)
- Success list: `{ data, total }`
- Success single/create: `{ data: <entity> }`
- Error: `{ status: 'error', message: string }`
- Validation error: `Array<{ key: string, message: string }>` with 400

### Swagger
- `config/swagger.ts` holds `components.schemas` ($ref targets) and `apis: ['./src/features/**/*.ts']`.
- Each route gets an `@openapi` block (method, tags, summary, params, requestBody, responses) in the router file.
- Served at `GET /docs`.

## index.ts wiring order (important)
1. `helmet()`
2. `corsConfig`
3. `express.json()` + `express.urlencoded({ extended: true })`
4. `compression()`
5. `cookieParser()`
6. `morgan('dev')`
7. Swagger `/docs`
8. routes under `/api`
9. `notFoundHandler`
10. `errorHandler`

## CORS
`corsConfig` allows `http://localhost:5173/5174/5175/4173` + `env.FRONTEND_URL`, with `credentials: true` (required for httpOnly cookie auth).

## Biome
`biome.json` present. Use `biome check --write .` for format + lint + import sorting. Run after creating/editing files.

## Typecheck / verify
After any change, run:
```bash
pnpm typecheck   # or npm run typecheck
```
Strict flags in use: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noUnusedParameters`, `verbatimModuleSyntax`, `isolatedModules`, `moduleDetection: force`. Watch array index access (use `?? ''`). With `verbatimModuleSyntax`, type-only imports must use `import type`.

## Checklist when adding a new feature
1. Create `src/features/<name>/` with `index.ts`, `router/controller/service/repository/schema(.data).ts`.
2. Define zod schemas shaped `{ body, query, params }`; export inferred types.
3. Service throws `AppError` for not-found/forbidden/conflict; controller catches and `next(error)`.
4. Router applies `validate(schema)` + controller; add `@openapi` docs; mount in `src/router/index.ts`.
5. Add `$ref` schemas to `config/swagger.ts` if new entity types are returned.
6. Run `pnpm typecheck` and `biome check --write .`.
