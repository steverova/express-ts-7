import type { NextFunction, Request, Response } from 'express'
import { AppError } from '#lib/app-error'

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
): void {
	if (err instanceof AppError) {
		res.status(err.status).json({
			status: 'error',
			message: err.message
		})
		return
	}

	console.error(err)

	res.status(500).json({
		status: 'error',
		message: 'Internal server error'
	})
}
