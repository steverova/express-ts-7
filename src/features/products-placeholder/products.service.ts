import { StatusCodes } from 'http-status-codes'
import { AppError } from '#lib/app-error'
import { productsRepository } from './products.repository'
import type {
	CreateProductBody,
	ProductParam,
	ProductQuery
} from './products.schema'

export const productsService = {
	getAll(filters: ProductQuery) {
		const data = productsRepository.findAll(filters)
		return { data, total: data.length }
	},

	getById(params: ProductParam) {
		const product = productsRepository.findById(params)
		if (!product) {
			throw new AppError(
				`Product ${params.id} not found`,
				StatusCodes.NOT_FOUND
			)
		}
		return { data: product }
	},

	create(body: CreateProductBody) {
		const product = productsRepository.create(body)
		return { data: product }
	}
}
