
import { utilService } from "../../services/util.service.js"

const {useState, useEffect} = React

export function BookEditModule({ book, onChangeEditMode }) {
    const [bookToEdit,setbookToEdit] =useState({...book})
    
    const [titleEdit,setTitleEdit] = useState(false)
    const [subtitleEdit, setsubtitleEdit] = useState(false)
    const [pagesEdit,setPagesEdit] =useState(false)
    const [publishedEdit, setPublishedEdit] = useState(false)
    
    useEffect(()=>{
        setbookToEdit({...book})
    },[book])
    
    function handleChange(field,value){
        setbookToEdit(prevBookToedit=>( { ...prevBookToedit, [field]:value } ))
    }

    function EditH2( {field, state, setState}){
        return state ? 
                <form>
                    <input id={field} type="text" name={field} value={bookToEdit[field]} onChange={(ev)=>{
                        handleChange(field,ev.target.value)   
                        }}/>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)}
                    }>Submit</button>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                        handleChange(field, book[field])
                    }
                    }>Cancle</button>
                </form>
                : 
                <h2>{bookToEdit[field]} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h2>
    }

    function EditH3( {field, state, setState}){
        return state ? 
                <form>
                    <input  id={field} type="text" name={field} value={bookToEdit[field]} onChange={(ev)=>{
                        handleChange(field,ev.target.value)
                        }}></input>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)}}>submit</button>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                        handleChange(field, book[field])
                    }
                    }>Cancle</button>
                </form>
                : 
                <h3>{bookToEdit[field]} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h3>
    }

    function EditH4( {field, state, setState}){
        return state ? 
                <form>
                    <input  id={field} type="text" name={field} value={bookToEdit[field]} onChange={(ev)=>{
                        handleChange(field,ev.target.value)
                        }}></input>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)}}>submit</button>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                        handleChange(field, book[field])
                    }
                    }>Cancle</button>
                </form>
                : 
                <h4>{bookToEdit[field]} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h4>
    }

    function EditH3Number( {field, state, setState, prefix}){
        return state ? 
                <form>
                    <input  id={field} type="number" name={field} value={bookToEdit[field]} onChange={(ev)=>{
                        handleChange(field,ev.target.value)
                        }}></input>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)}}>submit</button>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                        handleChange(field, book[field])
                    }
                    }>Cancle</button>
                </form>
                : 
                <h3>{prefix + bookToEdit[field]} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h3>
    }

    function EditH4Number( {field, state, setState, prefix}){
        return state ? 
                <form>
                    <input  id={field} type="number" name={field} value={bookToEdit[field]} onChange={(ev)=>{
                        handleChange(field,ev.target.value)
                        }}></input>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)}}>submit</button>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                        handleChange(field, book[field])
                    }
                    }>Cancle</button>
                </form>
                : 
                <h4>{prefix + bookToEdit[field]} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h4>
    }

    function EditFromList( {fieled, state, setState, prefix, list}){
        return state?
                <form>
                    {
                    /////////////////// TODO!!!!!!
                    }
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)}}>submit</button>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                        handleChange(field, book[field])
                    }
                    }>Cancle</button>
                </form>
                : 
                <h4>{prefix + bookToEdit[field]} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h4>
    }

    console.log('!')

    return (
        <section className="book-edit">
            <div className="book-img">
                <img  src={book.thumbnail} alt={book.title} />
            </div>
            <section className="book-info">
                <EditH2 field='title' state={titleEdit} setState={setTitleEdit} />
                <EditH4 field='subtitle' state={subtitleEdit} setState={setsubtitleEdit} />
                <h3>Author: {book.author}</h3>
                <EditH3Number field='pageCount' state={pagesEdit} setState={setPagesEdit} prefix='Pages :' />
                <EditH4Number field='publishedDate' state={publishedEdit} setState={setPublishedEdit} prefix='Published: ' />
                <h4>Language: {book.language}</h4>
            </section>
            <section className="book-price">
                <h3>Price: {utilService.getCurrencySign(book.listPrice.currencyCode)} {book.listPrice.amount} </h3>
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
            <section className="edit-actions">
                <button>Save</button>
                <button onClick={()=>onChangeEditMode()} >Cancle</button>
            </section>
        </section>
    )
}