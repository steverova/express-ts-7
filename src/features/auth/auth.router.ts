import { Router } from 'express'
import { authenticate } from '#middlewares/authenticate'
import { authController } from './auth.controller'

export const authRouter: Router = Router()

// ─── Registro / Login
authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)

// ─── Token rotation
authRouter.post('/refresh', authController.refresh)
authRouter.post('/logout', authenticate, authController.logout)
authRouter.post('/logout-all', authenticate, authController.logoutAll)

// ─── Verificación de email
authRouter.post('/verify-email', authController.verifyEmail)
authRouter.post(
	'/verify-email/resend',
	authenticate,
	authController.resendVerification
)

// ─── Recuperación de contraseña
authRouter.post('/password-reset', authController.requestPasswordReset)
authRouter.post('/password-reset/confirm', authController.confirmPasswordReset)

// ─── Sesión / usuario actual
authRouter.get('/me', authenticate, authController.me)
authRouter.patch('/me/password', authenticate, authController.changePassword)

// ─── Dispositivos / sesiones activas
authRouter.get('/sessions', authenticate, authController.sessions)
authRouter.delete('/sessions/:id', authenticate, authController.revokeSession)
