import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodType } from 'zod'

export const validate = (schema: ZodType) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
				cookies: req.cookies,
			})

			return next()
		} catch (error) {
			if (error instanceof ZodError) {
				const validationErrors = error.issues.map((issue) => ({
					key: issue.path.join('.') || 'unknown',
					message: issue.message,
				}))

				return res.status(400).json(validationErrors)
			}

			return res
				.status(500)
				.json([{ key: 'server', message: 'Internal server error' }])
		}
	}
}
