import process from 'node:process'

import Fastify from 'fastify'
import dotenv from 'dotenv'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import type {
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import omdbRoutes from './routes/omdb.js'

// Load the environment variables
dotenv.config()

const port = 3000
const host = '0.0.0.0'
const swaggerDocsPrefix = '/api-docs'

const app = Fastify({
  logger: true,
})
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler)
  .withTypeProvider<ZodTypeProvider>()

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API My Movies',
      description: 'Description of the My Movies API',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: swaggerDocsPrefix,
})

app.register(omdbRoutes, { prefix: '/omdb' })

try {
  await app.ready()
  await app.listen({ port, host })
  app.log.info(`Documentation running at http://${host}:${port}${swaggerDocsPrefix}`)
}
catch (err) {
  app.log.error(err)
  process.exit(1)
}
