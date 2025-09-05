const { NavLink } = ReactRouterDOM

export function AddHeader(){
    return (
        <div className="book-add-header">
            <h1>ADD BOOK</h1>
            <div className="links">
                <NavLink to='/book/add/manual'><img src={'./assets/img/add.png' } /></NavLink>
                <NavLink to='/book/add/import'><img src={'./assets/img/import.png'}/></NavLink>
            </div>
        </div>
    )
}