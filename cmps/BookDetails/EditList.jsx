import { Actions } from "../actions.jsx"
import { EditIcon } from "./BookImg.jsx"

const {useState} = React

export function EditFromList( {initVal, onHandleChange, field, prefix, list}){
    const [value,setValue]= useState(initVal)
    const [state,setState] = useState(false)

    function handleChange({target}){
        const {value} =target
        setValue(value)
    }

    function onSubmit(ev){
        ev.preventDefault()
        setState(false)
        onHandleChange(field,value)
    }

    function onCancle(ev){
        ev.preventDefault()
        setState(false)
    }

    return state?
        <ListEditor 
            currentValue={value}
            field={field}
            list={list}
            onCancle={onCancle}
            onHandleChange={handleChange}
            onSubmit={onSubmit}
        />
        : 
        <ListToEdit 
            prefix={prefix} 
            currentValue={value.toUpperCase()} 
            onEdit={()=> setState(true)}
        />
}

function ListToEdit ({prefix , currentValue, onEdit}){
    return <h4>{prefix + currentValue} <EditIcon onClick={onEdit}/></h4>
}

function ListEditor({list, field, currentValue, onSubmit, onCancle, onHandleChange}){
    return (
        <form>
            <Options list={list} field={field} currentValue={currentValue} onHandleChange={onHandleChange} />
            <Actions positiveCaption="Submit" positiveAction={onSubmit} negativeAction={onCancle}/>
        </form>
    )
}

function Options ({list, field, currentValue, onHandleChange} ){
    return <select id={field} value={currentValue} onChange={onHandleChange}>
                {list.map(option=><Option key={option.value} value={option.value} text={option.text}/>)}
            </select>
}

function Option({value, text}){
    return (<option value={value}>{text}</option>)
}