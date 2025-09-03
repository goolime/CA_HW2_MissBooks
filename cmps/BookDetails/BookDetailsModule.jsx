
import { BookImgRibon } from './BookImg.jsx'
import { BookInfo } from './bookInfo.jsx'
import { BookPrice } from './BookPrice.jsx'
import { BookDescription } from './BookDescription.jsx'

export function BookDetailsModule({ book }) {
    
    return (
        <section className="book-details">
            <BookImgRibon img={book.thumbnail} alt={book.title} publishedDate={book.publishedDate} />
            <BookInfo book={book}/>
            <BookPrice listPrice={book.listPrice} />
            <BookDescription book={book}/>
        </section>
    )
}





