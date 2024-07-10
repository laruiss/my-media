import type {
  FastifyPluginAsync,
  FastifyPluginOptions,
  RawServerBase,
} from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export type MyMediaPlugin = FastifyPluginAsync<FastifyPluginOptions, RawServerBase, ZodTypeProvider>
