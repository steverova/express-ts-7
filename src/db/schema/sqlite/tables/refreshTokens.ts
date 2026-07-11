import {
	integer,
	sqliteTable,
	text
} from 'drizzle-orm/sqlite-core'
import { users } from './users'

export const refreshTokens = sqliteTable('refresh_tokens', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	tokenHash: text('token_hash').notNull(),
	familyId: text('family_id').notNull(),
	userAgent: text('user_agent'),
	ipAddress: text('ip_address'),
	revokedAt: integer('revoked_at', { mode: 'timestamp' }),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date())
})
