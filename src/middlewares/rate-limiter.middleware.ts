import rateLimit from 'express-rate-limit'

export const limiterConfig = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	limit: 100, // Máximo 100 peticiones por ventana
	message: 'Demasiadas peticiones desde esta IP, intente más tarde.'
})

export const authRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	limit: 1000, // Máximo 5 peticiones por ventana para rutas de autenticación
	message: 'Demasiados intentos de autenticación, intente más tarde.'
})
