import { Router } from 'express'
import { productsRouter } from '#features/products-placeholder/index'

export const router: Router = Router()

router.use('/products', productsRouter)
