# Database Scripts

Scripts para gestionar la base de datos con Drizzle ORM.

## Configuración

El proyecto soporta dos drivers de base de datos, controlados por la variable `DB_DRIVER` en `.env`:

- `sqlite` — base de datos local (desarrollo por defecto)
- `mysql` — base de datos MySQL/compatibles

Cada driver tiene su propio archivo de configuración:
- `drizzle.config.sqlite.ts`
- `drizzle.config.mysql.ts`

---

## Comandos

### Drizzle Studio

```bash
pnpm db:studio
```

Abre la interfaz visual de Drizzle Studio en el navegador. Sirve para inspeccionar tablas, ver datos y hacer queries manuales. Funciona con el driver configurado en `DB_DRIVER`.

---

### MySQL

#### Generar migraciones

```bash
pnpm db:generate:mysql
```

Compara el schema (`src/db/schema/mysql/`) contra la base de datos y genera los archivos de migración SQL en `drizzle/mysql/`. **No ejecuta nada**, solo crea los archivos.

**Cuándo usarlo:** Cuando modificaste un schema y querés generar el SQL correspondiente antes de aplicarlo.

#### Empujar schema (desarrollo)

```bash
pnpm db:push:mysql
```

Aplica los cambios del schema directamente a la base de datos **sin crear archivos de migración**. Equivalente a un `sync`.

**Cuándo usarlo:** En desarrollo, cuando querés que la DB quede al día rápido sin historial de migraciones.

#### Ejecutar migraciones

```bash
pnpm db:migrate:mysql
```

Ejecuta los archivos de migración generados con `db:generate:mysql` que aún no fueron aplicados.

**Cuándo usarlo:** En producción o cuando ya generaste migraciones con `db:generate` y necesitás aplicarlas.

#### Eliminar base de datos

```bash
pnpm db:drop:mysql
```

Elimina todas las tablas de la base de datos. Pide confirmación antes de ejecutar.

**Cuándo usarlo:** Para resetear la DB desde cero.

---

### SQLite

Los mismos comandos pero con el sufijo `:sqlite`:

```bash
pnpm db:generate:sqlite   # Genera migraciones
pnpm db:push:sqlite        # Empuja schema directo
pnpm db:migrate:sqlite     # Ejecuta migraciones pendientes
pnpm db:drop:sqlite        # Elimina la DB
```

---

## Flujo típico

### Desarrollo

```bash
# 1. Modificás el schema en src/db/schema/mysql/ o src/db/schema/sqlite/
# 2. Empujás directo a la DB
pnpm db:push:sqlite
```

### Producción

```bash
# 1. Generás la migración
pnpm db:generate:mysql

# 2. La revisás en drizzle/mysql/

# 3. La aplicás
pnpm db:migrate:mysql
```

### Reset completo

```bash
pnpm db:drop:sqlite
pnpm db:push:sqlite
```
