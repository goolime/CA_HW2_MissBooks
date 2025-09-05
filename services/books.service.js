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
    getCategories,
    getLanguages,
    google: {
        get:googleGet,
        save:googleSave
    }
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

const templatedata={
  "kind": "books#volumes",
  "totalItems": 1000000,
  "items": [
    {
      "kind": "books#volume",
      "id": "yrW2IQAACAAJ",
      "etag": "1ch+TDlgGEI",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/yrW2IQAACAAJ",
      "volumeInfo": {
        "title": "Harry Potter and the Order of the Phoenix",
        "authors": [
          "J. K. Rowling"
        ],
        "publisher": "Bloomsbury Publishing",
        "publishedDate": "2003",
        "description": "Dumbledore lowered his hands and surveyed Harry through his half-moon glasses. 'It is time,' he said, 'for me to tell you what I should have told you five years ago, Harry. Please sit down. I am going to tell you everything.' Harry Potter is due to start his fifth year at Hogwarts School of Witchcraft and Wizardry. He is desperate to get back to school and find out why his friends Ron and Hermione have been so secretive all summer. However, what Harry is about to discover in his new year at Hogwarts will turn his whole world upside down . . . But before he even gets to school, Harry has an unexpected and frightening encounter with two Dementors, has to face a court hearing at the Ministry of Magic and has been escorted on a night-time broomstick ride to the secret headquarters of a mysterious group called 'The Order of the Phoenix'. And that is just the start A gripping and electrifying novel, full of suspense, secrets, and - of course - magic.",
        "industryIdentifiers": [
          {
            "type": "ISBN_10",
            "identifier": "0747569614"
          },
          {
            "type": "ISBN_13",
            "identifier": "9780747569619"
          }
        ],
        "readingModes": {
          "text": false,
          "image": false
        },
        "pageCount": 766,
        "printType": "BOOK",
        "categories": [
          "Children's audiobooks"
        ],
        "averageRating": 3,
        "ratingsCount": 2,
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": false,
        "contentVersion": "preview-1.0.0",
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=yrW2IQAACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=yrW2IQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.com/books?id=yrW2IQAACAAJ&dq=Harry+Potter+and&hl=&as_pt=BOOKS&cd=1&source=gbs_api",
        "infoLink": "http://books.google.com/books?id=yrW2IQAACAAJ&dq=Harry+Potter+and&hl=&as_pt=BOOKS&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/Harry_Potter_and_the_Order_of_the_Phoeni.html?hl=&id=yrW2IQAACAAJ"
      },
      "saleInfo": {
        "country": "IL",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "IL",
        "viewability": "NO_PAGES",
        "embeddable": false,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": false
        },
        "pdf": {
          "isAvailable": false
        },
        "webReaderLink": "http://play.google.com/books/reader?id=yrW2IQAACAAJ&hl=&as_pt=BOOKS&source=gbs_api",
        "accessViewStatus": "NONE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "The fifth in the fantastically successful Harry Potter series in a luxury gift format"
      }
    },
    {
      "kind": "books#volume",
      "id": "VS2WHBipkm4C",
      "etag": "4zp3/NL+ATc",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/VS2WHBipkm4C",
      "volumeInfo": {
        "title": "Harry Potter and Philosophy",
        "subtitle": "If Aristotle Ran Hogwarts",
        "authors": [
          "David Baggett",
          "Shawn Klein"
        ],
        "publisher": "Open Court Publishing Company",
        "publishedDate": "2004",
        "description": "Urging readers of the Harry Potter series to dig deeper than wizards, boggarts, and dementors, the authors of this unique guide collect the musings of seventeen philosophers on the series, who cover a wide range of Potter-related philosophical issues, including the difference between good and evil, the ethics of sorcery, and Aristotle's own school for wizards. Original.",
        "industryIdentifiers": [
          {
            "type": "ISBN_10",
            "identifier": "0812694554"
          },
          {
            "type": "ISBN_13",
            "identifier": "9780812694550"
          }
        ],
        "readingModes": {
          "text": false,
          "image": false
        },
        "pageCount": 243,
        "printType": "BOOK",
        "categories": [
          "Fiction"
        ],
        "averageRating": 4.5,
        "ratingsCount": 12,
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": false,
        "contentVersion": "0.0.1.0.preview.0",
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=VS2WHBipkm4C&printsec=frontcover&img=1&zoom=5&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=VS2WHBipkm4C&printsec=frontcover&img=1&zoom=1&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.com/books?id=VS2WHBipkm4C&dq=Harry+Potter+and&hl=&as_pt=BOOKS&cd=2&source=gbs_api",
        "infoLink": "http://books.google.com/books?id=VS2WHBipkm4C&dq=Harry+Potter+and&hl=&as_pt=BOOKS&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/Harry_Potter_and_Philosophy.html?hl=&id=VS2WHBipkm4C"
      },
      "saleInfo": {
        "country": "IL",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "IL",
        "viewability": "NO_PAGES",
        "embeddable": false,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": false
        },
        "pdf": {
          "isAvailable": true
        },
        "webReaderLink": "http://play.google.com/books/reader?id=VS2WHBipkm4C&hl=&as_pt=BOOKS&source=gbs_api",
        "accessViewStatus": "NONE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "Urging readers of the Harry Potter series to dig deeper than wizards, boggarts, and dementors, the authors of this unique guide collect the musings of seventeen philosophers on the series, who cover a wide range of Potter-related ..."
      }
    },
    {
      "kind": "books#volume",
      "id": "2YR0EAAAQBAJ",
      "etag": "V7VFm8hcTrw",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/2YR0EAAAQBAJ",
      "volumeInfo": {
        "title": "Harry Potter and the Other",
        "subtitle": "Race, Justice, and Difference in the Wizarding World",
        "authors": [
          "Sarah Park Dahlen",
          "Ebony Elizabeth Thomas"
        ],
        "publisher": "Univ. Press of Mississippi",
        "publishedDate": "2022-06-27",
        "description": "Named a 2023 Honour Book by the International Research Society for Children's Literature Contributions by Christina M. Chica, Kathryn Coto, Sarah Park Dahlen, Preethi Gorecki, Tolonda Henderson, Marcia Hernandez, Jackie C. Horne, Susan E. Howard, Peter C. Kunze, Florence Maätita, Sridevi Rao, Kallie Schell, Jennifer Patrice Sims, Paul Spickard, Lily Anne Welty Tamai, Ebony Elizabeth Thomas, Jasmine Wade, Karin E. Westman, and Charles D. Wilson Race matters in the fictional Wizarding World of the Harry Potter series as much as it does in the real world. As J. K. Rowling continues to reveal details about the world she created, a growing number of fans, scholars, readers, and publics are conflicted and concerned about how the original Wizarding World—quintessentially white and British—depicts diverse and multicultural identities, social subjectivities, and communities. Harry Potter and the Other: Race, Justice, and Difference in the Wizarding World is a timely anthology that examines, interrogates, and critiques representations of race and difference across various Harry Potter media, including books, films, and official websites, as well as online forums and the classroom. As the contributors to this volume demonstrate, a deeper reading of the series reveals multiple ruptures in popular understandings of the liberatory potential of the Potter series. Young people who are progressive, liberal, and empowered to question authority may have believed they were reading something radical as children and young teens, but increasingly they have raised alarms about the series’ depiction of peoples of color, cultural appropriation in worldbuilding, and the author’s antitrans statements in the media. Included essays examine the failed wizarding justice system, the counterproductive portrayal of Nagini as an Asian woman, the liberation of Dobby the elf, and more, adding meaningful contributions to existing scholarship on the Harry Potter series. As we approach the twenty-fifth anniversary of the publication of Harry Potter and the Philosopher’s Stone, Harry Potter and the Other provides a smorgasbord of insights into the way that race and difference have shaped this story, its world, its author, and the generations who have come of age during the era of the Wizarding World.",
        "industryIdentifiers": [
          {
            "type": "ISBN_13",
            "identifier": "9781496840530"
          },
          {
            "type": "ISBN_10",
            "identifier": "1496840534"
          }
        ],
        "readingModes": {
          "text": false,
          "image": true
        },
        "pageCount": 324,
        "printType": "BOOK",
        "categories": [
          "Literary Criticism"
        ],
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": false,
        "contentVersion": "0.1.2.0.preview.1",
        "panelizationSummary": {
          "containsEpubBubbles": false,
          "containsImageBubbles": false
        },
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=2YR0EAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=2YR0EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.com/books?id=2YR0EAAAQBAJ&pg=PA162&dq=Harry+Potter+and&hl=&as_pt=BOOKS&cd=3&source=gbs_api",
        "infoLink": "http://books.google.com/books?id=2YR0EAAAQBAJ&dq=Harry+Potter+and&hl=&as_pt=BOOKS&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/Harry_Potter_and_the_Other.html?hl=&id=2YR0EAAAQBAJ"
      },
      "saleInfo": {
        "country": "IL",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "IL",
        "viewability": "PARTIAL",
        "embeddable": true,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": false
        },
        "pdf": {
          "isAvailable": true
        },
        "webReaderLink": "http://play.google.com/books/reader?id=2YR0EAAAQBAJ&hl=&as_pt=BOOKS&source=gbs_api",
        "accessViewStatus": "SAMPLE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "... \u003cb\u003eHarry Potter\u003c/b\u003e Is Poison for White Kids: It&#39;s Multiracial, Left Wing Propaganda.” Stormfront, July 17, 2011. https://www.stormfront.org/forum/t760706-7/. Olden, Marc. Oni. New York: Jove Books, 1988. Ostry, Elaine. “Accepting Mudbloods&nbsp;..."
      }
    },
    {
      "kind": "books#volume",
      "id": "1nOPDwAAQBAJ",
      "etag": "qlev8bGlzf0",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/1nOPDwAAQBAJ",
      "volumeInfo": {
        "title": "The Harry Potter Generation",
        "subtitle": "Essays on Growing Up with the Series",
        "authors": [
          "Emily Lauer",
          "Balaka Basu"
        ],
        "publisher": "McFarland",
        "publishedDate": "2019-04-10",
        "description": "The generation of readers most heavily impacted by J.K. Rowling's Harry Potter series--those who grew up alongside \"the boy who lived\"--have come of age. They are poised to become teachers, parents, critics and writers, and many of their views and choices will be influenced by the literary revolution in which they were immersed. This collection of new essays explores the many different ways in which Harry Potter has shaped this generation's views on everything from politics to identity to pedagogical spaces online. It seeks to determine how the books have affected fans' understanding of their place in the world and their capacity to create it anew.",
        "industryIdentifiers": [
          {
            "type": "ISBN_13",
            "identifier": "9781476670034"
          },
          {
            "type": "ISBN_10",
            "identifier": "147667003X"
          }
        ],
        "readingModes": {
          "text": false,
          "image": true
        },
        "pageCount": 219,
        "printType": "BOOK",
        "categories": [
          "Performing Arts"
        ],
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": false,
        "contentVersion": "0.1.2.0.preview.1",
        "panelizationSummary": {
          "containsEpubBubbles": false,
          "containsImageBubbles": false
        },
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=1nOPDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=1nOPDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.com/books?id=1nOPDwAAQBAJ&pg=PA209&dq=Harry+Potter+and&hl=&as_pt=BOOKS&cd=4&source=gbs_api",
        "infoLink": "http://books.google.com/books?id=1nOPDwAAQBAJ&dq=Harry+Potter+and&hl=&as_pt=BOOKS&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/The_Harry_Potter_Generation.html?hl=&id=1nOPDwAAQBAJ"
      },
      "saleInfo": {
        "country": "IL",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "IL",
        "viewability": "PARTIAL",
        "embeddable": true,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": false
        },
        "pdf": {
          "isAvailable": true,
          "acsTokenLink": "http://books.google.com/books/download/The_Harry_Potter_Generation-sample-pdf.acsm?id=1nOPDwAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
        },
        "webReaderLink": "http://play.google.com/books/reader?id=1nOPDwAAQBAJ&hl=&as_pt=BOOKS&source=gbs_api",
        "accessViewStatus": "SAMPLE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "... \u003cb\u003eHarry Potter\u003c/b\u003e Alliance 2 , 65-67 \u003cb\u003eHarry Potter and\u003c/b\u003e the Chamber of Secrets 40 , 83 , 86 , 88 , 129 , 180 \u003cb\u003eHarry Potter and\u003c/b\u003e the Chamber of Secrets ( film ) 22 , 45 \u003cb\u003eHarry Potter and\u003c/b\u003e the Cursed Child 2,13,186 \u003cb\u003eHarry Potter and\u003c/b\u003e the Deathly&nbsp;..."
      }
    },
    {
      "kind": "books#volume",
      "id": "n3vng7gyGCYC",
      "etag": "rXOZIdZDBUE",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/n3vng7gyGCYC",
      "volumeInfo": {
        "title": "Harry Potter",
        "publisher": "PediaPress",
        "readingModes": {
          "text": false,
          "image": true
        },
        "pageCount": 1011,
        "printType": "BOOK",
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": false,
        "contentVersion": "0.2.2.0.preview.1",
        "panelizationSummary": {
          "containsEpubBubbles": false,
          "containsImageBubbles": false
        },
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=n3vng7gyGCYC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=n3vng7gyGCYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.com/books?id=n3vng7gyGCYC&pg=PA819&dq=Harry+Potter+and&hl=&as_pt=BOOKS&cd=5&source=gbs_api",
        "infoLink": "http://books.google.com/books?id=n3vng7gyGCYC&dq=Harry+Potter+and&hl=&as_pt=BOOKS&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/Harry_Potter.html?hl=&id=n3vng7gyGCYC"
      },
      "saleInfo": {
        "country": "IL",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "IL",
        "viewability": "PARTIAL",
        "embeddable": true,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": false
        },
        "pdf": {
          "isAvailable": true,
          "acsTokenLink": "http://books.google.com/books/download/Harry_Potter-sample-pdf.acsm?id=n3vng7gyGCYC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
        },
        "webReaderLink": "http://play.google.com/books/reader?id=n3vng7gyGCYC&hl=&as_pt=BOOKS&source=gbs_api",
        "accessViewStatus": "SAMPLE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "... \u003cb\u003eHarry Potter and\u003c/b\u003e the Deathly Hallows . Bloomsbury . ISBN 1551929767 . 122 Rowling , J. K. ( 2007 ) . &quot; Nineteen Years Later ” . \u003cb\u003eHarry Potter and\u003c/b\u003e the Deathly Hallows . Bloomsbury . ISBN 1551929767 . 123 Interview with JK Rowling&nbsp;..."
      }
    },
    {
      "kind": "books#volume",
      "id": "GWWuEAAAQBAJ",
      "etag": "DKqIbaqNpFE",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/GWWuEAAAQBAJ",
      "volumeInfo": {
        "title": "Harry Potter and Resistance",
        "authors": [
          "Beth Sutton-Ramspeck"
        ],
        "publisher": "Taylor & Francis",
        "publishedDate": "2023-03-13",
        "description": "Although rule breaking in Harry Potter is sometimes dismissed as a distraction from Harry’s fight against Lord Voldemort, Harry Potter and Resistance makes the case that it is central to the battle against evil. Far beyond youthful hijinks or adolescent defiance, Harry’s rebellion aims to overcome problems deeper and more widespread than a single malevolent wizard. Harry and his allies engage in a resistance movement against the corruption of the Ministry of Magic as well as against the racist social norms that gave rise to Voldemort in the first place. Dumbledore’s Army and the Order of the Phoenix employ methods echoing those utilized by World War II resistance fighters and by the U.S. Civil Rights movement. The aim of this book is to explore issues that speak to our era of heightened political awareness and resistance to intolerance. Its interdisciplinary approach draws on political science, psychology, philosophy, history, race studies, and women’s studies, as well as newer interdisciplinary fields such as resistance studies, disgust studies, and creativity studies.",
        "industryIdentifiers": [
          {
            "type": "ISBN_13",
            "identifier": "9781000839074"
          },
          {
            "type": "ISBN_10",
            "identifier": "1000839079"
          }
        ],
        "readingModes": {
          "text": true,
          "image": true
        },
        "pageCount": 229,
        "printType": "BOOK",
        "categories": [
          "Literary Criticism"
        ],
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": false,
        "contentVersion": "1.2.2.0.preview.3",
        "panelizationSummary": {
          "containsEpubBubbles": false,
          "containsImageBubbles": false
        },
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=GWWuEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=GWWuEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.com/books?id=GWWuEAAAQBAJ&pg=PT174&dq=Harry+Potter+and&hl=&as_pt=BOOKS&cd=6&source=gbs_api",
        "infoLink": "http://books.google.com/books?id=GWWuEAAAQBAJ&dq=Harry+Potter+and&hl=&as_pt=BOOKS&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/Harry_Potter_and_Resistance.html?hl=&id=GWWuEAAAQBAJ"
      },
      "saleInfo": {
        "country": "IL",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "IL",
        "viewability": "PARTIAL",
        "embeddable": true,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": true,
          "acsTokenLink": "http://books.google.com/books/download/Harry_Potter_and_Resistance-sample-epub.acsm?id=GWWuEAAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
        },
        "pdf": {
          "isAvailable": true,
          "acsTokenLink": "http://books.google.com/books/download/Harry_Potter_and_Resistance-sample-pdf.acsm?id=GWWuEAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
        },
        "webReaderLink": "http://play.google.com/books/reader?id=GWWuEAAAQBAJ&hl=&as_pt=BOOKS&source=gbs_api",
        "accessViewStatus": "SAMPLE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "Beth Sutton-Ramspeck. Granger , John . \u003cb\u003eHarry Potter&#39;s\u003c/b\u003e Bookshelf : The Great Books Behind the \u003cb\u003eHogwarts\u003c/b\u003e Adventures . Berkley Books , 2009 . --- . Unlocking \u003cb\u003eHarry Potter\u003c/b\u003e : Five Keys for the Serious Reader . Zossima Press , 2007 . Griesinger&nbsp;..."
      }
    },
    {
      "kind": "books#volume",
      "id": "JHEkAQAAMAAJ",
      "etag": "ZkL+n+I/lGE",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/JHEkAQAAMAAJ",
      "volumeInfo": {
        "title": "Harry Potter and the Deathly Hallows",
        "authors": [
          "J. K. Rowling"
        ],
        "publishedDate": "2007",
        "description": "\"The final adventure in J.K. Rowling's phenomenal, best-selling Harry Potter book series\"--Provided by publisher.",
        "industryIdentifiers": [
          {
            "type": "OTHER",
            "identifier": "UOM:39076002651854"
          }
        ],
        "readingModes": {
          "text": false,
          "image": false
        },
        "pageCount": 870,
        "printType": "BOOK",
        "categories": [
          "Juvenile Fiction"
        ],
        "averageRating": 5,
        "ratingsCount": 3,
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": false,
        "contentVersion": "0.4.3.0.preview.0",
        "panelizationSummary": {
          "containsEpubBubbles": false,
          "containsImageBubbles": false
        },
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=JHEkAQAAMAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=JHEkAQAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.com/books?id=JHEkAQAAMAAJ&q=Harry+Potter+and&dq=Harry+Potter+and&hl=&as_pt=BOOKS&cd=7&source=gbs_api",
        "infoLink": "http://books.google.com/books?id=JHEkAQAAMAAJ&dq=Harry+Potter+and&hl=&as_pt=BOOKS&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/Harry_Potter_and_the_Deathly_Hallows.html?hl=&id=JHEkAQAAMAAJ"
      },
      "saleInfo": {
        "country": "IL",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "IL",
        "viewability": "NO_PAGES",
        "embeddable": false,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": false
        },
        "pdf": {
          "isAvailable": false
        },
        "webReaderLink": "http://play.google.com/books/reader?id=JHEkAQAAMAAJ&hl=&as_pt=BOOKS&source=gbs_api",
        "accessViewStatus": "NONE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "&quot;The final adventure in J.K. Rowling&#39;s phenomenal, best-selling Harry Potter book series&quot;--Provided by publisher."
      }
    },
    {
      "kind": "books#volume",
      "id": "E_STAgAAQBAJ",
      "etag": "D1mixLWMPSo",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/E_STAgAAQBAJ",
      "volumeInfo": {
        "title": "Critical Perspectives on Harry Potter",
        "authors": [
          "Elizabeth E. Heilman"
        ],
        "publisher": "Routledge",
        "publishedDate": "2008-09-01",
        "description": "This thoroughly revised edition includes updated essays on cultural themes and literary analysis, and its new essays analyze the full scope of the seven-book series as both pop cultural phenomenon and as a set of literary texts. Critical Perspectives on Harry Potter, Second Edition draws on a wider range of intellectual traditions to explore the texts, including moral-theological analysis, psychoanalytic perspectives, and philosophy of technology. The Harry Potter novels engage the social, cultural, and psychological preoccupations of our times, and Critical Perspectives on Harry Potter, Second Edition examines these worlds of consciousness and culture, ultimately revealing how modern anxieties and fixations are reflected in these powerful texts. (\"DISCLAIMER: This book is not authorized, approved, licensed, or endorsed by J.K. Rowling, Warner Bros. Entertainment Inc., or anyone associated with the Harry Potter books or movies.\")",
        "industryIdentifiers": [
          {
            "type": "ISBN_13",
            "identifier": "9781135891534"
          },
          {
            "type": "ISBN_10",
            "identifier": "1135891532"
          }
        ],
        "readingModes": {
          "text": true,
          "image": true
        },
        "pageCount": 586,
        "printType": "BOOK",
        "categories": [
          "Education"
        ],
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": true,
        "contentVersion": "1.4.3.0.preview.3",
        "panelizationSummary": {
          "containsEpubBubbles": false,
          "containsImageBubbles": false
        },
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=E_STAgAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=E_STAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.com/books?id=E_STAgAAQBAJ&pg=RA2-PT443&dq=Harry+Potter+and&hl=&as_pt=BOOKS&cd=8&source=gbs_api",
        "infoLink": "http://books.google.com/books?id=E_STAgAAQBAJ&dq=Harry+Potter+and&hl=&as_pt=BOOKS&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/Critical_Perspectives_on_Harry_Potter.html?hl=&id=E_STAgAAQBAJ"
      },
      "saleInfo": {
        "country": "IL",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "IL",
        "viewability": "PARTIAL",
        "embeddable": true,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": true,
          "acsTokenLink": "http://books.google.com/books/download/Critical_Perspectives_on_Harry_Potter-sample-epub.acsm?id=E_STAgAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
        },
        "pdf": {
          "isAvailable": true,
          "acsTokenLink": "http://books.google.com/books/download/Critical_Perspectives_on_Harry_Potter-sample-pdf.acsm?id=E_STAgAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
        },
        "webReaderLink": "http://play.google.com/books/reader?id=E_STAgAAQBAJ&hl=&as_pt=BOOKS&source=gbs_api",
        "accessViewStatus": "SAMPLE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "... \u003cb\u003eHarry Potter and\u003c/b\u003e the Sorcerer&#39;s Stone ( Warner Bros. , 2001 ) . 13. Rosemary Johnston , &quot; The Literary Construction of \u003cb\u003eHarry Potter\u003c/b\u003e in Page and Screen - Based Formats , &quot; University of Sydney , April 2002 , p . 9. Retrieved November 15&nbsp;..."
      }
    },
    {
      "kind": "books#volume",
      "id": "HbAeEAAAQBAJ",
      "etag": "FphmYplMI/c",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/HbAeEAAAQBAJ",
      "volumeInfo": {
        "title": "Harry Potter: Film Vault: Volume 5",
        "subtitle": "Creature Companions, Plants, and Shapeshifters",
        "authors": [
          "Jody Revenson"
        ],
        "publisher": "Insight Editions",
        "publishedDate": "2020-01-21",
        "description": "Discover the filmmaking secrets behind Fawkes the phoenix, the Whomping Willow, and so much more. Rediscover the creature companions, magical plants, and shapeshifters of the Wizarding World with Harry Potter: Film Vault: Volume 5. Fans will be treated to an in-depth look at the illustrations, paintings, and behind-the-scenes photography that helped develop everything from Harry’s owl, Hedwig, to werewolves and Animagi. Harry Potter: Film Vault compiles the filmmaking secrets and visionary artistry behind the Harry Potter films into a series of twelve deluxe collectible volumes. Intricately designed and packed with gorgeous concept art and unit photography from the Warner Bros. archive, each volume in the series gives fans striking insights about bringing the Wizarding World to the big screen. Included in each book is a collectible art print, making this series a must-have for all Harry Potter fans and collectors everywhere.",
        "industryIdentifiers": [
          {
            "type": "ISBN_13",
            "identifier": "9781683838296"
          },
          {
            "type": "ISBN_10",
            "identifier": "1683838297"
          }
        ],
        "readingModes": {
          "text": false,
          "image": false
        },
        "pageCount": 64,
        "printType": "BOOK",
        "categories": [
          "Art"
        ],
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": false,
        "contentVersion": "0.1.2.0.preview.0",
        "panelizationSummary": {
          "containsEpubBubbles": false,
          "containsImageBubbles": false
        },
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=HbAeEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=HbAeEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.com/books?id=HbAeEAAAQBAJ&pg=PA17&dq=Harry+Potter+and&hl=&as_pt=BOOKS&cd=9&source=gbs_api",
        "infoLink": "http://books.google.com/books?id=HbAeEAAAQBAJ&dq=Harry+Potter+and&hl=&as_pt=BOOKS&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/Harry_Potter_Film_Vault_Volume_5.html?hl=&id=HbAeEAAAQBAJ"
      },
      "saleInfo": {
        "country": "IL",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "IL",
        "viewability": "PARTIAL",
        "embeddable": true,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED_FOR_ACCESSIBILITY",
        "epub": {
          "isAvailable": false
        },
        "pdf": {
          "isAvailable": false
        },
        "webReaderLink": "http://play.google.com/books/reader?id=HbAeEAAAQBAJ&hl=&as_pt=BOOKS&source=gbs_api",
        "accessViewStatus": "SAMPLE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "... \u003cb\u003eHarry Potter and\u003c/b\u003e the Sorcerer&#39;s Stone. In \u003cb\u003eHarry Potter and\u003c/b\u003e the Goblet of Fire, Filch and Mrs. Norris enjoy a dance at the Yule Ball. Through the entire course of the eight \u003cb\u003eHarry Potter\u003c/b\u003e films, Mrs. Norris was played by three tabby Maine&nbsp;..."
      }
    },
    {
      "kind": "books#volume",
      "id": "abYKXvCwEToC",
      "etag": "YMGi3Xbjcq4",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/abYKXvCwEToC",
      "volumeInfo": {
        "title": "Harry Potter",
        "subtitle": "The Story of a Global Business Phenomenon",
        "authors": [
          "S. Gunelius"
        ],
        "publisher": "Springer",
        "publishedDate": "2008-06-03",
        "description": "The Harry Potter books are the bestselling books of all time. In this fascinating study, Susan Gunelius analyzes every aspect of the brand phenomenon that is Harry Potter. Delving into price wars, box office revenue, and brand values, amongst other things, this is the story of the most incredible brand success there has ever been.",
        "industryIdentifiers": [
          {
            "type": "ISBN_13",
            "identifier": "9780230594104"
          },
          {
            "type": "ISBN_10",
            "identifier": "0230594107"
          }
        ],
        "readingModes": {
          "text": true,
          "image": true
        },
        "pageCount": 214,
        "printType": "BOOK",
        "categories": [
          "Business & Economics"
        ],
        "averageRating": 3,
        "ratingsCount": 8,
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": true,
        "contentVersion": "2.5.6.0.preview.3",
        "panelizationSummary": {
          "containsEpubBubbles": false,
          "containsImageBubbles": false
        },
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=abYKXvCwEToC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=abYKXvCwEToC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.com/books?id=abYKXvCwEToC&pg=PA103&dq=Harry+Potter+and&hl=&as_pt=BOOKS&cd=10&source=gbs_api",
        "infoLink": "http://books.google.com/books?id=abYKXvCwEToC&dq=Harry+Potter+and&hl=&as_pt=BOOKS&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/Harry_Potter.html?hl=&id=abYKXvCwEToC"
      },
      "saleInfo": {
        "country": "IL",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "IL",
        "viewability": "PARTIAL",
        "embeddable": true,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": true,
          "acsTokenLink": "http://books.google.com/books/download/Harry_Potter-sample-epub.acsm?id=abYKXvCwEToC&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
        },
        "pdf": {
          "isAvailable": true,
          "acsTokenLink": "http://books.google.com/books/download/Harry_Potter-sample-pdf.acsm?id=abYKXvCwEToC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
        },
        "webReaderLink": "http://play.google.com/books/reader?id=abYKXvCwEToC&hl=&as_pt=BOOKS&source=gbs_api",
        "accessViewStatus": "SAMPLE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "... \u003cb\u003eHarry Potter\u003c/b\u003e film- related merchandise Fan sites that received J.K. Rowling&#39;s Fan Site Award : MuggleNet : www.mugglenet.com The Leaky Cauldron : www.the-leaky-cauldron.org The \u003cb\u003eHarry Potter\u003c/b\u003e Lexicon : www.hp-lexicon.org The \u003cb\u003eHarry Potter\u003c/b\u003e&nbsp;..."
      }
    }
  ]
}