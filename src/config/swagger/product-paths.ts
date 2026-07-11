export const productPaths = {
	'/api/products': {
		get: {
			tags: ['Products'],
			summary: 'List all products',
			description: 'Retrieve a list of products with optional filters',
			parameters: [
				{ in: 'query', name: 'category', schema: { type: 'string' }, description: 'Filter by category' },
				{ in: 'query', name: 'minPrice', schema: { type: 'number', minimum: 0 }, description: 'Minimum price' },
				{ in: 'query', name: 'maxPrice', schema: { type: 'number', minimum: 0 }, description: 'Maximum price' },
				{ in: 'query', name: 'minRating', schema: { type: 'number', minimum: 0, maximum: 5 }, description: 'Minimum rating' }
			],
			responses: {
				'200': {
					description: 'List of products',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: { $ref: '#/components/schemas/Product' }
							}
						}
					}
				}
			}
		},
		post: {
			tags: ['Products'],
			summary: 'Create a new product',
			requestBody: {
				required: true,
				content: {
					'application/json': {
						schema: { $ref: '#/components/schemas/CreateProduct' }
					}
				}
			},
			responses: {
				'201': {
					description: 'Product created',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Product' }
						}
					}
				},
				'400': {
					description: 'Validation error',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Error' }
						}
					}
				}
			}
		}
	},
	'/api/products/{id}': {
		get: {
			tags: ['Products'],
			summary: 'Get a product by ID',
			parameters: [
				{ in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } }
			],
			responses: {
				'200': {
					description: 'Product found',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Product' }
						}
					}
				},
				'404': { description: 'Product not found' }
			}
		}
	}
}
