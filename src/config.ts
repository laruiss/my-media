import process from 'node:process'

import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.OMDB_API_KEY

const omdbBaseUrl = 'http://www.omdbapi.com/'
const apiUrl = `${omdbBaseUrl}?apikey=${apiKey}`
const omdbSearchUrl = `${apiUrl}&s=`
const omdbIdUrl = `${apiUrl}&i=`

const port = Number(process.env.PORT) || 3000
const host = process.env.HOST || '0.0.0.0'
const swaggerDocsPrefix = process.env.SWAGGER_DOCS_PREFIX || '/api-docs'

export default {
  // fastify instance
  port,
  host,
  apiKey,
  swaggerDocsPrefix,

  // OMOD data
  omdbBaseUrl,
  apiUrl,
  omdbSearchUrl,
  omdbIdUrl,
}
