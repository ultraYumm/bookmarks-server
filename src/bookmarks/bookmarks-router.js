const express = require('express')
const xss = require('xss')
const BookmarksService = require('./bookmarks-service')

const bookmarksRouter = express.Router()
const jsonParser = express.json()

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url_: bookmark.url_,
  desc_: xss(bookmark.desc_),
  rating: bookmark.rating,
})

bookmarksRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, url_, desc_, rating } = req.body
    const newBookmark = { title, url_, desc_, rating }

    
    for (const [key, value] of Object.entries(newBookmark))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    if (req.body.rating>5) {
        return res.status(400).send({
            error: { message:"Rating must be between 1 and 5" }
        })}
    
    if (req.body.rating == 0 ) {
            return res.status(400).send({
                error: { message:"Rating must be between 1 and 5" }
            })}
        

    BookmarksService.insertBookmark(
      req.app.get('db'),
      newBookmark
    )
      .then(bookmark => {
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(serializeBookmark(bookmark))
      })
      .catch(next)
  })

bookmarksRouter
  .route('/:bookmark_id')
  .all((req, res, next) => {
        BookmarksService.getById(
           req.app.get('db'),
           req.params.bookmark_id
         )
           .then(bookmark => {
             if (!bookmark) {
               return res.status(404).json({
                 error: { message: `Bookmark doesn't exist` }
               })
             }
             res.bookmark = bookmark // save the bookmark for the next middleware
             next() // don't forget to call next so the next middleware happens!
           })
           .catch(next)
       })

  .get((req, res, next) => {
    res.json({
                id: res.bookmark.id,
                title: xss(res.bookmark.title), // sanitize title
                desc_: xss(res.bookmark.desc_), // sanitize desc_
                url_: res.bookmark.url_,
                rating: res.bookmark.rating,
              })

    
  })
  .delete((req, res, next) => {
    BookmarksService.deleteBookmark(
           req.app.get('db'),
           req.params.bookmark_id
         )
           .then(() => {
             res.status(204).end()
           })
           .catch(next)
  })

module.exports = bookmarksRouter