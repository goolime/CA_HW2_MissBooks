import { bookService } from "../../services/books.service.js"
import { Colapsable } from "../Colapsable.jsx"

const { useState, useEffect } = React


export function BookReviews ({bookId}){
    const [reviews,setReviews] = useState([])

    useEffect(()=>{
        bookService.reviews.get(bookId).then(reviews=>setReviews(reviews))
    },[])
    console.log(reviews)

    function onAddReview(review){
        bookService.reviews.save(bookId,review).then(newReview=>{
            setReviews(prevReviews=>[...prevReviews,newReview])
        })
    }

    function handleDelete(reviewId){
        bookService.reviews.remove(bookId,reviewId).then(()=>{
            setReviews(prevReview=>prevReview.filter(review=>review.id!==reviewId))
        })
    }
    

    return (
        <div className="book-reviews">
            <Colapsable title={<h2>Reviews</h2>}>
                <Colapsable title={<h4>Add Review</h4>}>
                    <ReviewForm onAddReview={onAddReview}/>
                </Colapsable>
                {
                    reviews.map(review=><Review key={review.id} review={review} handleDelete={handleDelete}/>)
                }
            </Colapsable>
        </div>
    )
}

function ReviewForm({onAddReview}){

    const [review,setReview] = useState(bookService.reviews.getEmptyReview)

    function handleChange({target}) {
        const {id,value} =target
        setReview(prevReview=>({...prevReview,[id]:value}))
    }

    let currentDate = new Date();
    const maxdate= `${currentDate.getFullYear()}-${(''+(currentDate.getMonth()+1)).padStart(2,'0')}`

    return (
        <form>
            <div className="input">
                
                <div className="field">
                    <h4>Name</h4>
                    <input id="name" type="text" value={review.name} onChange={handleChange}/>
                </div>
                <div className="field">
                    <h4>Raiting</h4>
                    <input id="raiting" type="range" min='0' max='5' value={review.raiting} onChange={handleChange}/>
                </div>
                <div className="field">
                    <h4>Read At</h4>
                    <input type="month" id='readAt' max={maxdate} value={review.readAt} onChange={handleChange}/>
                </div>
            </div>
            <button onClick={()=>onAddReview(review)}>Save</button>
        </form>
    )
}

function Review({review, handleDelete}){
    return  <div className="review">
                <img className="del" onClick={()=>handleDelete(review.id)} src={'./assets/img/delete.png'} />
                <Raiting rate={review.raiting}/>
                <h2>{review.name}</h2>
                <h3>{formatReadAt(review.readAt)}</h3>
            </div>
}

const months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
function formatReadAt(readAt){
    
    const year= readAt.substring(0,4)
    const month = months[readAt.substring(6)-1]

    return `${month},${year}`
    
}

function Raiting({rate}){
    const starArr=Array.from({ length: rate }, (value, index) => index);
    const blackStarArr=Array.from({ length: 5-rate }, (value, index) => index);
    return (
        <div className="rating">
            {
                starArr.map(num=><img key={`s${num}`} src={'./assets/img/star.png'}/>)
            }
            {
                blackStarArr.map(num=><img key={`bs${num}`} className="black" src={'./assets/img/bstar.png'}/>)
            }
        </div>
    )
}