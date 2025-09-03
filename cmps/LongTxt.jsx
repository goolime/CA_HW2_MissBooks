
const {useState} = React 

export function LongTxt({txt, length=100, closePostfix="Read More", openPostfix="close"}){
    const [isOpen,setIsOpen] = useState(false)

    function tuggleIsOpen(){
        setIsOpen(prevIsOpen=>!prevIsOpen)
    }

    const txtToPrint = isOpen? txt : txt.substring(0,length)+'...'
    const caption = isOpen? openPostfix : closePostfix

    return (
        <div>
            <p>{txtToPrint}</p>
            <button onClick={()=>tuggleIsOpen()}>{caption}</button>
        </div>
    )

    /*

    if (txt.length<length) return <p>{txt}</p>

    return isOpen?
        <p>{txt} <span className="long-txt-end" onClick={()=>setIsOpen(false)}>{openPostfix}</span></p>
        :
        <p>{txt.substring(0,length)}<span className="long-txt-end" onClick={()=>setIsOpen(true)}>{closePostfix}</span></p>
    */
}