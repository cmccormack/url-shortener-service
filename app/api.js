const crypto = require('crypto')
const validator = require('validator')
const base54 = require('./base54')

module.exports = (app, db, example, hostname) => {

  const urldb = db.collection('urlshortener')

  const createNewURL = (urldb, response, res) => {
    // Read current counter from db if counter not locked
    urldb.find({ '_id': 'counter' }).toArray((err, docs) => {

      if (err) return next(Error('Error accessing Database.  Please try again shortly.'))

      const counter = docs[0]

      // Check if another request is currently processing
      if (!counter.locked) {

        // Lock counter for current request
        urldb.update({ '_id': 'counter' }, { 'locked': true }, err => {
          if (err) return next(err)

          // Derive short_url from encoded counter value
          response.short_url = base54.encode(counter.value)

          // Update counter value for next request
          urldb.update({ '_id': 'counter' }, { 'locked': false, 'value': counter.value + 1000 })

          // Push response to DB
          urldb.insertOne(response)

          // Respond with shortened URL
          res.type('json').send(JSON.stringify({
            original_url: response.original_url,
            short_url: `${hostname}/${response.short_url}`
          }))
        })

      } else {
        return next(Error('Database currently locked.  Please try again shortly.'))
      }
    })
  }

  app.get(['/', '/new'], (req, res, next) => {
    res.status(200).render('examples', example)
  })

  app.get('/new/:href(*)', (req, res, next) => {

    const url = req.params.href
    const hash = crypto.createHash('sha256').update(url).digest('hex')
    

    const response = {
      _id: hash,
      original_url: url
    }

    // Exit early if URL is invalid
    if (!validator.isURL(url)){
      res.type('json').send(JSON.stringify({
        original_url: response.original_url,
        error: 'Invalid URL format.  Use format similar to http://www.example.com'
      }))
      return next(Error('Invalid URL Provided.'))
    } 

    // Check if entry is already in database
    urldb.find({_id: hash}, {_id: 0}).toArray((err, docs) => {
      if(docs.length !== 0) {
        console.log('URL already in database.')
        return res.send(docs[0])
      } else {
        createNewURL(urldb, response, res)
      }
    })
  })

  app.get('/:shorturl', (req, res, next) => {
    urldb.find({'short_url': req.params.shorturl}).toArray((err, docs) =>{
      if (docs.length === 0){
        res.render('examples', 
          {
            title: example.title,
            url: example.url,
            exampleinput: example.exampleinput,
            exampleoutput: example.exampleoutput,
            error: 'Invalid Short URL'}
        )
      } else {
        res.redirect(docs[0].original_url)
      }
    })
  })


}
