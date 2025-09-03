import { EditAuthers } from "./EditAuthers.jsx"
import { EditH2, EditH4 } from "./EditText.jsx"
import { EditH3Number, EditH4Number } from "./EditNum.jsx"
import { EditFromList } from "./EditList.jsx"
import { bookService } from "../../services/books.service.js"

const {useRef} = React

export function BookInfoEdit({book, onHandleChange}){
    const langList=useRef(bookService.getLanguages().map(({name,code})=>{return {'value':code,'text':name}}))

    return (
        <section className="book-info">
                <EditH2 initVal={book.title} onHandleChange={onHandleChange} field='title' />
                <EditH4 initVal={book.subtitle} onHandleChange={onHandleChange} field='subtitle' />
                <EditAuthers initVal={book.authors} onHandleChange={onHandleChange} field={'authors'} />
                <EditH3Number initVal={book.pageCount} onHandleChange={onHandleChange} field='pageCount' prefix='Pages :' />
                <EditH4Number initVal={book.publishedDate} onHandleChange={onHandleChange} field='publishedDate' prefix='Published: ' />
                <EditFromList initVal={book.language} onHandleChange={onHandleChange} field='language' prefix='Language: ' list={langList.current}  />
        </section>
    )
}

export function BookInfo({book}){

    

    return (
        <section className="book-info">
            <h2>{book.title}</h2>
            <h4>{book.subtitle}</h4>
            <Authors authors={book.authors}/>
            <GetPages pageCount={book.pageCount} />
            <h4>Published: {book.publishedDate}</h4>
            <h4>Language: {book.language.toUpperCase()}</h4>
        </section>
    )
}

function Authors ({authors}){
    const prefix = authors>1 ? 'Authors: ' : 'Author: '
    const authorsString = authors.join(", ")

    return <h3>{prefix}{authorsString}</h3>
}

function GetPages({pageCount}) {
    var string = '' + pageCount
    if (pageCount > 500) string += '(Serious Reading)';
    else if (pageCount > 200) string += '(Decent Reading)';
    else if (pageCount < 100) string += '(Light Reading)';
    return <h4>Pages: {string}</h4>;
}