import { Loading } from '../cmps/Loading.jsx'
import { bookService } from '../services/books.service.js'
import { BookFilter } from '../cmps/BookApp/BookFilter.jsx'
import { BookList } from '../cmps/BookApp/BookList.jsx'


const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function BookApp() {
    const [searchParams,setSearchParams] = useSearchParams()
    const [books, setBooks] = useState(null)
    const defualtFilter = bookService.getDefaultFilterFromSearchParams(searchParams)
    const [filterBy, setFilterBy] = useState(defualtFilter)

    useEffect(()=>{
        loadBooks()
    },[])

    useEffect(() => {
        setSearchParams(filterBy)
        setBooks(null)
        loadBooks()
    }, [filterBy])

    function loadBooks() {
        bookService.query(filterBy).then(setBooks)
    }

    function onDelete(bookId){
        bookService.remove(bookId)
                    .then(
                        setBooks(
                            prevBooks=>prevBooks.filter(book=>book.id!==bookId)
                        )
                    )
    }

    if (books === null) return <Loading />
    return (
        <section className="book-app">
            <BookFilter filterBy={filterBy} onFilterChange={ filter => setFilterBy(filter)} />
            <BookList books={books} onDelete={onDelete}/>
        </section>
    )
}