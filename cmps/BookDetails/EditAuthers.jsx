import { Actions } from "../actions.jsx"
import { EditIcon } from "./BookImg.jsx"

const {useState}=React

export function EditAuthers({initVal, onHandleChange, field }){
    const [value, setValue] = useState([...initVal])
    const [state,setState] = useState(false)
    const [newAuthor, setNewAuthor] = useState('')

    function handleChange({target}){
        const {value} =target
        setNewAuthor(value)
    }

    function handleAdd(){
        value.push(newAuthor)
        setNewAuthor('')
    }

    function handleDelete(author){
        setValue(prevValue =>prevValue.filter(name=>name!==author))
    }

    function handleApplyChange(){
        onHandleChange(field,value)
        setState(false)
    }

    return state?
        <AuthorsEditor 
            authors={value} 
            newAuthor={newAuthor} 
            onHandleAdd={handleAdd} 
            onHandleChange={handleChange} 
            onHandleDelete={handleDelete}
            onHandleApplyChange={handleApplyChange}
            onCancle={()=>setState(false)}
        />
        :
        <AuthorsToEdit authors={initVal} onEdit={()=>setState(true)} />
}

function AuthorsToEdit ({authors , onEdit}){
    const prefix = authors>1 ? 'Authors: ' : 'Author: '
    const authorsString = authors.join(", ")

    return <h3>{prefix}{authorsString}<EditIcon onClick={onEdit} /></h3>
}

function AuthorsEditor({authors ,newAuthor, onHandleDelete, onHandleAdd, onHandleChange, onHandleApplyChange, onCancle}){
    return (
        <div className="edit-authors">
            <h3>Author/s: </h3>
            <ExistingAuthors authors={authors} onHandleDelete={onHandleDelete} />
            <AddAuthor onHandleAdd={onHandleAdd} onHandleChange={onHandleChange} value={newAuthor} />
            <Actions positiveCaption="Submit" positiveAction={onHandleApplyChange} negativeAction={onCancle} />
        </div>
    )
}

function ExistingAuthors({authors, onHandleDelete}){
    return (
        <div className="authors">
            {authors.map(author=><ExistingAuthor key={author} author={author} onHandleDelete={onHandleDelete}/> )}
        </div>
    )
}

function ExistingAuthor({author, onHandleDelete}){
    return (
        <div className="author" >
            <button onClick={()=>onHandleDelete(author)}>X</button>
            <h3>{author}</h3>
        </div>
    )
}

function AddAuthor({value, onHandleAdd, onHandleChange}){
    return (
        <form>
            <input type="text" onChange={onHandleChange} value={value} />
            <button onClick={onHandleAdd}>Add</button>
        </form>
    )
}