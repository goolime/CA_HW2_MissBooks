import { EditPrice } from "./EditPrice.jsx"
import { utilService } from '../../services/util.service.js'

export function BookPrice({listPrice}){
    return (
        <section className="book-price">
            <GetPrice listPrice={listPrice}/>
        </section>
    )
}

export function BookPriceEdit({listPrice, onHandleChange}){
    return ( 
        <section className="book-price">
            <EditPrice initVal={listPrice} onHandleChange={onHandleChange} field='listPrice' prefix='Price: '/>
        </section>
    )
}

function GetPrice({listPrice}) {
    const spanClass=getPriceClassString(listPrice.isOnSale, listPrice.amount)
    const currencySign = utilService.getCurrencySign(listPrice.currencyCode)

    return <h3>Price: 
            <span className={spanClass}>
                {currencySign}{listPrice.amount}
            </span>
            {listPrice.isOnSale && <Sale currencySign={currencySign} originalValue={Math.round(listPrice.amount*1.2)} />}
        </h3>;
}

function getPriceClassString(isOnSale, amount) {
    if (isOnSale) return 'on-sale';
    if (amount > 150) return 'expensive';
    if (amount < 20) return 'cheap';
    return '';
}

function Sale({ currencySign, originalValue}){
    return <span className="discount"> {currencySign}{originalValue}</span>
}