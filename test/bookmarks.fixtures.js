function makeBookmarksArray() {
    return [
        {
            id: 1,
            title: 'First test!',
            url_: 'http://foogle.com',
            desc_: 'How-to-test1',
            rating: 2
           },
           {
            id: 2,
            title: 'Second test!',
            url_: 'http://soogle.com',
            desc_: 'How-to-test2',
            rating: 3
           },
           {
            id: 3,
            title: 'Third test!',
            url_: 'http://toogle.com',
            desc_: 'How-to-test3',
            rating: 4          },
           {
            id: 4,
            title: 'Fourth test!',
            url_: 'http://qoogle.com',
            desc_: 'How-to-test4',
            rating: 5
           }
    ];
  }
  
  module.exports = {
    makeBookmarksArray,
  }