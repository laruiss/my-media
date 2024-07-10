import dotenv from 'dotenv'

dotenv.config()

export default {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  swaggerDocsPrefix: process.env.SWAGGER_DOCS_PREFIX || '/api-docs',
  apiKey: process.env.OMDB_API_KEY,
  
  omdbBaseUrl: 'http://www.omdbapi.com/',
  get apiUrl() {
    return `${this.omdbBaseUrl}?apikey=${this.apiKey}`
  },
  get idUrl() {
    return `${this.apiUrl}&i=`
  },
}
