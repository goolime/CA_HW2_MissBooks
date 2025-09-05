
import { Actions } from "../actions.jsx"
import { bookService } from "../../services/books.service.js"
import { showMessage } from "../../services/event-bus.service.js"
const { useNavigate } = ReactRouterDOM

export function ImportStaged({ stagedBooks, removeFromStaged }){

    const navigate = useNavigate()

    function saveStagedBooks(){
        bookService.google.save(stagedBooks).then(books=>{
            console.log(books)
            showMessage({
                txt: "Book Was Saved Successfuly!",
                type: 'positive',
                buttons:[
                    {
                        txt:'Continue',
                        onClick: books.length==1 ? ()=>navigate(`/book/${books[0].id}`) : ()=>navigate(`/book`)
                    }
                ]
           })
        })
    }

    if (stagedBooks.length == 0) return <NoImport/>

    return (
        <div className="import-staging" >
                <div className="staged-books">
                    {
                        stagedBooks.map(stagedBook=>
                            {
                            const book=stagedBook.volumeInfo
                            //console.log(book)
                            return <div key={stagedBook.id} className="staged">
                                <div className='info'>
                                    <div className='title'>
                                        <h3>{book.title}</h3>
                                        {book.subtitle && <h5>{book.subtitle}</h5>}
                                    </div>
                                    {book.authors && <h4>{book.authors.join(',')}</h4>}
                                </div>
                                <img src={'./assets/img/delete.png'} onClick={()=>{removeFromStaged(stagedBook.id)}}/>
                            </div>
                        })
                    }
                </div>
                <Actions positiveCaption="Submit" positiveAction={()=>saveStagedBooks()} negativeAction={()=>navigate('/book')} />
            </div>
    )
}

function NoImport(){
    return (
        <div className="no-import">
            <img src={'./assets/img/pinkBook.png'} />
            <h1>No Book Was Staged</h1>
            <h3>use the search bar to look for a book then stage it</h3>
        </div>
    )
}