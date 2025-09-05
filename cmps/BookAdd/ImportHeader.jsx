import { bookService } from "../../services/books.service.js"
import { debounce } from "../../services/util.service.js"
const { useState,useEffect, useRef } = React

export function ImportHeader({stageBook}){
    const [bookToSearch,setBookToSearch] = useState('')
    const [searchResults,setSearchResults] = useState(null)
    const debounceSearchBook = useRef()

    function handleBookSearchChange({target}){
        const {value}=target
        setBookToSearch(value) 
    }

    useEffect(()=>{
        if (bookToSearch.length>0) debounceSearchBook.current(bookToSearch)
    },[bookToSearch])    

    useEffect(()=>{
        debounceSearchBook.current = debounce(searchBook)
    },[])

    function searchBook(stringToSearch=bookToSearch){
        bookService.google.get(stringToSearch)
                        .then(books=>setSearchResults(books))
                        .catch(err=>{
                            console.log(err)
                            showMessage({
                                txt:'Something went wrong, Please try agian', 
                                type: 'negative',
                                buttons:[
                                    {
                                        txt:'Continue',
                                        onClick:()=>{}
                                    }
                                ]
                            })
                        })              

    }

    function _stageBook(book){
        setSearchResults(prevSearchResults=>prevSearchResults.filter(listBook=>listBook.id!==book.id))
        stageBook(book)
    }
    

    return (
        <div className="import-header">
                <form className="search">
                    <input 
                        className="inputBox" 
                        type="text" 
                        value={bookToSearch} 
                        placeholder="Search Book Title" 
                        onChange={handleBookSearchChange}
                        />
                </form>

                {searchResults && 
                    <li className="results">
                        {searchResults.map(googlebook =>{
                            const book=googlebook.volumeInfo
                            //console.log(book)
                            return <ul key={googlebook.id} className="result">
                                <div className='info'>
                                    <div className='title'>
                                        <h3>{book.title}</h3>
                                        {book.subtitle && <h5>{book.subtitle}</h5>}
                                    </div>
                                    {book.authors && <h4>{book.authors.join(',')}</h4>}
                                </div>
                                <img src={'./assets/img/plus.png'} onClick={()=>{_stageBook(googlebook)}}/>
                            </ul>
                        }
                        )}                        
                    </li>
                }
            </div>
    )
}