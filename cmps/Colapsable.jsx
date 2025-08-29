
const {useState} = React

export function Colapsable({ title, children }) {
    const [isOpen, setIsOpen] = useState(false)

    function toggleOpen() {
        setIsOpen(!isOpen)
    }

    return (
        <section className="colapsable">
              <div onClick={toggleOpen} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>{title}<span style={{ marginLeft: '10px', transform: isOpen ? 'rotate(270deg)' : 'rotate(90deg)' }}>»</span></div>
            {isOpen && <div className="content">{children}</div>}
        </section>
    )
}