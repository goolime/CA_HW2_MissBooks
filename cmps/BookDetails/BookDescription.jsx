import { EditParagrph } from "./EditText.jsx"
import { EditCategories } from "./EditCategories.jsx"
import { LongTxt } from "../LongTxt.jsx"

export function BookDescription({book}){
    return (
        <section className="book-description">    
            <Description description={book.description}/>            
            <Categories categories={book.categories} />
        </section>
    )
}

export function BookDescriptionEdit ({book, onHandleChange}){
    return (
        <section className="book-description">
            <EditParagrph initVal={book.description} onHandleChange={onHandleChange} field={'description'}  headline="Description:"/>
            <EditCategories initVal={book.categories} onHandleChange={onHandleChange} field={'categories'}  />
        </section>
    )
}

function Description({description}){
    return [
        <h3 key="head">Description:</h3>,
        <LongTxt key="body" txt={description}/>
    ]
}

function Categories({categories}){
    return (
        <section className="book-categories">
            <h3>Categories:</h3>
            {categories.map(category => <Category key={category} category={category}/> )}
        </section>
    )

}

function Category({category}){
    return ( 
        <h4 key={category} className="book-category">{category}</h4>
    )
}