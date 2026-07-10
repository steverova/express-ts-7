import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "#lib/app-error";

export function requireRole(...roles: string[]) {
	return (req: Request, __: Response, next: NextFunction) => {
		if (!req.user)
			return next(new AppError("UNAUTHORIZED", StatusCodes.UNAUTHORIZED));

		if (!req.user.role || !roles.includes(req.user.role))
			return next(new AppError("FORBIDDEN", StatusCodes.FORBIDDEN));

		next();
	};
}
