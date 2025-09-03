import { bookService } from "../../services/books.service.js"
import { EditIcon } from "./BookImg.jsx"
import { Actions } from "../actions.jsx"
import { Switch } from "../switch.jsx"

const {useState} = React

export function EditCategories({initVal, onHandleChange, field}){
    const [value,setValue]= useState([...initVal])
    const [state,setState] = useState(false)

    function handleChange({target}){
        const {id, checked} =target
        setValue(prevValue => {
            if (checked)
                return [...prevValue, id]
            else
                return prevValue.filter((category=>category !== id))
            
        })
    }

    function onSubmit(ev){
        ev.preventDefault()
        setState(false)
        onHandleChange(field,value)
    }
    function onCancle(ev){
        ev.preventDefault()
        setState(false)
        setValue([...initVal])
    }

    function isInValue(category){
        return value.some(val=> val===category)
    }

    return state?
        <CategotiesEditor 
            onHandleSubmit={onSubmit} 
            onHandleCancle={onCancle} 
            onHandleChange={handleChange}
            isInValue={isInValue}
        />
        :
        <CategoriesToEdit categories={value} onEdit={()=> setState(true)}/>
}

function CategotiesEditor({onHandleSubmit, onHandleCancle, onHandleChange ,isInValue}){
    return (
        <section className="book-categories-edit">
            <h3>Categories:</h3>
            <form>
                <Categories onHandleChange={onHandleChange} isInValue={isInValue}/>
                <Actions positiveCaption="Submit" positiveAction={onHandleSubmit} negativeAction={onHandleCancle} />
            </form>
        </section>
    )
}

function Categories({onHandleChange,isInValue}){
    const allCategories = bookService.getCategories()

    return (
        <div className="categories">
                {allCategories.map(category=><CategoryEdit 
                                                key={category} 
                                                category={category} 
                                                onHandleChange={onHandleChange} 
                                                isChecked={isInValue(category)}
                                             />)}
        </div>
    )
}
function CategoryEdit ({category,onHandleChange,isChecked}){
    return (
        <div className="category">
            <Switch 
                id={category}
                isChecked={isChecked}
                onChange={onHandleChange}
            />
            <h3>{category}</h3>
        </div>
    )
}

function CategoriesToEdit ({categories, onEdit}){
    return (
        <section className="book-categories">
            <h3>Categories:</h3>
            {categories.map(category => <Category key={category} category={category}/> )}
            <EditIcon onClick={onEdit} />
        </section>
    )
}

function Category({category}){
    return <h4 key={category} className="book-category">{category}</h4>
}