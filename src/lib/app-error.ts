import { StatusCodes } from 'http-status-codes'

export class AppError extends Error {
	status: number

	constructor(
		message: string,
		status: number = StatusCodes.INTERNAL_SERVER_ERROR
	) {
		super(message)
		this.name = 'AppError'
		this.status = status
	}
}
