import {
	integer,
	sqliteTable,
	text
} from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	email: text('email').unique().notNull(),
	emailVerifiedAt: integer('email_verified_at', { mode: 'timestamp' }),
	role: text('role').notNull().default('user'),
	status: text('status', { enum: ['active', 'suspended', 'deleted'] }).default(
		'active'
	),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.default(new Date())
		.$onUpdate(() => new Date())
})
