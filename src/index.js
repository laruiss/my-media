
import Fastify from 'fastify'
import dotenv from 'dotenv'

// Load the environment variables
dotenv.config()

const port = 3010
const host = '0.0.0.0'

// Get API key from env vars
const apiKey = process.env.OMDB_API_KEY

const baseUrl = 'http://www.omdbapi.com/'
const apiUrl = `${baseUrl}?apikey=${apiKey}`
const searchUrl = `${apiUrl}&s=`

const app = Fastify({
  logger: true
})

app.get('/media', async (req, reply) => {
  const search = req.query.s
  // Create the url to make the request to
  const body = await fetch(searchUrl + search).then(res => res.json())
  const titles = body.Search.map((el) => {
    return `${el.Title} (${el.Year})`
  })
  reply.status(200)
  return titles // By default, fastify sends the 200 status code
})

app.get('/', async (req, res) => {
  res.json({ message: 'Hello World' })
})

try {
  await app.listen({ port, host })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
