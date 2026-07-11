import 'dotenv/config'
import { z } from 'zod'

const envSchema = z
	.object({
		PORT: z.coerce.number().default(3000),
		NODE_ENV: z
			.enum(['development', 'production', 'test'])
			.default('development'),
		FRONTEND_URL: z.url(),

		// --- Database ---
		DB_DRIVER: z.enum(['sqlite', 'mysql']).default('sqlite'),

		// SQLite
		SQLITE_PATH: z.string().default('./local.db'),

		// MySQL
		DB_HOST: z.string().optional(),
		DB_USER: z.string().optional(),
		DB_PASSWORD: z.string().optional(),
		DB_NAME: z.string().optional(),

		// --- JWT ---
		JWT_SECRET: z
			.string()
			.min(32, 'JWT_SECRET debe tener al menos 32 caracteres')
	})
	.refine(
		(env) =>
			env.DB_DRIVER !== 'mysql' ||
			(env.DB_HOST && env.DB_USER && env.DB_PASSWORD && env.DB_NAME),
		{
			message:
				'DB_HOST, DB_USER, DB_PASSWORD y DB_NAME son requeridos cuando DB_DRIVER=mysql',
			path: ['DB_DRIVER']
		}
	)

const result = envSchema.safeParse(process.env)

if (!result.success) {
	console.error('❌ Invalid environment variables:')
	for (const issue of result.error.issues) {
		console.error(`- ${issue.path.join('.')}: ${issue.message}`)
	}
	process.exit(1)
}

export const env = result.data
