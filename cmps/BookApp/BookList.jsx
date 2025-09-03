import { BookPrivew } from "./BookPrivew.jsx"
import { NoResults } from "./NoResults.jsx"

export function BookList({ books , onDelete}) {
    if (books.length === 0) return <NoResults />
    return (
        <ul className="book-list">
            {books.map(book => (
                <li key={book.id}>
                    <BookPrivew 
                        bookId={book.id} 
                        BookTitle={book.title} 
                        BookAuthors={book.authors} 
                        BookSubtitle={book.subtitle} 
                        onDelete={onDelete}
                    />
                </li>
            ))}
        </ul>
    )
}