import { bookService } from "../../services/books.service.js"
import { utilService } from "../../services/util.service.js"
import { Actions } from "../actions.jsx"
import { Colapsable } from "../Colapsable.jsx"

const { useState } = React

export function BookFilter({ filterBy, onFilterChange }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

    function handleChange({ target }) {
        let { id, value, name: field } = target

        switch (target.type) {
            case 'range':
            case 'number':
                value = +target.value
                break
            case 'checkbox':
                value = target.checked
                break
            case 'list':
                value = target.value.split(',')
                break
        }
        if (field === 'categories') {
            const categories = filterByToEdit.categories ? [...filterByToEdit.categories] : []
            if (value){
                categories.push(id)
            }
            else {
                const idx = categories.indexOf(id)
                if (idx !== -1) categories.splice(idx, 1)
            }
            value = categories
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onFilterChange(filterByToEdit)
    }

    function isChecked(category) {
        if (!filterByToEdit.categories || !filterByToEdit.categories.length) return false
        if (filterByToEdit.categories.includes(category)) return true
        return false
    }

    function handleClear(ev) {
        ev.preventDefault()
        onFilterChange(bookService.getDefaultFilter())
    }

    return <div className="book-filter">
        <Colapsable title={<h2>Filter Books</h2>}>
            <form>
                <TitleAuthorFilter filter={filterByToEdit} onHandleChange={handleChange} />
                <CategoriesFilter isChecked={isChecked} onHandleChange={handleChange}/>
                <PriceFilter filter={filterByToEdit} onHandleChange={handleChange} />
                <PageCountFilter filter={filterByToEdit} onHandleChange={handleChange}/>
                <Actions 
                    positiveCaption="Filter"
                    positiveAction={onSubmitFilter}
                    negativeCaption="Clear"
                    negativeAction={handleClear}
                    />
            </form>
        </Colapsable>
    </div>
}

function PriceFilter ({filter, onHandleChange}){
    return (
        <Colapsable title={<h3>Price</h3>}>
            <NumInputWithLabel id='minPrice' label='Min Price' value={filter.minPrice} onHandleChange={onHandleChange}/>
            <NumInputWithLabel id='maxPrice' label='Max Price' value={filter.maxPrice} onHandleChange={onHandleChange}/>
            <CheckboxWithLabel id='isOnSale' BeforeLabel='On Sale' isChecked={filter.isOnSale} onHandleChange={onHandleChange} />
        </Colapsable>
    ) 
}

function PageCountFilter ({filter, onHandleChange}){
    return (
        <Colapsable title={<h3>Page Count</h3>}>
            <NumInputWithLabel id='minPageCount' label='Min Page Count' value={filter.minPageCount} onHandleChange={onHandleChange}/>
            <NumInputWithLabel id='maxPageCount' label='Max Page Count' value={filter.maxPageCount} onHandleChange={onHandleChange}/>
        </Colapsable>
    )
}

function CategoriesFilter({isChecked , onHandleChange}){
    return (
        <Colapsable title={<h3>Categories</h3>}>
            {
                bookService.getCategories().map(element => {
                return (
                    <CheckboxWithLabel 
                        key={element}
                        id={element} 
                        field='categories' 
                        isChecked={isChecked(element)} 
                        AfterLabel={element} 
                        onHandleChange={onHandleChange}
                    />
                )
            })}
        </Colapsable>
    )
}

function TitleAuthorFilter({filter , onHandleChange}){
    return (
        <Colapsable title={<h3>Title/Author</h3>}> 
            <TxtInputWithLabel label='title' value={filter.title} onHandleChange={onHandleChange}/>
            <TxtInputWithLabel label='author' value={filter.author} onHandleChange={onHandleChange}/>
        </Colapsable>
    )
}

function TxtInputWithLabel({label, value , onHandleChange, id=undefined}){
    const capitalizedLabel = utilService.capitalizeFirstLetter(label)
    const _id = id ? id : label
    return (
        <div className="item">
            <label key={_id} htmlFor={_id}>{capitalizedLabel}</label>
            <input key={_id+"Input"}
                id={_id}
                type="text"
                name={_id}
            placeholder={`Search by ${capitalizedLabel}`}
            value={value}
            onChange={onHandleChange} />
        </div>
    )
}

function NumInputWithLabel({label, value , onHandleChange, id=undefined}){
    const capitalizedLabel = utilService.capitalizeFirstLetter(label)
    const _id = id ? id : label   
    return (   
        <div className="item">
            <label key={_id} htmlFor={_id}>{capitalizedLabel}</label>
            <input key={`${_id}Input`}
                id={_id}
                type="number"
                name={_id}
                placeholder={`Set ${capitalizedLabel}`}
                value={value}
                onChange={onHandleChange}
            />
        </div>
    )
}

function CheckboxWithLabel({onHandleChange, field=undefined, isChecked=false ,id=undefined,BeforeLabel='', AfterLabel=''}){
    const _id = id ? id : BeforeLabel+AfterLabel
    const _field = field ? field : _id
    return(
        <div className="item">
            {BeforeLabel &&<label key={_id} htmlFor={_id}>{BeforeLabel}</label>}
            <input key={`${_id}Input`}
                id={_id}
                type="checkbox"
                name={_field}
                checked={isChecked}
                onChange={onHandleChange}
            />
            {AfterLabel &&<label key={_id} htmlFor={_id}>{AfterLabel}</label>}
        </div>
    )   
}