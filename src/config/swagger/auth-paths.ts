export const authPaths = {
	'/api/auth/register': {
		post: {
			tags: ['Auth'],
			summary: 'Register a new user',
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/RegisterRequest' }
					}
				}
			},
			responses: {
				'201': { description: 'User created' },
				'400': {
					description: 'Validation error',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Error' }
						}
					}
				}
			}
		}
	},
	'/api/auth/login': {
		post: {
			tags: ['Auth'],
			summary: 'Login with email and password',
			description: 'Returns access token in Authorization header and refresh token in httpOnly cookie',
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/LoginRequest' }
					}
				}
			},
			responses: {
				'204': {
					description: 'Login successful',
					headers: {
						Authorization: {
							schema: { type: 'string', description: 'Bearer access token' }
						},
						'Set-Cookie': {
							schema: { type: 'string', description: 'refresh_token httpOnly cookie' }
						}
					}
				},
				'400': { description: 'Validation error' },
				'401': { description: 'Invalid credentials' }
			}
		}
	},
	'/api/auth/refresh': {
		post: {
			tags: ['Auth'],
			summary: 'Refresh access token',
			description: 'Rotates refresh token and returns new access token',
			responses: {
				'204': {
					description: 'Token refreshed',
					headers: {
						Authorization: {
							schema: { type: 'string' }
						}
					}
				},
				'401': { description: 'Invalid or expired refresh token' }
			}
		}
	},
	'/api/auth/logout': {
		post: {
			tags: ['Auth'],
			summary: 'Logout current session',
			security: [{ bearerAuth: [] }],
			responses: {
				'200': { description: 'Session closed' },
				'401': { description: 'Not authenticated' }
			}
		}
	},
	'/api/auth/logout-all': {
		post: {
			tags: ['Auth'],
			summary: 'Logout all sessions',
			security: [{ bearerAuth: [] }],
			responses: {
				'200': { description: 'All sessions closed' },
				'401': { description: 'Not authenticated' }
			}
		}
	},
	'/api/auth/verify-email': {
		post: {
			tags: ['Auth'],
			summary: 'Verify email with token',
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								token: { type: 'string' }
							},
							required: ['token']
						}
					}
				}
			},
			responses: {
				'200': { description: 'Email verified' },
				'400': { description: 'Invalid token' }
			}
		}
	},
	'/api/auth/verify-email/resend': {
		post: {
			tags: ['Auth'],
			summary: 'Resend verification email',
			security: [{ bearerAuth: [] }],
			responses: {
				'200': { description: 'Verification email sent' },
				'401': { description: 'Not authenticated' }
			}
		}
	},
	'/api/auth/password-reset': {
		post: {
			tags: ['Auth'],
			summary: 'Request password reset',
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/RequestPasswordResetRequest' }
					}
				}
			},
			responses: {
				'200': { description: 'Reset email sent' },
				'400': { description: 'Validation error' }
			}
		}
	},
	'/api/auth/password-reset/confirm': {
		post: {
			tags: ['Auth'],
			summary: 'Confirm password reset with token',
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/ConfirmPasswordResetRequest' }
					}
				}
			},
			responses: {
				'200': { description: 'Password updated' },
				'400': { description: 'Invalid or expired token' }
			}
		}
	},
	'/api/auth/me': {
		get: {
			tags: ['Auth'],
			summary: 'Get current user',
			security: [{ bearerAuth: [] }],
			responses: {
				'200': {
					description: 'User data',
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									data: { $ref: '#/components/schemas/User' }
								}
							}
						}
					}
				},
				'401': { description: 'Not authenticated' }
			}
		}
	},
	'/api/auth/me/password': {
		patch: {
			tags: ['Auth'],
			summary: 'Change password',
			security: [{ bearerAuth: [] }],
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/ChangePasswordRequest' }
					}
				}
			},
			responses: {
				'200': { description: 'Password changed' },
				'400': { description: 'Validation error' },
				'401': { description: 'Not authenticated' }
			}
		}
	},
	'/api/auth/sessions': {
		get: {
			tags: ['Auth'],
			summary: 'List active sessions',
			security: [{ bearerAuth: [] }],
			responses: {
				'200': { description: 'List of sessions' },
				'401': { description: 'Not authenticated' }
			}
		}
	},
	'/api/auth/sessions/{id}': {
		delete: {
			tags: ['Auth'],
			summary: 'Revoke a session',
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					in: 'path',
					name: 'id',
					required: true,
					schema: { type: 'integer' }
				}
			],
			responses: {
				'200': { description: 'Session revoked' },
				'401': { description: 'Not authenticated' }
			}
		}
	}
}
