import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	FRONTEND_URL: z.url(),
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

