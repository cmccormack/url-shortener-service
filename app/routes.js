
module.exports = (app, db) => {

  const renderSuccess = (req, res, next) => {
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
  }
  
  app.get(['/', '/new'], renderSuccess)
  
}