import { Router } from 'express'
import { authenticate } from '#middlewares/authenticate'
import { validate } from '#middlewares/validate-zod'
import { authController } from './auth.controller'
import {
	changePasswordSchema,
	confirmPasswordResetSchema,
	loginSchema,
	refreshSchema,
	registerSchema,
	requestPasswordResetSchema,
	revokeSessionSchema,
	verifyEmailSchema
} from './auth.schema'

export const authRouter: Router = Router()

authRouter.post('/register', validate(registerSchema), authController.register)

authRouter.post('/login', validate(loginSchema), authController.login)

authRouter.post('/refresh', validate(refreshSchema), authController.refresh)

authRouter.post('/logout', authenticate, authController.logout)

authRouter.post('/logout-all', authenticate, authController.logoutAll)

authRouter.post(
	'/verify-email',
	validate(verifyEmailSchema),
	authController.verifyEmail
)

authRouter.post(
	'/verify-email/resend',
	authenticate,
	authController.resendVerification
)

authRouter.post(
	'/password-reset',
	validate(requestPasswordResetSchema),
	authController.requestPasswordReset
)

authRouter.post(
	'/password-reset/confirm',
	validate(confirmPasswordResetSchema),
	authController.confirmPasswordReset
)

authRouter.get('/me', authenticate, authController.me)

authRouter.patch(
	'/me/password',
	authenticate,
	validate(changePasswordSchema),
	authController.changePassword
)

authRouter.get('/sessions', authenticate, authController.sessions)

authRouter.delete(
	'/sessions/:id',
	authenticate,
	validate(revokeSessionSchema),
	authController.revokeSession
)
