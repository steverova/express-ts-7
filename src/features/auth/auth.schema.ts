import { z } from 'zod'

// ─── Login ───────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
	body: z.object({
		email: z.string().email('Email inválido'),
		password: z.string().min(1, 'Password requerido'),
	}),
})

// ─── Register ────────────────────────────────────────────────────────────────
export const registerSchema = z.object({
	body: z.object({
		email: z.string().email('Email inválido'),
		password: z
			.string()
			.min(8, 'Mínimo 8 caracteres')
			.regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
			.regex(/[0-9]/, 'Debe contener al menos un número'),
		role: z.enum(['user', 'admin']).optional().default('user'),
	}),
})

// ─── Refresh ─────────────────────────────────────────────────────────────────
export const refreshSchema = z.object({
	cookies: z.object({
		refresh_token: z.string().min(1, 'Refresh token requerido'),
	}),
})

// ─── Password reset ──────────────────────────────────────────────────────────
export const requestPasswordResetSchema = z.object({
	body: z.object({
		email: z.string().email('Email inválido'),
	}),
})

export const confirmPasswordResetSchema = z.object({
	body: z.object({
		token: z.string().min(1, 'Token requerido'),
		password: z
			.string()
			.min(8, 'Mínimo 8 caracteres')
			.regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
			.regex(/[0-9]/, 'Debe contener al menos un número'),
	}),
})

// ─── Change password (logueado) ──────────────────────────────────────────────
export const changePasswordSchema = z.object({
	body: z.object({
		currentPassword: z.string().min(1, 'Password actual requerido'),
		newPassword: z
			.string()
			.min(8, 'Mínimo 8 caracteres')
			.regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
			.regex(/[0-9]/, 'Debe contener al menos un número'),
	}),
})

// ─── Verify email ────────────────────────────────────────────────────────────
export const verifyEmailSchema = z.object({
	body: z.object({
		token: z.string().min(1, 'Token requerido'),
	}),
})

// ─── Revoke session ──────────────────────────────────────────────────────────
export const revokeSessionSchema = z.object({
	params: z.object({
		id: z.coerce.number().int().positive(),
	}),
})

// ─── Types ───────────────────────────────────────────────────────────────────
export type LoginBody = z.infer<typeof loginSchema>['body']
export type RegisterBody = z.infer<typeof registerSchema>['body']
export type RequestPasswordResetBody = z.infer<typeof requestPasswordResetSchema>['body']
export type ConfirmPasswordResetBody = z.infer<typeof confirmPasswordResetSchema>['body']
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>['body']
export type VerifyEmailBody = z.infer<typeof verifyEmailSchema>['body']
export type RevokeSessionParam = z.infer<typeof revokeSessionSchema>['params']
