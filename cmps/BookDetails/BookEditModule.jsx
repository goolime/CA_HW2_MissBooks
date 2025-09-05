
import { bookService } from "../../services/books.service.js"

import { Actions } from "../actions.jsx"
import { BookImg } from "./BookImg.jsx"
import { BookInfoEdit } from "./bookInfo.jsx"
import { BookPriceEdit } from "./BookPrice.jsx"
import { BookDescriptionEdit } from "./BookDescription.jsx"
import { showMessage } from "../../services/event-bus.service.js"

const {useState, useEffect} = React



export function BookEditModule({ book, onChangeEditMode, onBookChanged }) {
    const [bookToEdit,setbookToEdit] =useState({...book})
    
    
    useEffect(()=>{
        setbookToEdit({...book})
    },[book])
    
    function handleChange(field,value){
        setbookToEdit(prevBookToedit=>( { ...prevBookToedit, [field]:value } ))
    }

    function onSaveChanges(){
        bookService.save(bookToEdit).then(updatedBook =>{
            onBookChanged(updatedBook)
            showMessage({
                txt: "Book Was Saved Successfuly!",
                type: 'positive',
                buttons:[
                    {
                        txt:'Continue',
                        onClick:()=>onChangeEditMode()
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
            <BookImg img={bookToEdit.thumbnail} alt={bookToEdit.title} />
            <BookInfoEdit book={bookToEdit} onHandleChange={handleChange} />
            <BookPriceEdit listPrice={bookToEdit.listPrice} onHandleChange={handleChange} />
            <BookDescriptionEdit book={bookToEdit} onHandleChange={handleChange} />
            <Actions positiveCaption='Save' positiveAction={()=>onSaveChanges()} negativeAction={()=>onChangeEditMode()}/>
        </section>
    )
}