
const {useState, useEffect} = React

export function EditH2( {initVal, onHandleChange, field, state, setState}){
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

export function EditH3( {initVal, onHandleChange, field, state, setState}){
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

export function EditH4( {initVal, onHandleChange, field, state, setState}){
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

export function EditParagrph({initVal, onHandleChange, field, state, setState, headline}){
    const [value,setValue]= useState(initVal)

    function handleChange({target}){
        const {value} =target
        setValue(value)
    }

    return state ?
            <section>
                <h3>{headline}</h3>
                <form>
                    <textarea id={field} type="text" cols="50" rows="8" name={field} value={value} onChange={handleChange}/>
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
                        }
                    }>Cancle</button>
                    </div>
                </form>
            </section>
            : 
            <section>
                <h3>{headline}</h3>
                <p>{value}<img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/></p>
            </section>
}