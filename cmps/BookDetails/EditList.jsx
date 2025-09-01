
const {useState} = React

export function EditFromList( {initVal, onHandleChange, field, state, setState, prefix, list}){
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