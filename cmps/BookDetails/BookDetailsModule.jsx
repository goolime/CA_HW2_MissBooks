import { utilService } from '../../services/util.service.js'

export function BookDetailsModule({ book }) {
    
    const price = getPrice(book.listPrice);
    const ribbon = getRibbon(book.publishedDate)
    const pages = getPages(book.pageCount)

    return (
        <section className="book-details">
            <div className="book-img">
                {ribbon}
                <img  src={book.thumbnail} alt={book.title} />
            </div>
            <section className="book-info">
                <h2>{book.title}</h2>
                <h4>{book.subtitle}</h4>
                <h3>Author: {book.author}</h3>
                {pages}
                <h4>Published: {book.publishedDate}</h4>
                <h4>Language: {book.language}</h4>
            </section>
            <section className="book-price">
                {price}
            </section>
            <section className="book-description">
                <h3>Description:</h3>
                <p>{book.description}</p>
                <section className="book-categories">
                    <h3>Categories:</h3>
                    {book.categories.map(category => (
                        <h4 key={category} className="book-category">{category}</h4>
                    ))}
                </section>
            </section>
        </section>
    )
}

function getPrice(listPrice) {
    return <p>Price: 
            <span className={getPriceClassString(listPrice.isOnSale, listPrice.amount)}>
                {utilService.getCurrencySign(listPrice.currencyCode)}{listPrice.amount}
            </span>
            {listPrice.isOnSale && <span className="discount"> {utilService.getCurrencySign(listPrice.currencyCode)}{Math.round(listPrice.amount*1.2)}</span>}
        </p>;
}

function getPriceClassString(isOnSale, amount) {
    if (isOnSale) return 'on-sale';
    if (amount > 150) return 'expensive';
    if (amount < 20) return 'cheap';
    return '';
}

function getRibbon(publishedDate) {
    const YearSpan=new Date().getFullYear() - publishedDate
    if ( YearSpan <= 1 ) {
        return <span className="ribbon new">NEW</span>;
    }
    else if ( YearSpan >= 10 ) {
        return <span className="ribbon old">VINTAGE</span>;
    }
    return null;
}

function getPages(pageCount) {
    var string = '' + pageCount
    if (pageCount > 500) string += '(Serious Reading)';
    else if (pageCount > 200) string += '(Decent Reading)';
    else if (pageCount < 100) string += '(Light Reading)';
    return <h4>Pages: {string}</h4>;
}