export const productSchemas = {
	Product: {
		type: 'object',
		properties: {
			id: { type: 'integer', example: 1 },
			name: { type: 'string', example: 'Laptop Pro 15' },
			price: { type: 'number', example: 1299 },
			category: { type: 'string', example: 'electronics' },
			description: {
				type: 'string',
				example: 'High-performance laptop with 15-inch display'
			},
			stock: { type: 'integer', example: 12 },
			rating: { type: 'number', example: 4.7 }
		},
		required: ['name', 'price', 'category', 'description', 'stock', 'rating']
	},
	CreateProduct: {
		type: 'object',
		properties: {
			name: { type: 'string', minLength: 1, maxLength: 100 },
			price: { type: 'number', exclusiveMinimum: 0 },
			category: { type: 'string', minLength: 1 },
			description: { type: 'string', minLength: 1, maxLength: 500 },
			stock: { type: 'integer', minimum: 0 },
			rating: { type: 'number', minimum: 0, maximum: 5 }
		},
		required: ['name', 'price', 'category', 'description', 'stock', 'rating']
	}
}
