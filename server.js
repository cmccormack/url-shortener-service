require('dotenv').config()
const express = require('express')
const mongo = require('mongodb').MongoClient
const cons = require('consolidate')
const assert = require('assert')

const api = require('./app/api')

const app = express()
const port = process.env.PORT || 3000

app.engine('html', cons.nunjucks)
app.set('view engine', 'html')
app.set('views', __dirname + '/views')

const hostname = 'https://shortyurl.glitch.me'

const example = {
  title: 'URL Shortener',
  url: `${hostname}/new/`,
  exampleinput: [
    `${hostname}/new/https://www.google.com`,
  ],
  exampleoutput: [
    JSON.stringify({
      original_url: "https://www.google.com",
      short_url: `${hostname}/8170`
    })
  ],
  error: null
}

const options = {
  reset_counter: false,
  reset_collection: false
}


// Connect to MongoDB database
mongo.connect(process.env.MONGO_URI, (err, db) => {

  assert.equal(null, err)

  console.log("Successfully connected to MongoDB.")

  // Unlock counter in the event of a crash
  db.collection('urlshortener').update({ '_id': 'counter' }, { $set: { 'locked': false } })

  // Reset counter
  if (options.reset_counter)
    db.collection('urlshortener').update(
      { '_id': 'counter' },
      { $set: { 'value': 1000000 } }
    )

  // Delete all url entries from db
  if (options.reset_collection)
    db.collection('urlshortener').deleteMany(
      { 'short_url': {$exists: true}}
    )

  // Cross-Origin Header Middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
  })

  api(app, db, example, hostname)

  // Error Handler Middleware
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

})