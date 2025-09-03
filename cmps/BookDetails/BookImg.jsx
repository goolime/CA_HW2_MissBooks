
export function BookImg ({img, alt}){
    return (
        <div className="book-img">
            <img  src={img} alt={alt} />
        </div>
    )
}

export function EditIcon ({onClick}){
    return <img src={'./assets/img/edit.png'} onClick={onClick}/>
}

export function BookImgRibon({img, alt, publishedDate}){

    const ribbon = getRibbon(publishedDate)

    return (
        <div className="book-img">
            {ribbon}
            <img  src={img} alt={alt} />
        </div>
    )
}

function getRibbon(publishedDate) {
    const YearSpan=new Date().getFullYear() - publishedDate
    if ( YearSpan <= 1 ) {
        return <span className="ribbon new">NEW</span>;
    }
    else if ( YearSpan >= 10 ) {
        return <span className="ribbon old">VINTAGE</span>;
    }
    return null;
}