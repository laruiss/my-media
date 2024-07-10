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

import prismaPlugin from './plugins/prisma-plugin.js'
import omdbRoutes from './routes/omdb/omdb-routes.js'
import usersRoutes from './routes/users/users-routes.js'
import moviesRoutes from './routes/movies/movies-routes.js'
import labelsRoutes from './routes/labels/labels-routes.js'

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

app.register(prismaPlugin)
app.register(omdbRoutes, { prefix: '/omdb' })
app.register(usersRoutes, { prefix: '/users' })
app.register(moviesRoutes, { prefix: '/movies' })
app.register(labelsRoutes, { prefix: '/labels' })

try {
  await app.ready()
  await app.listen({ port, host })
  app.log.info(`Documentation running at http://${host}:${port}${swaggerDocsPrefix}`)
  process.on('SIGTERM', async () => { // Kill or kill -9
    app.log.info('SIGTERM signal has been received. Shutting down...')
    await app.close()
    process.exit(0)
  })
  process.on('SIGINT', async () => { // Kill or kill -9
    app.log.info('SIGINT signal has been received. Shutting down...')
    await app.close()
    process.exit(0)
  })
}
catch (err) {
  app.log.error(err)
  process.exit(1)
}
