import 'dotenv/config'
import { z } from 'zod'

const baseSchema = z.object({
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	FRONTEND_URL: z.url(),

	// --- JWT ---
	JWT_SECRET: z
		.string()
		.min(32, 'JWT_SECRET debe tener al menos 32 caracteres')
})

const sqliteSchema = baseSchema.extend({
	DB_DRIVER: z.literal('sqlite'),
	SQLITE_PATH: z.string().default('./local.db'),
})

const mysqlSchema = baseSchema.extend({
	DB_DRIVER: z.literal('mysql'),
	DB_HOST: z.string(),
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string(),
})

const envSchema = z.discriminatedUnion('DB_DRIVER', [
	sqliteSchema.extend({ DB_HOST: z.undefined(), DB_USER: z.undefined(), DB_PASSWORD: z.undefined(), DB_NAME: z.undefined() }),
	mysqlSchema.extend({ SQLITE_PATH: z.string().default('./local.db') }),
])

const result = envSchema.safeParse(process.env)

if (!result.success) {
	console.error('❌ Invalid environment variables:')
	for (const issue of result.error.issues) {
		console.error(`- ${issue.path.join('.')}: ${issue.message}`)
	}
	process.exit(1)
}

export const env = result.data
