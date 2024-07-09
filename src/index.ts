import process from 'node:process'

import Fastify from 'fastify'
import dotenv from 'dotenv'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import type {
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

import omdbRoutes from './routes/omdb.js'

// Load the environment variables
dotenv.config()

const port = 3010
const host = '0.0.0.0'

const app = Fastify({
  logger: true,
})
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler)
  .withTypeProvider<ZodTypeProvider>()

app.register(omdbRoutes, { prefix: '/omdb' })

const swaggerDocsPrefix = '/api-docs'
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API My Movies',
      description: 'Description of the My Movies\' API',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
  // You can also create transform with custom skiplist of endpoints
  // that should not be included in the specification:
  //
  // transform: createJsonSchemaTransform({
  //   skipList: [ '/documentation/static/*' ]
  // })
})

app.register(fastifySwaggerUI, {
  routePrefix: swaggerDocsPrefix,
})

try {
  await app.ready()
  await app.listen({ port, host })
  app.log.info(`Documentation running at http://${host}:${port}${swaggerDocsPrefix}`)
}
catch (err) {
  app.log.error(err)
  process.exit(1)
}
