import { z } from 'zod'

export const productQuerySchema = z.object({
	query: z.object({
		category: z.string().optional(),
		minPrice: z.coerce.number().min(0).optional(),
		maxPrice: z.coerce.number().min(0).optional(),
		minRating: z.coerce.number().min(0).max(5).optional()
	})
})

export const productParamSchema = z.object({
	params: z.object({
		id: z.coerce.number().int().positive()
	})
})

export const createProductSchema = z.object({
	body: z.object({
		name: z.string().min(1).max(100),
		price: z.number().positive(),
		category: z.string().min(1),
		description: z.string().min(1).max(500),
		stock: z.number().int().min(0),
		rating: z.number().min(0).max(5)
	})
})

export type ProductQuery = z.infer<typeof productQuerySchema>['query']
export type ProductParam = z.infer<typeof productParamSchema>['params']
export type CreateProductBody = z.infer<typeof createProductSchema>['body']
