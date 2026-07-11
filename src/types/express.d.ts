declare global {
	namespace Express {
		interface Request {
			user?: {
				id: number
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
