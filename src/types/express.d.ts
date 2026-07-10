declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string
				role?: string
			}
			session?: {
				successToken: string
			}
			sessionChecked?: boolean
		}
	}
}

export {}
