import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BOOK_KEY = 'bookDB'
_defaultBooks()

export const bookService = {
    query,
    get,
    remove,
    save,
    getEmptyBook,
    getDefaultFilter,
    getCategories
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

function getEmptyBook(title = '', authors=[''], publishedDate=0, description='', pageCount=0, categories=[''], thumbnail='', language='', listPrice={ amount: 0, currencyCode: 'USD', isOnSale: false }) {
    return { title, authors, publishedDate, description, pageCount, categories, thumbnail, language, listPrice }
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
            thumbnail: `http://www.coding-academy.org/books-photos/${(i%3)+1}.jpg`,
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