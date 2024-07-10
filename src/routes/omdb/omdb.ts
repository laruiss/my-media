import process from 'node:process'
import { z } from 'zod'
import type { FastifyPluginAsync, FastifyPluginOptions, RawServerBase } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import type { Media, OmdbSearchResponse } from './omdb-schemas.js'
import { omdbMediaSchema } from './omdb-schemas.js'

// Get API key from env vars
const apiKey = process.env.OMDB_API_KEY

const baseUrl = 'http://www.omdbapi.com/'
const apiUrl = `${baseUrl}?apikey=${apiKey}`
const searchUrl = `${apiUrl}&s=`
const idUrl = `${apiUrl}&i=`

const omdbRoutes: FastifyPluginAsync<FastifyPluginOptions, RawServerBase, ZodTypeProvider> = async function omdbRoutes(app) {
  app.get('/media', {
    schema: {
      querystring: z.object({ s: z.string() }),
      response: {
        200: z.array(z.string()),
      },
    },
    handler: async (req, reply) => {
      const search = req.query.s
      // Create the url to make the request to
      const body = await fetch(searchUrl + search).then(res => res.json()) as OmdbSearchResponse
      const titles = body.Search.map((el) => {
        return `${el.Title} (${el.Year})`
      })
      reply.status(200)
      return titles // By default, fastify sends the 200 status code
    },
  })

  // http://localhost/media/123
  app.get('/media/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        200: omdbMediaSchema,
      },
    },
    handler: async (req) => {
      const id = req.params.id
      // Create the url to make the request to
      const body = await fetch(idUrl + id).then(res => res.json()) as Media

      return body // By default, fastify sends the 200 status code
    },
  })
}

export default omdbRoutes
