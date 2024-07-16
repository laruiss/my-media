import { z } from 'zod'

import type { MyMediaPlugin } from '../../types/index.js'
import config from '../../config.js'

import type { Media, OmdbSearchResponse } from './omdb-schemas.js'
import { omdbMediaSchema } from './omdb-schemas.js'

const omdbRoutes: MyMediaPlugin = async function omdbRoutes (app) {
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
      const body = await fetch(config.omdbBaseUrl + search).then(res => res.json()) as OmdbSearchResponse
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
      const body = await fetch(config.omdbIdUrl + id).then(res => res.json()) as Media

      return body // By default, fastify sends the 200 status code
    },
  })
}

export default omdbRoutes
