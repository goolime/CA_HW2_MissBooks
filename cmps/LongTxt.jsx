
const {useState} = React 

export function LongTxt({txt, length=100, closePostfix="...", openPostfix="close"}){
    const [isOpen,setIsOpen] = useState(false)

    return isOpen?
        <p>{txt} <span className="long-txt-end" onClick={()=>setIsOpen(false)}>{openPostfix}</span></p>
        :
        <p>{txt.substring(0,length)}<span className="long-txt-end" onClick={()=>setIsOpen(true)}>{closePostfix}</span></p>
}