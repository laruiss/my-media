// Get API key from env vars
const apiKey = process.env.OMDB_API_KEY
// Create the URL to send the GET request to
const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=love`

// Option 1
// Make the fetch request and store the body
const body = await fetch(url)
  .then(response => response.json())
  .catch(error => console.error(error))
// Get only the titles
const titles = body.Search
// Display the list of titles
console.log(titles)
