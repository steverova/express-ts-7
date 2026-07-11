import { randomUUID } from 'node:crypto'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '#lib/app-error'
import { hashToken, verifyPassword } from '#lib/crypto'
import { signAccessToken } from '#lib/jwt'
import type { AuthTokens, LoginParams } from '../../types/auth'
import { AUTH } from './auth.constants'
import { authRepository } from './auth.repository'

// ─── Service ─────────────────────────────────────────────────────────────────
export const authService = {
	async login({
		email,
		password,
		userAgent,
		ipAddress,
	}: LoginParams): Promise<AuthTokens> {
		const user = authRepository.findUserByEmail(email)

		if (!user) {
			throw new AppError('Credenciales inválidas', StatusCodes.UNAUTHORIZED)
		}

		if (user.status !== 'active') {
			throw new AppError('Cuenta suspendida', StatusCodes.FORBIDDEN)
		}

		const cred = authRepository.findCredentialByUserAndProvider(
			user.id,
			'password'
		)

		if (!cred || !cred.passwordHash) {
			throw new AppError('Credenciales inválidas', StatusCodes.UNAUTHORIZED)
		}

		const valid = verifyPassword(password, cred.passwordHash)
		if (!valid) {
			throw new AppError('Credenciales inválidas', StatusCodes.UNAUTHORIZED)
		}

		const accessToken = await signAccessToken({
			id: user.id,
			role: user.role,
		})

		const refreshTokenRaw = randomUUID()
		const tokenHash = hashToken(refreshTokenRaw)
		const familyId = randomUUID()
		const expiresAt = new Date(Date.now() + AUTH.REFRESH_TOKEN_TTL_MS)

		authRepository.createRefreshToken({
			userId: user.id,
			tokenHash,
			familyId,
			userAgent: userAgent ?? null,
			ipAddress: ipAddress ?? null,
			expiresAt,
		})

		return { accessToken, refreshToken: refreshTokenRaw, expiresAt, userId: user.id }
	},

	async refresh(refreshTokenRaw: string): Promise<AuthTokens> {
		const tokenHash = hashToken(refreshTokenRaw)
		const token = authRepository.findRefreshTokenByHash(tokenHash)

		if (!token) {
			throw new AppError('Refresh token inválido', StatusCodes.UNAUTHORIZED)
		}

		if (token.revokedAt) {
			authRepository.revokeRefreshTokenFamily(token.familyId)
			throw new AppError(
				'Token comprometido, sesiones revocadas',
				StatusCodes.UNAUTHORIZED
			)
		}

		if (new Date() > token.expiresAt) {
			throw new AppError('Refresh token expirado', StatusCodes.UNAUTHORIZED)
		}

		const user = authRepository.findUserById(token.userId)

		if (!user || user.status !== 'active') {
			throw new AppError('Usuario no válido', StatusCodes.UNAUTHORIZED)
		}

		authRepository.revokeRefreshToken(token.id)

		const newRefreshRaw = randomUUID()
		const newHash = hashToken(newRefreshRaw)
		const expiresAt = new Date(Date.now() + AUTH.REFRESH_TOKEN_TTL_MS)

		authRepository.createRefreshToken({
			userId: user.id,
			tokenHash: newHash,
			familyId: token.familyId,
			userAgent: token.userAgent,
			ipAddress: token.ipAddress,
			expiresAt,
		})

		const accessToken = await signAccessToken({
			id: user.id,
			role: user.role,
		})

		return { accessToken, refreshToken: newRefreshRaw, expiresAt, userId: user.id }
	},

	logoutAll(userId: number) {
		authRepository.revokeAllUserRefreshTokens(userId)
	},

	getMe(userId: number) {
		const user = authRepository.findUserById(userId)

		if (!user) {
			throw new AppError('Usuario no encontrado', StatusCodes.NOT_FOUND)
		}

		return {
			id: user.publicId,
			email: user.email,
			role: user.role,
			status: user.status,
			createdAt: user.createdAt,
		}
	},
}
