import { utilService } from "../../services/util.service.js"
import { Switch } from "../switch.jsx"
import { Actions } from "../actions.jsx"
import { EditIcon } from "./BookImg.jsx"
const {useState} = React

export function EditPrice( {initVal, onHandleChange, field, prefix}){
    const [price,setValue]= useState(initVal)
    const [state,setState] = useState(false)

    function handleChange({target}){
        let {id, type, value} = target
        if (type==='checkbox') value= target.checked
        setValue({ ...price, [id]:value })
    }

    function onSubmit(ev){
        ev.preventDefault()
        setState(false)
        onHandleChange(field,price)
    }

    function onCancle(ev){
        ev.preventDefault()
        setState(false)
    }

    return state?
        <PriceEditor 
            field={field}
            price={price}
            onHandleChange={handleChange}
            onHandleSubmit={onSubmit}
            onHandleCancle={onCancle}
        />
        :
        <PriceToEdit
                price={price}
                prefix={prefix}
                onEdit={()=>setState(true)}
        />
}

function PriceEditor({field,price, onHandleChange, onHandleSubmit, onHandleCancle}){
    return (
        <form>
            <input  id='amount' type="number" name={field} value={price.amount} onChange={onHandleChange}/>
            <CurencySelector currentCurrency={price.currencyCode} onHandleChange={onHandleChange}/>
            <IsOnSaleEditor isOnSale={price.isOnSale} onHandleChange={onHandleChange}/>
            <Actions positiveCaption="Submit" positiveAction={onHandleSubmit} negativeAction={onHandleCancle}/>
        </form>
    )
}

function IsOnSaleEditor({isOnSale, onHandleChange}){
    return (
        <div className="on-sale">
            <Switch id='isOnSale' isChecked={isOnSale} onChange={onHandleChange} />
            <h3>On Sale</h3>
        </div>
    )
}

function CurencySelector({currentCurrency, onHandleChange}){
    const currencys= utilService.getCurrencys()

    return (
        <select id='currencyCode' value={currentCurrency} onChange={onHandleChange}>
            {
                currencys.map( ({currencyCode,currencySign}) => <CurrencyOption 
                                                                    key={currencyCode} 
                                                                    code={currencyCode} 
                                                                    sign={currencySign}
                                                                />)
            }
        </select>
    )
}

function CurrencyOption({code, sign}){
    return (
        <option value={code}>{sign}</option> 
    )
}

function PriceToEdit({price, prefix, onEdit}){
    const curencySign=utilService.getCurrencySign(price.currencyCode)
    const SaleString= price.isOnSale ? ' (On Sale)' : ''
    return (
        <h3>{prefix+curencySign+price.amount+SaleString}<EditIcon onClick={onEdit}/></h3>
    )
}