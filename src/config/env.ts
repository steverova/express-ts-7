import 'dotenv/config'
import { z } from 'zod'

const hexMessage =
	"Must be a 64 char hex string, use: \n node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""

const envSchema = z.object({
	DOTENV_CONFIG_QUIET: z
		.string()
		.optional()
		.transform((v) => v === 'true'),
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(['development', 'production', 'test']),
	SESSION_SECRET: z.string().regex(/^[a-f0-9]{64}$/, hexMessage),
	SESSION_ID: z.string().default('sid'),
	DB_HOST: z.string(),
	DB_PORT: z.coerce.number().default(3306),
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string(),
	CORS_ORIGIN: z.string(),
	TZ: z.string(),
	RATE_LIMIT_WINDOW_MS: z.coerce.number(),
	RATE_LIMIT_MAX: z.coerce.number(),
	RESET_TOKEN_SECRET: z.string().regex(/^[a-f0-9]{64}$/, hexMessage),
	MAX_SESSIONS_ALLOWED: z.coerce.number().default(1),
	FRONTEND_URL: z.url(),
	APP_URL: z.url(),
	EMAIL_HOST: z.string(),
	EMAIL_PORT: z.coerce.number().default(587),
	EMAIL_USER: z.email(),
	EMAIL_PASS: z.string(),
	EMAIL_FROM: z.email(),
	GOOGLE_CLIENT_ID: z.string().endsWith('.apps.googleusercontent.com', {
		message:
			'GOOGLE_CLIENT_ID must be a valid Google OAuth client ID ending with .apps.googleusercontent.com',
	}),
	GOOGLE_CLIENT_SECRET: z.string().startsWith('GOCSPX-', {
		message:
			'GOOGLE_CLIENT_SECRET must be a valid Google OAuth client secret starting with GOCSPX-',
	}),
	GOOGLE_REDIRECT_URI: z
		.string()
		.url({ message: 'GOOGLE_REDIRECT_URI must be a valid URL' }),

	DB_DRIVER: z.enum(['sqlite', 'mysql', 'postgres']),
	SQLITE_PATH: z.string().optional(),
	SESSION_DURATION: z.coerce.number().default(1000 * 60 * 60 * 24), // 1 day in ms
  ROTATION_INTERVAL: z.coerce.number().default(1000 * 60 * 60), // 1 hour in ms
  SEED_EMAIL: z.email().optional(),
	SEED_PASS: z.string().optional()
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
	console.error('❌ Invalid environment variables:')
	for (const issue of result.error.issues) {
		console.error(`- ${issue.path.join('.')}: ${issue.message}`)
	}
	process.exit(1)
}

export const env = result.data
