import { jwtVerify, SignJWT } from 'jose'
import { env } from '#config/env'
import { AUTH } from '#features/auth/auth.constants'

const secret = new TextEncoder().encode(env.JWT_SECRET)

export function signAccessToken(user: {
	id: number
	role: string
}): Promise<string> {
	return new SignJWT({ sub: String(user.id), role: user.role })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(AUTH.ACCESS_TOKEN_TTL)
		.sign(secret)
}

export function verifyAccessToken(token: string) {
	return jwtVerify(token, secret, { algorithms: ['HS256'] })
}
