import { bookService } from "../../services/books.service.js"
import { Colapsable } from "../Colapsable.jsx"

const { useState, useEffect } = React

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
            setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: categories }));
        }
        else setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
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
        <Colapsable title={<h2>Filter Books</h2>} children={
        <form onSubmit={onSubmitFilter}>
            <Colapsable title={<h3>Title/Author</h3>} children={
                [
                    <label key="title" htmlFor="title">Title</label>,
                    <input key="titleInput"
                        id="title"
                        type="text"
                        name="title"
                    placeholder="Search by title"
                    value={filterByToEdit.title}
                    
                    onChange={handleChange} />,
                    <label key="author" htmlFor="author">Author</label>,
                    <input key="authorInput"
                        id="authors"
                        type="text"
                        name="authors"
                        placeholder="Search by author"
                        value={filterByToEdit.author}
                        onChange={handleChange} />
                ]} />
            <Colapsable title={<h3>Categories</h3>} children={
                <div>
                    {
                        bookService.getCategories().map(element => {
                        return (
                            <div key={element}>
                                <input type="checkbox" 
                                    id={element} 
                                    name="categories" 
                                    value={element} 
                                    onChange={handleChange} 
                                    checked={isChecked(element)}
                                    />
                                <label htmlFor={element}>{element}</label>
                            </div>
                        )
                    })}
                </div>
            } />
            <Colapsable title={<h3>Price</h3>} children={
                [
                    <label key="minPrice" htmlFor="minPrice">Min Price</label>,
                    <input key="minPriceInput"
                        id="minPrice"
                        type="number"
                        name="minPrice"
                        placeholder="Min price"
                        value={filterByToEdit.minPrice}
                        onChange={handleChange}
                    />,
                    <label key="maxPrice" htmlFor="maxPrice">Max Price</label>,
                    <input key="maxPriceInput"
                        id="maxPrice"
                        type="number"
                        name="maxPrice"
                        placeholder="Max price"
                        value={filterByToEdit.maxPrice}
                        onChange={handleChange}
                    />,
                    <label key="isOnSale" htmlFor="isOnSale">On Sale</label>,
                    <input key="isOnSaleInput"
                        id="isOnSale"
                        type="checkbox"
                        name="isOnSale"
                        checked={filterByToEdit.isOnSale}
                        onChange={handleChange}
                    />
                ]
            } />
            <Colapsable title={<h3>Page Count</h3>} children={
                [
                    <label key="minPageCount" htmlFor="minPageCount">Min Page Count</label>,
                    <input key="minPageCountInput"
                        id="minPageCount"
                        type="number"
                        name="minPageCount"
                        placeholder="Min page count"
                        value={filterByToEdit.minPageCount}
                        onChange={handleChange}
                    />,
                    <label key="maxPageCount" htmlFor="maxPageCount">Max Page Count</label>,
                    <input key="maxPageCountInput"
                        id="maxPageCount"
                        type="number"
                        name="maxPageCount"
                        placeholder="Max page count"
                        value={filterByToEdit.maxPageCount}
                        onChange={handleChange}
                    />
                ]
            } />
            <button>Filter</button>
            <button onClick={(ev) => handleClear(ev)}>Clear</button>
        </form>
        }/>
    </div>
}