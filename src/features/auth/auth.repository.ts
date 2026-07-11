import { and, eq, gt } from 'drizzle-orm'
import { credentials, refreshTokens, sessions, users } from '../../db/schema/sqlite'
import { sqliteDb as db } from '../../db/sqlite'
import type { CreateRefreshTokenData } from '../../types/auth'

export const authRepository = {
	// ─── Users ──────────────────────────────────────────────────────────────
	findUserByEmail(email: string) {
		return db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1)
			.all()[0]
	},

	findUserById(id: number) {
		return db.select().from(users).where(eq(users.id, id)).limit(1).all()[0]
	},

	// ─── Credentials ────────────────────────────────────────────────────────
	findCredentialByUserAndProvider(
		userId: number,
		provider: 'password' | 'google' | 'github'
	) {
		return db
			.select()
			.from(credentials)
			.where(
				and(eq(credentials.userId, userId), eq(credentials.provider, provider))
			)
			.limit(1)
			.all()[0]
	},

	// ─── Sessions ──────────────────────────────────────────────────────────
	createSession(data: { userId: number; userAgent: string | null; ipAddress: string | null; expiresAt: Date }) {
		const result = db.insert(sessions).values(data).run()
		return result.lastInsertRowid
	},

	findActiveSessionsByUserId(userId: number) {
		return db
			.select()
			.from(sessions)
			.where(
				and(
					eq(sessions.userId, userId),
					gt(sessions.expiresAt, new Date())
				)
			)
			.all()
	},

	findSessionById(id: number) {
		return db
			.select()
			.from(sessions)
			.where(eq(sessions.id, id))
			.limit(1)
			.all()[0]
	},

	deleteSession(id: number) {
		db.delete(sessions).where(eq(sessions.id, id)).run()
	},

	deleteAllUserSessions(userId: number) {
		db.delete(sessions).where(eq(sessions.userId, userId)).run()
	},

	// ─── Refresh tokens ─────────────────────────────────────────────────────
	findRefreshTokenByHash(tokenHash: string) {
		return db
			.select()
			.from(refreshTokens)
			.where(eq(refreshTokens.tokenHash, tokenHash))
			.limit(1)
			.all()[0]
	},

	createRefreshToken(data: CreateRefreshTokenData) {
		db.insert(refreshTokens).values(data).run()
	},

	deleteRefreshToken(id: number) {
		db.delete(refreshTokens).where(eq(refreshTokens.id, id)).run()
	},

	revokeRefreshTokenFamily(familyId: string) {
		db.update(refreshTokens)
			.set({ revokedAt: new Date() })
			.where(eq(refreshTokens.familyId, familyId))
			.run()
	},

	revokeAllUserRefreshTokens(userId: number) {
		db.update(refreshTokens)
			.set({ revokedAt: new Date() })
			.where(eq(refreshTokens.userId, userId))
			.run()
	},

	findRefreshTokenById(id: number) {
		return db
			.select()
			.from(refreshTokens)
			.where(eq(refreshTokens.id, id))
			.limit(1)
			.all()[0]
	},
}
