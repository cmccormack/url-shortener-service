require('dotenv').config()
const [dbuser, dbpassword, dburi] = [
  process.env.MONGO_USER,
  process.env.MONGO_PW,
  process.env.MONGO_PATH
]

const express = require('express')
const mongo = require('mongodb').MongoClient
const cons = require('consolidate')
const base54 = require('./base54')

const app = express()
const port = process.env.PORT || 3000
const mongo_uri = `mongodb://${dbuser}:${dbpassword}@${dburi}`

app.engine('html', cons.nunjucks)
app.set('view engine', 'html')
app.set('views', __dirname + '/views')

mongo.connect(mongo_uri, (err, db) => {

  if (err) next(err)
  console.log("Successfully connected to MongoDB.");

  // Cross-Origin Header Middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
  })
  app.get(['/', '/new'], (req, res, next) => {
    res.status(200).render('examples', {
      title: 'URL Shortener',
      url: 'https://shortyurl.glitch.me/new/',
      exampleinput: [
        'https://shortyurl.glitch.me/new/https://www.google.com',
      ],
      exampleoutput: [
        JSON.stringify({
          original_url: "https://www.google.com",
          short_url: "https://shortyurl.herokuapp.com/8170"
        })
      ]
    })
  })

  app.get('/new/:href(*)', (req, res, next) => {
    res.send(req.params.href)
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

})