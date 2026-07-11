import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '#lib/jwt'

export async function authenticate(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const header = req.headers.authorization

		if (!header?.startsWith('Bearer ')) {
			res.status(401).json({ status: 'error', message: 'Token no proporcionado' })
			return
		}

		const token = header.slice(7)
		const { payload } = await verifyAccessToken(token)

		req.user = {
			id: Number(payload.sub),
			role: payload.role as string,
		}

		next()
	} catch {
		res.status(401).json({ status: 'error', message: 'Token inválido o expirado' })
	}
}
