import { Router } from 'express'
import { productsRouter } from '#features/products-placeholder/index'
import { authRouter } from '#features/auth/auth.router'

export const router: Router = Router()

router.use('/auth', authRouter)
router.use('/products', productsRouter)
