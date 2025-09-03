

export function Switch({isChecked, onChange, id='1'}){
    return (
        <label className="switch">
            <input id={id} type="checkbox" checked={isChecked} onChange={onChange} />
            <span className="slider round"></span>
        </label>
    )
}