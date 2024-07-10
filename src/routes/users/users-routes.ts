import { z } from 'zod'
import type {
  FastifyPluginAsync,
  FastifyPluginOptions,
  RawServerBase,
} from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { createUserSchema, userOutputSchema } from './users-schema.js'

type MyMediaPlugin = FastifyPluginAsync<FastifyPluginOptions, RawServerBase, ZodTypeProvider>

const usersRoutes: MyMediaPlugin = async function usersRoutes(app) {
  app.post('', {
    schema: {
      body: createUserSchema,
      response: {
        201: userOutputSchema
      }
    },
    handler: async (req, reply) => {
      const user = req.body
      const createdUser = await app.prisma.user.create({ data: user })
      reply.status(201)
      return createdUser
    }
  })

  app.get('', {
    schema: {
      response: {
        200: z.array(userOutputSchema)
      }
    },
    handler: async () => {
      const users = await app.prisma.user.findMany({})
      return users
    }
  })

  app.get('/:id', {
    schema: {
      params: z.object({ id: z.string()}),
      response: {
        200: userOutputSchema.nullable(),
      }
    },
    handler: async (req) => {
      const id = Number(req.params.id)
      const user = await app.prisma.user.findUnique({ where: { id }})
      return user
    }
  })

  app.patch('/:id', {
    schema: {
      params: z.object({id: z.string()}),
      body: createUserSchema.omit({ password: true }),
      response: {
        200: userOutputSchema.nullable(),
        404: z.object({
          status: z.number().min(400).max(499),
          message: z.string()
        })
      }
    },
    handler: async (req, reply) => {
      const id = +req.params.id
      const userToUpdate = await app.prisma.user.findUnique({ where: { id }})
      if (!userToUpdate) {
        reply.status(404)
        return {
          status: 404,
          message: 'No user with that id'
        }
      }
      const newUserData = req.body
      const updatedUser = await app.prisma.user.update({ where: { id }, data: newUserData })
      return updatedUser
    }
  })
}

export default usersRoutes