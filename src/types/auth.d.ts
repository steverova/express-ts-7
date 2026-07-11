export interface CreateRefreshTokenData {
	userId: number
	tokenHash: string
	familyId: string
	userAgent: string | null
	ipAddress: string | null
	expiresAt: Date
}

export interface AuthTokens {
	accessToken: string
	refreshToken: string
	expiresAt: Date
}

export interface LoginParams {
	email: string
	password: string
	userAgent?: string | undefined
	ipAddress?: string | undefined
}
