const { Link } = ReactRouterDOM

export function BookPrivew({ bookId, BookTitle, BookAuthors, BookSubtitle }){
    return (
            <div className="book-preview">
                <div className="book-entry">
                    <img src={`./assets/img/blueBook.png`} alt={BookTitle} />
                    <div className="book-info">
                        <div className="book-title-authors">
                            <h3>{BookTitle}</h3>
                            <h4>{BookAuthors.join(", ")}</h4>
                        </div>
                        <h4>{BookSubtitle}</h4>
                    </div>
                </div>
                <div className="book-actions">
                    <button ><Link to={`/book/${bookId}`} >Details</Link></button>
                </div>
            </div>
    )
}