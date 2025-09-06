import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BOOK_KEY = 'bookDB'
const REVIEW_KEY = 'reviewDB'
_defaultBooks()

export const bookService = {
    query,
    get,
    remove,
    save,
    getEmptyBook,
    getDefaultFilter,
    getDefaultFilterFromSearchParams,
    getCategories,
    getLanguages,
    google: {
        get:googleGet,
        save:googleSave
    },
    reviews:{
      get: getReview,
      remove: removeReview,
      save: saveReview,
      getEmptyReview
    }

}

// For Debug (easy access from console):
// window.bs = bookService

function query(filterBy = {}) {
    return storageService.query(BOOK_KEY)
        .then(books => {
            return books.filter(book => {
                if(filterBy.title && book.title && !book.title.toLowerCase().includes(filterBy.title.toLowerCase())) return false 
                if(filterBy.title && book.subtitle && !book.subtitle.toLowerCase().includes(filterBy.title.toLowerCase())) return false
                if(filterBy.authors && book.authors && !book.authors.some(author => author.toLowerCase().includes(filterBy.authors.toLowerCase()))) return false
                if(filterBy.publishedDate && book.publishedDate !== filterBy.publishedDate) return false
                if(filterBy.minPageCount && book.pageCount < filterBy.minPageCount) return false
                if(filterBy.maxPageCount && book.pageCount > filterBy.maxPageCount) return false
                if(filterBy.language && book.language !== filterBy.language) return false
                if(filterBy.isOnSale && !book.listPrice.isOnSale) return false
                if(filterBy.minPrice && book.listPrice.amount < filterBy.minPrice) return false
                if(filterBy.maxPrice && book.listPrice.amount > filterBy.maxPrice) return false
                if(filterBy.categories && filterBy.categories.length && !filterBy.categories.every(ctg => book.categories.includes(ctg))) return false
                
                return true
            })
        }).catch(err => {
            console.error('Error querying books:', err);
            return undefined
        });
}

function get(bookId) {
    return storageService.query(BOOK_KEY).then(books => {
        const idx = books.findIndex(book => book.id === bookId)
        if (idx === -1) return Promise.reject('Book not found')
        const ansBook = { ...books[idx] }
        ansBook.next = books[idx + 1] ? books[idx + 1].id : books[0].id
        ansBook.prev = books[idx - 1] ? books[idx - 1].id : books[books.length - 1].id
        return Promise.resolve(ansBook)
    })
}

function remove(bookId) {
    return storageService.remove(BOOK_KEY, bookId)
}

function save(book) {
    if (book.id) {
        return storageService.put(BOOK_KEY, book)
    } else {
        return storageService.post(BOOK_KEY, book)
    }
}

function getEmptyBook({title = '', authors=[], publishedDate=0, description='', pageCount=0, categories=[], thumbnail='', language='', listPrice={ amount: 0, currencyCode: 'USD', isOnSale: false }}) {
    const _thumbnail = thumbnail? thumbnail: `http://www.coding-academy.org/books-photos/${utilService.getRandomIntInclusive(1,20)}.jpg`
    return { title, authors, publishedDate, description, pageCount, categories, thumbnail: _thumbnail, language, listPrice }
}

function getDefaultFilter(filterBy = { title: '', authors: '', publishedDate: 0, minPageCount: 0, maxPageCount: Infinity, language: '', isOnSale: false, minPrice: 0, maxPrice: Infinity }) {
    const books = utilService.loadFromStorage(BOOK_KEY)
    if (books && books.length) {
        filterBy.minPageCount = Math.min(...books.map(book => book.pageCount))
        filterBy.maxPageCount = Math.max(...books.map(book => book.pageCount))
        filterBy.minPrice = Math.min(...books.map(book => book.listPrice.amount))
        filterBy.maxPrice = Math.max(...books.map(book => book.listPrice.amount))
    }
    return { title: filterBy.title, authors: filterBy.authors, publishedDate: filterBy.publishedDate, minPageCount: filterBy.minPageCount, maxPageCount: filterBy.maxPageCount, language: filterBy.language, isOnSale: filterBy.isOnSale, minPrice: filterBy.minPrice, maxPrice: filterBy.maxPrice }
}

