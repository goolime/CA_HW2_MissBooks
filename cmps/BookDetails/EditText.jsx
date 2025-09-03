import { Actions } from "../actions.jsx"
import { EditIcon } from "./BookImg.jsx"
import { TextSize } from "./TextSize.jsx"

const {useState} = React



function EditText({ initVal, onHandleChange, field, size }){
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

    return state ? 
            <form>
                <input id={field} type="text" name={field} value={value} onChange={handleChange}/>
                <Actions positiveCaption="Submit" positiveAction={onSubmit} negativeAction={onCancle}/>
            </form>
            : 
            <TextSize value = {[<label key='text'>{initVal}</label>,<EditIcon key='img' onClick={()=>setState(true)}/>]} size={size} /> 
}

export function EditH2( { initVal, onHandleChange, field }){
    return <EditText initVal={initVal} onHandleChange={onHandleChange} field={field} size='h2' />
}

export function EditH3( { initVal, onHandleChange, field }){
    return <EditText initVal={initVal} onHandleChange={onHandleChange} field={field} size='h3' />
}

export function EditH4( {initVal, onHandleChange, field }){
    return <EditText initVal={initVal} onHandleChange={onHandleChange} field={field} size='h4' />
}

export function EditParagrph({initVal, onHandleChange, field, headline}){
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

    return state ?
            <section>
                <h3>{headline}</h3>
                <form>
                    <textarea id={field} type="text" cols="50" rows="8" name={field} value={value} onChange={handleChange}/>
                    <Actions positiveCaption="Submit" positiveAction={onSubmit} negativeAction={onCancle}/>
                </form>
            </section>
            : 
            <section>
                <h3>{headline}</h3>
                <p>{value}<EditIcon key='img' onClick={()=>setState(true)}/></p>
            </section>
}