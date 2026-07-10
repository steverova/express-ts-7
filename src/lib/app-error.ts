import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
	constructor(
		public override message: string,
		public status: number = StatusCodes.INTERNAL_SERVER_ERROR,
	) {
		super(message);
		this.name = "AppError";
	}
}