function getDefaultFilterFromSearchParams(searchParams){
    const defualtFilter = getDefaultFilter()
    const filterBy={}
    for (const field in defualtFilter){
        filterBy[field] = searchParams.get(field) || defualtFilter[field]
    }

    return filterBy
}

function _defaultBooks() {
    let books = utilService.loadFromStorage(BOOK_KEY)
    if (books && books.length) return
    utilService.saveToStorage(BOOK_KEY, _createBooks())
}

function _createBooks() {
    const ctgs = ['Love', 'Fiction', 'Poetry', 'Computers', 'Religion']
    const books = []
    for (let i = 0; i < 20; i++) {
        const book = {
            id: utilService.makeId(),
            title: utilService.makeLorem(2),
            subtitle: utilService.makeLorem(4),
            authors: [
                utilService.makeLorem(1)
            ],
            publishedDate: utilService.getRandomIntInclusive(1950, 2025),
            description: utilService.makeLorem(20),
            pageCount: utilService.getRandomIntInclusive(20, 600),
            categories: [ctgs[utilService.getRandomIntInclusive(0, ctgs.length - 1)]],
            thumbnail: `http://www.coding-academy.org/books-photos/${i+1}.jpg`,
            language: "en",
            listPrice: {
                amount: utilService.getRandomIntInclusive(80, 500),
                currencyCode: "EUR",
                isOnSale: Math.random() > 0.7
            }
        }
        books.push(book)
    }
    //console.log('books', books)
    return books
}

function getCategories() {
    return ['Love', 'Fiction', 'Poetry', 'Computers', 'Religion'];
}

function getLanguages(){
    return [
        {name: 'English', code: 'en'},
        {name: 'Spanish', code: 'es'},
        {name: 'French', code: 'fr'},
        {name: 'German',code: 'de'},
        {name: 'Italian',code: 'it'},
        {name: 'Portuguese',code: 'pt'},
        {name: 'Russian',code: 'ru'},
        {name: 'Chinese',code: 'zh'},
        {name: 'Japanese',code: 'ja'},
        {name: 'Korean',code: 'ko'},
        {name: 'Arabic',code: 'ar'},
        {name: 'Hindi',code: 'hi'},
        {name: 'Turkish',code: 'tr'},
        {name: 'Dutch',code: 'nl'},
        {name: 'Greek',code: 'el'},
        {name: 'Swedish',code: 'sv'},
        {name: 'Polish',code: 'pl'},
        {name: 'Hebrew',code: 'he'},
        {name: 'Thai',code: 'th'},
        {name: 'Vietnamese',code: 'vi'}
    ]
}

function googleSave(books){
  const db= utilService.loadFromStorage(BOOK_KEY)
  console.log(books)
  return Promise.all(books.map(book=>{
    const translate=_translateBook(book)
    const idx = db.findIndex(bookdb=>bookdb.googleid && bookdb.googleid===translate.googleid )
    if (idx>=0) return db[idx]
    return save(translate)
  }))
}

function _translateBook(googleBook){
  const newbook = getEmptyBook({...googleBook.volumeInfo,thumbnail:googleBook.volumeInfo.imageLinks.thumbnail})
  return {...newbook,googleid:googleBook.id}
}

function googleGet(bookTitle){
   return new Promise((resolve,reject)=>{
    const xhr=new XMLHttpRequest()

    xhr.onreadystatechange= ()=>{
      if (xhr.readyState==XMLHttpRequest.DONE){
        xhr.status===200 ? resolve(JSON.parse(xhr.responseText).items) : reject()
      }
    }
    xhr.open('GET', `https://www.googleapis.com/books/v1/volumes?printType=books&q=${bookTitle}` ,true)
    xhr.send()
  })
}

function saveReview(bookid,review){
  if (review.id) {
      return storageService.put(REVIEW_KEY+bookid, review)
  } else {
      return storageService.post(REVIEW_KEY+bookid, review)
  }
}

function getReview(bookId){
  return storageService.query(REVIEW_KEY+bookId)
}

function getEmptyReview(){
  let currentDate = new Date();
  const maxdate= `${currentDate.getFullYear()}-${(''+(currentDate.getMonth()+1)).padStart(2,'0')}`
  return {name:'',raiting:0,readAt:maxdate}
}

function removeReview(bookId,reviewId) {
    return storageService.remove(REVIEW_KEY+bookId,reviewId)
}