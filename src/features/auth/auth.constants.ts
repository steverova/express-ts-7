export const AUTH = {
	ACCESS_TOKEN_TTL: '15m',
	REFRESH_TOKEN_TTL_MS: 7 * 24 * 60 * 60 * 1000, // 7 días
	REFRESH_COOKIE: 'refresh_token',
	REFRESH_COOKIE_MAX_AGE: 7 * 24 * 60 * 60 // 7 días en segundos
} as const
