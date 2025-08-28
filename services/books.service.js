import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BOOK_KEY = 'bookDB'
_createBooks()

export const bookService = {
    query,
    get,
    remove,
    save,
    getEmptyBook,
    getDefaultFilter,
}

// For Debug (easy access from console):
// window.bs = bookService

function query(filterBy = {}) {
    return storageService.query(BOOK_KEY)
        .then(books => {
            return books.filter(book => {
                if(filterBy.title && !book.title.toLowerCase().includes(filterBy.title.toLowerCase()) && !book.subtitle.toLowerCase().includes(filterBy.title.toLowerCase())) return false
                if(filterBy.authors && !book.authors.some(author => author.toLowerCase().includes(filterBy.authors.toLowerCase()))) return false
                if(filterBy.publishedDate && book.publishedDate !== filterBy.publishedDate) return false
                if(filterBy.minPageCount && book.pageCount < filterBy.minPageCount) return false
                if(filterBy.maxPageCount && book.pageCount > filterBy.maxPageCount) return false
                if(filterBy.language && book.language !== filterBy.language) return false
                if(filterBy.isOnSale && !book.listPrice.isOnSale) return false
                if(filterBy.minPrice && book.listPrice.amount < filterBy.minPrice) return false
                if(filterBy.maxPrice && book.listPrice.amount > filterBy.maxPrice) return false
                
                return true
            })
        })
}

function get(bookId) {
    return storageService.get(BOOK_KEY, bookId)
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

function getEmptyBook(title = '', price = 0) {
    return { title, price }
}

function getDefaultFilter(filterBy = { title: '', authors: '', publishedDate: '', minPageCount: 0, maxPageCount: Infinity, language: '', isOnSale: false, minPrice: 0, maxPrice: Infinity }) {
    return { title: filterBy.title, authors: filterBy.authors, publishedDate: filterBy.publishedDate, minPageCount: filterBy.minPageCount, maxPageCount: filterBy.maxPageCount, language: filterBy.language, isOnSale: filterBy.isOnSale, minPrice: filterBy.minPrice, maxPrice: filterBy.maxPrice }
}

function _createBooks() {
    for (const book of defaultbooks) {
        storageService.post(BOOK_KEY, book)
    }
}

const defaultbooks = [
    {
        "id": "OXeMG8wNskc",
        "title": "metus hendrerit",
        "subtitle": "mi est eros dapibus himenaeos",
        "authors": [ "Barbara Cartland" ],
        "publishedDate": 1999,
        "description": "placerat nisi sodales suscipit tellus",
        "pageCount": 713,
        "categories": [ "Computers", "Hack" ],
        "thumbnail": "http://ca.org/books-photos/20.jpg",
        "language": "en",
        "listPrice": {
            "amount": 109,
            "currencyCode": "EUR",
            "isOnSale": false
        }
    },
    {
        "id": "JYOJa2NpSCq",
        "title": "morbi",
        "subtitle": "lorem euismod dictumst inceptos mi",
        "authors": [ "Barbara Cartland" ],
        "publishedDate": 1978,
        "description": "aliquam pretium lorem laoreet etiam odio cubilia iaculis placerat",
        "pageCount": 129,
        "categories": [ "Computers", "Hack" ],
        "thumbnail": "http://ca.org/books-photos/14.jpg",
        "language": "sp",
        "listPrice": {
            "amount": 44,
            "currencyCode": "EUR",
            "isOnSale": true
        }
    },
    {
        "id": "1y0Oqts35DQ",
        "title": "at viverra venenatis",
        "subtitle": "gravida libero facilisis rhoncus",
        "authors": [ "Dr. Seuss" ],
        "publishedDate": 1999,
        "description": "lorem ipsum dolor sit amet consectetur adipiscing elit",
        "pageCount": 972,
        "categories": [ "Computers", "Hack" ],
        "thumbnail": "http://ca.org/books-photos/2.jpg",
        "language": "he",
        "listPrice": {
            "amount": 185,
            "currencyCode": "EUR",
            "isOnSale": false
        }
    },
    {
        "id": "kGh6z6gqX4c",
        "title": "dictum",
        "subtitle": "augue eu consectetur class curabitur conubia",
        "authors": [ "Dr. Seuss" ],
        "publishedDate": 2011,
        "description": "aliquam pretium lorem laoreet etiam odio cubilia iaculis placerat",
        "pageCount": 972,
        "categories": [ "Computers", "Hack" ],
        "thumbnail": "http://ca.org/books-photos/12.jpg",
        "language": "he",
        "listPrice": {
            "amount": 185,
            "currencyCode": "EUR",
            "isOnSale": false
        }
    },
    {
        "id": "8J0I1d8mqc",
        "title": "augue eu",
        "subtitle": "class curabitur conubia",
        "authors": [ "Dr. Seuss" ],
        "publishedDate": 2011,
        "description": "aliquam pretium lorem laoreet etiam odio cubilia iaculis placerat",
        "pageCount": 972,
        "categories": [ "Computers", "Hack" ],
        "thumbnail": "http://ca.org/books-photos/12.jpg",
        "language": "he",
        "listPrice": {
            "amount": 185,
            "currencyCode": "EUR",
            "isOnSale": false
        }
    },
    {
        "id": "Q8Q9Lsd03BD",
        "title": "lorem ipsum",
        "subtitle": "dolor sit amet",
        "authors": [ "Jane Doe" ],
        "publishedDate": 2020,
        "description": "a classic book on lorem ipsum",
        "pageCount": 300,
        "categories": [ "Fiction", "Classics" ],
        "thumbnail": "http://ca.org/books-photos/15.jpg",
        "language": "en",
        "listPrice": {
            "amount": 50,
            "currencyCode": "EUR",
            "isOnSale": true
        }
    }
]
