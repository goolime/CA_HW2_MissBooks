import { TextSize } from "./TextSize.jsx"
import { Actions } from "../actions.jsx"
import { EditIcon } from "./BookImg.jsx"

const {useState}= React

export function EditH3Number( { initVal, onHandleChange, field, prefix }){
    return <EditHNumber 
                field={field}
                initVal={initVal}
                onHandleChange={onHandleChange}
                prefix={prefix}
                size='h3'
            />
}

export function EditH4Number( { initVal, onHandleChange, field, prefix }){
    return <EditHNumber 
                field={field}
                initVal={initVal}
                onHandleChange={onHandleChange}
                prefix={prefix}
                size='h4'
            />
}


function EditHNumber( { initVal, onHandleChange, field, prefix, size }){
    const [num,setValue]= useState(initVal)
    const [state,setState] = useState(false)

    function handleChange({target}){
        const {value} =target
        setValue(parseInt(value))
    }

    function onSubmit(ev){
        ev.preventDefault()
        setState(false)
        onHandleChange(field,num)
    }

    function onCancle(ev){
        ev.preventDefault()
        setState(false)
    }

    return state ? 
        <NumberEditor
            value={num}
            onHandleChange={handleChange}
            onHandleSubmit={onSubmit}
            onHandleCancle={onCancle}
        />
        : 
        <NumberToEdit 
            size={size}
            prefix={prefix}
            value={num}
            onClick={()=>setState(true)}
        />

}

function NumberEditor({value, onHandleChange, onHandleSubmit, onHandleCancle}){
    return (
        <form>
            <input  type="number" value={value} onChange={onHandleChange}/>
            <Actions positiveCaption="Submit" positiveAction={onHandleSubmit} negativeAction={onHandleCancle} />
        </form>
    )
}

function NumberToEdit({size , prefix , value , onClick}){
    return <TextSize 
            size={size}
            value={
                <label>
                    {prefix + value} <EditIcon onClick={onClick} />
                </label>
            }
        />
}
