import {AddHeader} from '../cmps/BookAdd/header.jsx'
const { Outlet,Link, NavLink } = ReactRouterDOM

export function AddBook(){

    return (
        <div>          
            <AddHeader/>
            <div className='add-body' >
                <Outlet />
            </div>
        </div>
    )
}