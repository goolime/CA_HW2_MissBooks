
import { bookService } from "../../services/books.service.js"
import { EditH2, EditH3, EditH4, EditParagrph } from "./EditText.jsx"
import { EditH3Number, EditH4Number } from "./EditNum.jsx"
import { EditFromList } from "./EditList.jsx"
import { EditPrice } from "./EditPrice.jsx"
import { EditCategories } from "./EditCategories.jsx"
import { EditAuthers } from "./EditAuthers.jsx"

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
    
    const [titleEdit,setTitleEdit] = useState(false)
    const [subtitleEdit, setsubtitleEdit] = useState(false)
    const [authorsEdit,setAuthorsEdit] = useState(false)
    const [pagesEdit,setPagesEdit] =useState(false)
    const [publishedEdit, setPublishedEdit] = useState(false)
    const [languageEdit, setLanguageEdit] = useState(false)
    const [priceEdit, setPriceEdit] =useState(false)
    const [descriptionEdit,setDescriptionEdit] =useState(false)
    const [categorysEdit, setCategorysEdit] = useState(false)
    
    
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
            <div className="book-img">
                <img  src={book.thumbnail} alt={book.title} />
            </div>
            <section className="book-info">
                <EditH2 initVal={bookToEdit.title} onHandleChange={handleChange} field='title' state={titleEdit} setState={setTitleEdit} />
                <EditH4 initVal={bookToEdit.subtitle} onHandleChange={handleChange} field='subtitle' state={subtitleEdit} setState={setsubtitleEdit} />
                <EditAuthers initVal={bookToEdit.authors} onHandleChange={handleChange} field={'authors'} state={authorsEdit} setState={setAuthorsEdit}  />
                <EditH3Number initVal={bookToEdit.pageCount} onHandleChange={handleChange} field='pageCount' state={pagesEdit} setState={setPagesEdit} prefix='Pages :' />
                <EditH4Number initVal={bookToEdit.publishedDate} onHandleChange={handleChange} field='publishedDate' state={publishedEdit} setState={setPublishedEdit} prefix='Published: ' />
                <EditFromList initVal={bookToEdit.language} onHandleChange={handleChange} field='language' state={languageEdit} setState={setLanguageEdit} prefix='Language: ' list={bookService.getLanguages().map(({name,code})=>{return {'value':code,'text':name}})}  />
            </section>
            <section className="book-price">
                <EditPrice initVal={bookToEdit.listPrice} onHandleChange={handleChange} field='listPrice' state={priceEdit} setState={setPriceEdit} prefix='Price: '/>
            </section>
            <section className="book-description">
                <EditParagrph initVal={bookToEdit.description} onHandleChange={handleChange} field={'description'} state={descriptionEdit} setState={setDescriptionEdit} headline="Description:"/>
                <EditCategories initVal={bookToEdit.categories} onHandleChange={handleChange} field={'categories'} state={categorysEdit} setState={setCategorysEdit} />
            </section>
            <section className="edit-actions">
                <button onClick={()=>onSaveChanges()}>Save</button>
                <button onClick={()=>onChangeEditMode()} >Cancle</button>
            </section>
        </section>
    )
}