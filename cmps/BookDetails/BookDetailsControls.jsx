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
                <label className="switch">
                    <input type="checkbox" checked={editMode} onChange={onChangeEditMode} />
                    <span className="slider round"></span>
                </label>
                <h3 className={editMode ? 'enabled' : ''}>Edit</h3>
            </div>
        </div>
    )
}