const crypto = require('crypto')
const validator = require('validator')
const base54 = require('./base54')

module.exports = (app, db) => {
  
  app.get('/new/:href(*)', (req, res, next) => {

    const url = req.params.href
    const hash = crypto.createHash('sha256').update(url).digest('hex')

    const response = {
      url,
      hash,
      isURL: validator.isURL(url)
    }

    // Read current counter from db if not locked

    // Lock counter temporarily

    // Use counter value to calculate shortened string

    // Push hash + shortened string + url to DB

    // Update counter and increment

    db.collection('urlshortener').find({'_id': 'counter'}).toArray((err, docs) => {
      console.log(docs)
    })


    res.send(JSON.stringify(response))
    
  })
}
