import { Loading } from '../cmps/Loading.jsx'
import { bookService } from '../services/books.service.js'
import { BookFilter } from '../cmps/BookApp/BookFilter.jsx'
import { BookList } from '../cmps/BookApp/BookList.jsx'


const { useState, useEffect } = React

export function BookApp() {
    const [books, setBooks] = useState(null)
    const [filterBy, setFilterBy] = useState(bookService.getDefaultFilter())

    useEffect(()=>{
        loadBooks()
    },[])

    useEffect(() => {
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