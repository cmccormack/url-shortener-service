const express = require('express')

const app = express()
const port = process.env.PORT || 3000

// Cross-Origin Header Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
})

app.get('/', (req, res, next) => {
  // To-Do
})

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.message)
  console.error(err.stack)
  res.status(500)
  res.send(`Error: ${err.message}`)
})

// All Middleware functions and routes exhausted, respond with 404
app.use(function (req, res, next) {
  res.status(404).send("404 Page Not Found")
})

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}.`)
})