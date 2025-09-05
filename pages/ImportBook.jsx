
import { ImportHeader } from "../cmps/BookAdd/ImportHeader.jsx"
import { ImportStaged } from "../cmps/BookAdd/ImportStaged.jsx"

const { useState } = React


export function ImportBook(){
    
    const [stagedBooks,setStagedBook] = useState([])

    

    function stageBook(book){
        setStagedBook(prevStagedBooks=>{
            return [...prevStagedBooks,book]
        })
    }

    function removeFromStaged(bookid){
        setStagedBook(prevStagedBooks=>prevStagedBooks.filter(stagedBook=>stagedBook.id!==bookid))
    }

    return (
        <React.Fragment>
            <ImportHeader stageBook={stageBook}/>
            <ImportStaged stagedBooks={stagedBooks} removeFromStaged={removeFromStaged}/>
            
        </React.Fragment>
    )
}


