const express = require('express')
const bookmarkRouter = express.Router()
const bodyParser = express.json()
const { v4: uuidv4 } = require('uuid')
const { isWebUri } = require('valid-url')
const logger = require('./logger')
const { bookmarks } = require('./store')


bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res
    .json(bookmarks);
  
})

  .post(bodyParser, (req, res) => {
    const {title, url, desc, rating = [] } = req.body;

  if (!title) {
    logger.error(`Title is required`);
    return res
      .status(400)
      .send('Invalid data');
  }

  if (!url) {
    logger.error(`url is required`);
    return res
      .status(400)
      .send('Invalid data');
  }

  if (!isWebUri(url)) {
    logger.error(`Invalid url '${url}' supplied`)
    return res.status(400).send(`'url' must be a valid URL`)
  }


  if (!rating) {
    logger.error(`Rating is required`);
    return res
      .status(400)
      .send('Invalid data');
  }

  if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
    logger.error(`Invalid rating '${rating}' supplied`)
    return res.status(400).send(`'rating' must be a number between 0 and 5`)
  }

  const id = uuidv4();

  const bookmark = {
    id,
    title,
    url,
    desc,
    rating
  };

bookmarks.push(bookmark);

logger.info(`Bookmark with id ${id} created`);

res
  .status(201)
  .location(`http://localhost:8000/card/${id}`)
  .json(bookmark);

  })

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id);
  
    // make sure we found a bookmark
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
  
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bmIndex = bookmarks.findIndex(b => b.id == id);

    if (bmIndex === -1) {
        logger.error(`Bookmark with id ${id} not found.`);
        return res
        .status(404)
        .send('Not Found');
    }

    bookmarks.splice(bmIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.`);
    res
        .status(204)
        .end();
 })

module.exports = bookmarkRouter


  