export const errorSchema = {
	Error: {
		type: 'object',
		properties: {
			message: { type: 'string' },
			status: { type: 'integer' }
		}
	}
}
