const app = require('../src/app')
const store = require('../src/store')

describe(`Unauthorized requests`, () => {
  it(`responds with 401 Unauthorized for GET /bookmarks`, () => {
    return supertest(app)
      .get('/bookmarks')
      .expect(401, { error: 'Unauthorized request' })
  })

  describe('GET /bookmarks', () => {
    it('gets the bookmarks from the store', () => {
      return supertest(app)
        .get('/bookmarks')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, store.bookmarks)
    })

    it('adds a new bookmark to the store', () => {
      const bookmark = {
        title: 'test-title',
        url: 'https://test.com',
        desc: 'test description',
        rating: 1,
      }
      return supertest(app)
        .post(`/bookmarks`)
        .send(bookmark)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(bookmark.title)
          expect(res.body.url).to.eql(bookmark.url)
          expect(res.body.desc).to.eql(bookmark.desc)
          expect(res.body.rating).to.eql(bookmark.rating)
          expect(res.body.id).to.be.a('string')
        })
        .then(res => {
          expect(store.bookmarks[store.bookmarks.length - 1]).to.eql(res.body)
        })
    })
  })


  describe('DELETE /bookmarks/:id', () => {
    it('removes the bookmark by ID from the store', () => {
      const bookmark = store.bookmarks[1]
      const expectedBookmarks = store.bookmarks.filter(s => s.id !== bookmark.id)
      return supertest(app)
        .delete(`/bookmarks/${bookmark.id}`)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(204)
        .then(() => {
          expect(store.bookmarks).to.eql(expectedBookmarks)
        })

  })})

})

