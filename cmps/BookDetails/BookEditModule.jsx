
import { bookService } from "../../services/books.service.js"
import { utilService } from "../../services/util.service.js"

const {useState, useEffect} = React

function EditH2( {initVal, onHandleChange, field, state, setState}){
        const [value,setValue]= useState(initVal)

        function handleChange({target}){
            const {value} =target
            setValue(value)
        }

        return state ? 
                <form>
                    <input id={field} type="text" name={field} value={value} onChange={handleChange}/>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                        onHandleChange(field,value)
                    }
                    }>Submit</button>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                    }
                    }>Cancle</button>
                </form>
                : 
                <h2>{initVal} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h2>
    }

function EditH3( {initVal, onHandleChange, field, state, setState}){
        const [value,setValue]= useState(initVal)

        function handleChange({target}){
            const {value} =target
            setValue(value)
        }

        return state ? 
                <form>
                    <input id={field} type="text" name={field} value={value} onChange={handleChange}/>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                        onHandleChange(field,value)
                    }
                    }>Submit</button>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                    }
                    }>Cancle</button>
                </form>
                : 
                <h3>{initVal} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h3>
}

function EditH4( {initVal, onHandleChange, field, state, setState}){
        const [value,setValue]= useState(initVal)

        function handleChange({target}){
            const {value} =target
            setValue(value)
        }

        return state ? 
                <form>
                    <input id={field} type="text" name={field} value={value} onChange={handleChange}/>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                        onHandleChange(field,value)
                    }
                    }>Submit</button>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                    }
                    }>Cancle</button>
                </form>
                : 
                <h4>{initVal} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h4>
}

function EditH3Number( {initVal, onHandleChange, field, state, setState, prefix}){
    const [value,setValue]= useState(initVal)

    function handleChange({target}){
        const {value} =target
        setValue(value)
    }

    return state ? 
        <form>
            <input  id={field} type="number" name={field} value={value} onChange={handleChange}/>
            <button onClick={(ev)=>{
                ev.preventDefault()
                setState(false)
                onHandleChange(field,value)
            }}>submit</button>
            <button onClick={(ev)=>{
                ev.preventDefault()
                setState(false)
            }
            }>Cancle</button>
        </form>
        : 
        <h3>{prefix + initVal} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h3>
}

function EditH4Number( {initVal, onHandleChange, field, state, setState, prefix}){
    const [value,setValue]= useState(initVal)

    function handleChange({target}){
        const {value} =target
        setValue(value)
    }

    return state ? 
        <form>
            <input  id={field} type="number" name={field} value={value} onChange={handleChange}/>
            <button onClick={(ev)=>{
                ev.preventDefault()
                setState(false)
                onHandleChange(field,value)
            }}>submit</button>
            <button onClick={(ev)=>{
                ev.preventDefault()
                setState(false)
            }
            }>Cancle</button>
        </form>
        : 
        <h4>{prefix + initVal} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h4>
    }

function EditFromList( {initVal, onHandleChange, field, state, setState, prefix, list}){
    const [value,setValue]= useState(initVal)

    function handleChange({target}){
        const {value} =target
        setValue(value)
    }

    return state?
        <form>
            <select id={field} onChange={handleChange}>
                {list.map(option=>{
                    return value===option.value ?
                        <option key={option.value} value={option.value} selected>{option.text}</option>
                        :
                        <option key={option.value} value={option.value}>{option.text}</option> 
                })}
            </select>
            <button onClick={(ev)=>{
                ev.preventDefault()
                setState(false)
                onHandleChange(field,value)}}>submit</button>
            <button onClick={(ev)=>{
                ev.preventDefault()
                setState(false)
            }
            }>Cancle</button>
        </form>
        : 
        <h4>{prefix + value.toUpperCase()} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></h4>
}

function EditPrice( {initVal, onHandleChange, field, state, setState, prefix}){
    const [price,setValue]= useState(initVal)

    function handleChange({target}){
        let {id, type, value} = target
        if (type==='checkbox') value= target.checked
        setValue({ ...price, [id]:value })
    }

    return state?
        <form>
             <input  id='amount' type="number" name={field} value={price.amount} onChange={handleChange}/>
             <select id='currencyCode' onChange={handleChange}>
                {
                    utilService.getCurrencys().map(option=>{
                        return price.currencyCode===option.currencyCode ?
                        <option key={option.currencyCode} value={option.currencyCode} selected>{option.currencySign}</option>
                        :
                        <option key={option.currencyCode} value={option.currencyCode}>{option.currencySign}</option> 
                    })
                }
             </select>
            <div className="on-sale">
                <label className="switch">
                        <input id="isOnSale" type="checkbox" checked={price.isOnSale} onChange={handleChange} />
                        <span className="slider round"></span>
                </label>
                <h3>On Sale</h3>
             </div>
            <button onClick={(ev)=>{
                ev.preventDefault()
                setState(false)
                onHandleChange(field,price)}}>submit</button>
            <button onClick={(ev)=>{
                ev.preventDefault()
                setState(false)
            }
            }>Cancle</button>
        </form>
        :
        <h3> {prefix} {utilService.getCurrencySign(price.currencyCode)} {price.amount}  {price.isOnSale ? '(On Sale)' : ''} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/> </h3>


}

function EditParagrph({initVal, onHandleChange, field, state, setState, headline}){

}

function EditAuthers({initVal, onHandleChange, field, state, setState}){

}

function EditCategories({initVal, onHandleChange, field, state, setState}){
    
}

export function BookEditModule({ book, onChangeEditMode }) {
    const [bookToEdit,setbookToEdit] =useState({...book})
    
    const [titleEdit,setTitleEdit] = useState(false)
    const [subtitleEdit, setsubtitleEdit] = useState(false)
    const [pagesEdit,setPagesEdit] =useState(false)
    const [publishedEdit, setPublishedEdit] = useState(false)
    const [languageEdit, setLanguageEdit] = useState(false)
    const [priceEdit, setPriceEdit] =useState(false)
    
    useEffect(()=>{
        setbookToEdit({...book})
    },[book])
    
    function handleChange(field,value){
        setbookToEdit(prevBookToedit=>( { ...prevBookToedit, [field]:value } ))
    }

    

    console.log('!')

    return (
        <section className="book-edit">
            <div className="book-img">
                <img  src={book.thumbnail} alt={book.title} />
            </div>
            <section className="book-info">
                <EditH2 initVal={bookToEdit.title} onHandleChange={handleChange} field='title' state={titleEdit} setState={setTitleEdit} />
                <EditH4 initVal={bookToEdit.subtitle} onHandleChange={handleChange} field='subtitle' state={subtitleEdit} setState={setsubtitleEdit} />
                <h3>Author: {book.author}</h3>
                <EditH3Number initVal={bookToEdit.pageCount} onHandleChange={handleChange} field='pageCount' state={pagesEdit} setState={setPagesEdit} prefix='Pages :' />
                <EditH4Number initVal={bookToEdit.publishedDate} onHandleChange={handleChange} field='publishedDate' state={publishedEdit} setState={setPublishedEdit} prefix='Published: ' />
                <EditFromList initVal={bookToEdit.language} onHandleChange={handleChange} field='language' state={languageEdit} setState={setLanguageEdit} prefix='Language: ' list={bookService.getLanguages().map(({name,code})=>{return {'value':code,'text':name}})}  />
            </section>
            <section className="book-price">
                <EditPrice initVal={bookToEdit.listPrice} onHandleChange={handleChange} field='listPrice' state={priceEdit} setState={setPriceEdit} prefix='Price: '/>
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