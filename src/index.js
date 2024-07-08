
import express from 'express'
import dotenv from 'dotenv'

// Load the environment variables
dotenv.config()

const port = 3010
const hostname = '0.0.0.0'

// Get API key from env vars
const apiKey = process.env.OMDB_API_KEY

const baseUrl = 'http://www.omdbapi.com/'
const apiUrl = `${baseUrl}?apikey=${apiKey}`
const searchUrl = `${apiUrl}&s=`

const app = express()

app.get('/media', async (req, res) => {
  const search = req.query.s
  // // Create the url to make the request to
  const body = await fetch(searchUrl + search).then(res => res.json())
  const titles = body.Search.map((el) => {
    return `${el.Title} (${el.Year})`
  })
  res.json(titles) // By default, express sends the 200 status code
})

app.get('/', async (req, res) => {
  res.json({ message: 'Hello World' }) // By default, express sends the 200 status code
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})