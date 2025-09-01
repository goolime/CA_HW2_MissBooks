
const {useState}= React

export function EditH3Number( {initVal, onHandleChange, field, state, setState, prefix}){
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

export function EditH4Number( {initVal, onHandleChange, field, state, setState, prefix}){
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
