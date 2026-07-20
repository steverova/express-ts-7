import express, { type Request, type Response } from 'express'
import helmet from 'helmet'
import 'dotenv/config'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { env } from '#config/env'
import swaggerConfig from '#config/swagger'
import { corsConfig } from '#middlewares/cors-config'
import { errorHandler } from '#middlewares/error-handler'
import { notFoundHandler } from '#middlewares/not-found'
import { router } from './router/index'

const app = express()

app.use(helmet())
app.use(corsConfig)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(cookieParser())
app.use(morgan('dev'))

const swaggerSpec = swaggerJsdoc(swaggerConfig)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/', (_: Request, res: Response) => {
	res.send('Hello World FROM EXPRESS ZZZZZ!')
	console.log('Response sent')
})

app.use('/api', router)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(env.PORT, () => {
	console.log(`App running on http://localhost:${env.PORT} 🚀`)
	console.log(`Api docs http://localhost:${env.PORT}/docs `)
})
