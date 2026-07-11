export const authSchemas = {
	LoginRequest: {
		type: 'object',
		properties: {
			email: { type: 'string', format: 'email', example: 'admin@admin.com' },
			password: { type: 'string', example: 'password123' }
		},
		required: ['email', 'password']
	},
	RegisterRequest: {
		type: 'object',
		properties: {
			email: { type: 'string', format: 'email' },
			password: { type: 'string', minLength: 8 },
			role: { type: 'string', enum: ['user', 'admin'], default: 'user' }
		},
		required: ['email', 'password']
	},
	AuthTokens: {
		type: 'object',
		properties: {
			accessToken: { type: 'string' },
			refreshToken: { type: 'string' },
			expiresAt: { type: 'string', format: 'date-time' }
		}
	},
	RequestPasswordResetRequest: {
		type: 'object',
		properties: {
			email: { type: 'string', format: 'email' }
		},
		required: ['email']
	},
	ConfirmPasswordResetRequest: {
		type: 'object',
		properties: {
			token: { type: 'string' },
			password: { type: 'string', minLength: 8 }
		},
		required: ['token', 'password']
	},
	ChangePasswordRequest: {
		type: 'object',
		properties: {
			currentPassword: { type: 'string' },
			newPassword: { type: 'string', minLength: 8 }
		},
		required: ['currentPassword', 'newPassword']
	},
	User: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			email: { type: 'string', format: 'email' },
			role: { type: 'string' },
			status: { type: 'string', enum: ['active', 'suspended', 'deleted'] },
			createdAt: { type: 'string', format: 'date-time' }
		}
	}
}
