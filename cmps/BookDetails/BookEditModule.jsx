
import { bookService } from "../../services/books.service.js"

import { Actions } from "../actions.jsx"
import { BookImg } from "./BookImg.jsx"
import { BookInfoEdit } from "./bookInfo.jsx"
import { BookPriceEdit } from "./BookPrice.jsx"
import { BookDescriptionEdit } from "./BookDescription.jsx"

const {useState, useEffect} = React

function DialogMessege( { message }  ){
    return [
        <div key='1' className="backdrop"></div>,
        <dialog key='2' className={`${message.positive ? 'positive': ''}`} open>
            <div className={`dialog-message`}>
                <h2>{message.messege}</h2>
                <button onClick={message.onClose}>Continue</button>
            </div>
        </dialog>
    ]
}

export function BookEditModule({ book, onChangeEditMode, onBookChanged }) {
    const [bookToEdit,setbookToEdit] =useState({...book})
    const [message, setMessage] = useState(undefined)
    
    
    useEffect(()=>{
        setbookToEdit({...book})
    },[book])
    
    function handleChange(field,value){
        setbookToEdit(prevBookToedit=>( { ...prevBookToedit, [field]:value } ))
    }

    function onSaveChanges(){
        bookService.save(bookToEdit).then(updatedBook =>{
            onBookChanged(updatedBook)
            setMessage({messege:"Book Was Saved Successfuly!", positive:true, onClose:()=>{
                setMessage(undefined)
                onChangeEditMode()
            }})
        }).catch(err=>{
            console.log(err)
            setMessage({messege:"Something went wrong, Please try agian", positive:false, onClose:()=>setMessage(undefined) })
        })
    }

    return (
        <section className="book-edit">
            {message && <DialogMessege message={message} />}
            <BookImg img={bookToEdit.thumbnail} alt={bookToEdit.title} />
            <BookInfoEdit book={bookToEdit} onHandleChange={handleChange} />
            <BookPriceEdit listPrice={bookToEdit.listPrice} onHandleChange={handleChange} />
            <BookDescriptionEdit book={bookToEdit} onHandleChange={handleChange} />
            <Actions positiveCaption='Save' positiveAction={()=>onSaveChanges()} negativeAction={()=>onChangeEditMode()}/>
        </section>
    )
}