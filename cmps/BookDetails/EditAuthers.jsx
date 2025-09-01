const {useState}=React

export function EditAuthers({initVal, onHandleChange, field, state, setState}){
    const [value, setValue] = useState([...initVal])
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
        <div className="edit-authors">
            <h3>Author/s: </h3>
            <div className="authors">
            {value.map(author=>
                <div className="author" key={author}>
                    <button onClick={()=>handleDelete(author)}>X</button>
                    <h3>{author}</h3>
                </div>
            )}
            </div>
            <form>
                <input type="text" onChange={handleChange} value={newAuthor} />
                <button onClick={handleAdd}>Add</button>
            </form>
            <div className="action">
                <button onClick={handleApplyChange}>Submit</button>
                <button onClick={()=>setState(false)}>Cancle</button>
            </div>
        </div>
        :
        <h3>{ value>1 ? 'Authors: ' : 'Author: ' }{value.join(", ")} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/> </h3>
}