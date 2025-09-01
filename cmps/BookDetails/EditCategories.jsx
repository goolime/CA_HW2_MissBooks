import { bookService } from "../../services/books.service.js"

const {useState} = React

export function EditCategories({initVal, onHandleChange, field, state, setState}){
    const [value,setValue]= useState([...initVal])

    function handleChange({target}){
        const {id, checked} =target
        setValue(prevValue => {
            if (checked)
                return [...prevValue, id]
            else
                return prevValue.filter((category=>category !== id))
            
        })
    }

    return state?
        <section className="book-categories-edit">
            <h3>Categories:</h3>
            <form>
                <div className="categories">
                    {bookService.getCategories().map(category=>{
                        return <div key={category} className="category">
                                    <label className="switch">
                                        <input id={category} type="checkbox" checked={value.some(val=> val===category)} onChange={handleChange} />
                                        <span className="slider round"></span>
                                    </label>
                                    <h3>{category}</h3>
                                </div>
                    })}
                </div>
                <div className="actions">
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                        onHandleChange(field,value)
                    }
                    }>Submit</button>
                    <button onClick={(ev)=>{
                        ev.preventDefault()
                        setState(false)
                        setValue([...initVal])
                    }
                    }>Cancle</button>
                </div>
            </form>

        </section>
        :
        <section className="book-categories">
            <h3>Categories:</h3>
            {value.map(category => (
                <h4 key={category} className="book-category">{category}</h4>
            ))}
            <img src={'./assets/img/edit.png'} onClick={()=> setState(true)} />
        </section>
}
