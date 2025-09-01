import { utilService } from "../../services/util.service.js"
const {useState} = React

export function EditPrice( {initVal, onHandleChange, field, state, setState, prefix}){
    const [price,setValue]= useState(initVal)

    function handleChange({target}){
        let {id, type, value} = target
        if (type==='checkbox') value= target.checked
        setValue({ ...price, [id]:value })
    }

    return state?
        <form>
             <input  id='amount' type="number" name={field} value={price.amount} onChange={handleChange}/>
             <select id='currencyCode' onChange={handleChange}>
                {
                    utilService.getCurrencys().map(option=>{
                        return price.currencyCode===option.currencyCode ?
                        <option key={option.currencyCode} value={option.currencyCode} selected>{option.currencySign}</option>
                        :
                        <option key={option.currencyCode} value={option.currencyCode}>{option.currencySign}</option> 
                    })
                }
             </select>
            <div className="on-sale">
                <label className="switch">
                        <input id="isOnSale" type="checkbox" checked={price.isOnSale} onChange={handleChange} />
                        <span className="slider round"></span>
                </label>
                <h3>On Sale</h3>
             </div>
            <button onClick={(ev)=>{
                ev.preventDefault()
                setState(false)
                onHandleChange(field,price)}}>submit</button>
            <button onClick={(ev)=>{
                ev.preventDefault()
                setState(false)
            }
            }>Cancle</button>
        </form>
        :
        <h3> {prefix} {utilService.getCurrencySign(price.currencyCode)} {price.amount}  {price.isOnSale ? '(On Sale)' : ''} <img src={'./assets/img/edit.png'} onClick={()=> setState(true)}/> </h3>

}