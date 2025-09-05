import { bookService } from "../services/books.service.js"
import { BookImg } from "../cmps/BookDetails/BookImg.jsx"
import { BookInfoEdit } from "../cmps/BookDetails/bookInfo.jsx"
import { BookPriceEdit } from "../cmps/BookDetails/BookPrice.jsx"
import { BookDescriptionEdit } from "../cmps/BookDetails/BookDescription.jsx"
import { Actions } from "../cmps/actions.jsx"


const { useState } = React
const { useNavigate } = ReactRouterDOM

export function AddBookManual(){
    const [newBook,setNewBook] =useState(bookService.getEmptyBook({}))
    const navigate = useNavigate()

    function handleChange(field,value){
        setNewBook(prevBookToedit=>( { ...prevBookToedit, [field]:value } ))
    }

    function onSaveChanges(){
            bookService.save(newBook).then(updatedBook =>{
                showMessage({
                    txt: "Book Was Saved Successfuly!",
                    type: 'positive',
                    buttons:[
                        {
                            txt:'Continue',
                            onClick:()=>navigate(`/book/${updatedBook.id}`)
                        }
                    ]
                })
            }).catch(err=>{
                console.log(err)
                showMessage({
                    txt:'Something went wrong, Please try agian', 
                    type: 'negative',
                    buttons:[
                        {
                            txt:'Continue',
                            onClick:()=>{}
                        }
                    ]
                })                     
            })
        } 

    return (
            <section className="book-edit">
                <BookImg img={newBook.thumbnail} alt={newBook.title} />
                <BookInfoEdit book={newBook} onHandleChange={handleChange} />
                <BookPriceEdit listPrice={newBook.listPrice} onHandleChange={handleChange} />
                <BookDescriptionEdit book={newBook} onHandleChange={handleChange} />
                <Actions positiveCaption='Save' positiveAction={()=>onSaveChanges()} negativeAction={()=>navigate('/book')}/>
            </section>
        )


}