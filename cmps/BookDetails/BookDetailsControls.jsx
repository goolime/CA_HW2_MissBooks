import { Switch } from "../switch.jsx"

const { useNavigate } = ReactRouterDOM

export function BookDetailsControls({ editMode, onChangeEditMode }) {
    const navigate = useNavigate()

    const handleBackClick = () => {
        navigate('/book')
    }

    return (
        <div className="book-details-controls">
            <img src={"./assets/img/ArrowBack.png"} alt="Back" onClick={handleBackClick} />
            <div className="edit-toggle">
                <Switch isChecked={editMode} onChange={onChangeEditMode}/>
                <h3 className={editMode ? 'enabled' : ''}>Edit</h3>
            </div>
        </div>
    )
}