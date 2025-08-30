import { BookDetailsModule } from "../cmps/BookDetails/BookDetailsModule.jsx"
import { BookEditModule } from "../cmps/BookDetails/BookEditModule.jsx"
import { BookDetailsControls } from "../cmps/BookDetails/BookDetailsControls.jsx"
import { Loading } from "../cmps/Loading.jsx"
import { bookService } from "../services/books.service.js"
import { BookDetailsFooter } from "../cmps/BookDetails/BookDetailsFooter.jsx"
import { InDevelopment } from "./InDevelopmet.jsx"   


const { useEffect, useState } = React
const { useParams } = ReactRouterDOM

export function BookDetails() {

    const [book, setBook] = useState(null)
    const [editMode, setEditMode] = useState(false)

    const params = useParams()

    useEffect(() => {
        loadBook()
    }, [params.bookId])

    function loadBook() {
        const { bookId } = params
        bookService.get(bookId)
            .then(book => setBook(book))
    }

    function handleEditModeChange() {
        setEditMode(prevEditMode => !prevEditMode)
    }

    if (book===null) return <Loading />


    return (
        <section >
             <BookDetailsControls editMode={editMode} onChangeEditMode={handleEditModeChange} />
            <section className="book-details-page">
            { editMode ? <InDevelopment /> :  <BookDetailsModule book={book} /> }
            </section>
            <BookDetailsFooter booknext={book.next} bookprev={book.prev} />
        </section>
    )
}