import type { Options } from 'swagger-jsdoc'
import { authSchemas } from './swagger/auth-schemas'
import { productSchemas } from './swagger/product-schemas'
import { errorSchema } from './swagger/error-schemas'
import { authPaths } from './swagger/auth-paths'
import { productPaths } from './swagger/product-paths'

const swaggerConfig: Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Express TS 7 API',
			version: '1.0.0',
			description: 'API documentation for Express TS 7'
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Development server'
			}
		],
		paths: {
			...authPaths,
			...productPaths
		},
		components: {
			schemas: {
				...authSchemas,
				...productSchemas,
				...errorSchema
			},
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				}
			}
		}
	},
	apis: []
}

export default swaggerConfig
