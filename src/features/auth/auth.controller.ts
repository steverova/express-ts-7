import type { NextFunction, Request, Response } from 'express'
import { AUTH } from './auth.constants'
import { authService } from './auth.service'

export const authController = {
	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body
			const userAgent = req.headers['user-agent']
			const ipAddress = req.ip

			const result = await authService.login({
				email,
				password,
				userAgent,
				ipAddress
			})

			res.cookie(AUTH.REFRESH_COOKIE, result.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				path: '/',
				maxAge: AUTH.REFRESH_COOKIE_MAX_AGE
			})

			res.setHeader('Authorization', `Bearer ${result.accessToken}`)
			res.status(204).end()
		} catch (error) {
			next(error)
		}
	},

	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.cookies?.[AUTH.REFRESH_COOKIE]

			if (!token) {
				res
					.status(401)
					.json({ status: 'error', message: 'Refresh token no proporcionado' })
				return
			}

			const result = await authService.refresh(token)

			res.cookie(AUTH.REFRESH_COOKIE, result.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				path: '/',
				maxAge: AUTH.REFRESH_COOKIE_MAX_AGE
			})

			res.setHeader('Authorization', `Bearer ${result.accessToken}`)
			res.status(204).end()
		} catch (error) {
			next(error)
		}
	},

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				res.status(401).json({ status: 'error', message: 'No autenticado' })
				return
			}

			const token = req.cookies?.refresh_token
			// Extraer familyId del token si es posible, o revocar todos
			authService.logoutAll(req.user.id)

			res.clearCookie(AUTH.REFRESH_COOKIE, { path: '/' })
			res.json({ status: 'ok', message: 'Sesión cerrada' })
		} catch (error) {
			next(error)
		}
	},

	async logoutAll(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				res.status(401).json({ status: 'error', message: 'No autenticado' })
				return
			}

			authService.logoutAll(req.user.id)

			res.clearCookie(AUTH.REFRESH_COOKIE, { path: '/' })
			res.json({ status: 'ok', message: 'Todas las sesiones cerradas' })
		} catch (error) {
			next(error)
		}
	},

	async me(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				res.status(401).json({ status: 'error', message: 'No autenticado' })
				return
			}

			const user = authService.getMe(req.user.id)
			res.json({ data: user })
		} catch (error) {
			next(error)
		}
	},

	// ─── Stubs para rutas pendientes ──────────────────────────────────────────
	async register(_req: Request, res: Response) {
		res.status(501).json({ status: 'error', message: 'Not implemented' })
	},

	async verifyEmail(_req: Request, res: Response) {
		res.status(501).json({ status: 'error', message: 'Not implemented' })
	},

	async resendVerification(_req: Request, res: Response) {
		res.status(501).json({ status: 'error', message: 'Not implemented' })
	},

	async requestPasswordReset(_req: Request, res: Response) {
		res.status(501).json({ status: 'error', message: 'Not implemented' })
	},

	async confirmPasswordReset(_req: Request, res: Response) {
		res.status(501).json({ status: 'error', message: 'Not implemented' })
	},

	async changePassword(_req: Request, res: Response) {
		res.status(501).json({ status: 'error', message: 'Not implemented' })
	},

	async sessions(_req: Request, res: Response) {
		res.status(501).json({ status: 'error', message: 'Not implemented' })
	},

	async revokeSession(_req: Request, res: Response) {
		res.status(501).json({ status: 'error', message: 'Not implemented' })
	}
}
