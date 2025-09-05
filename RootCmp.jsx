
import { AppHeader } from "./cmps/AppHeader.jsx"
import { Home } from "./pages/Home.jsx"
import { Err404} from "./pages/Err404.jsx"
import { AboutUs } from "./pages/About.jsx"
import { BookApp } from "./pages/BookApp.jsx"
import { BookDetails } from "./pages/BookDetails.jsx"
import { InDevelopmet } from "./pages/InDevelopmet.jsx"
import { AddBook } from "./pages/Add.jsx"
import { AddBookManual } from "./pages/AddManual.jsx"
import { ImportBook } from "./pages/ImportBook.jsx"
import { UserMsg } from "./cmps/UserMsg.jsx"


const Router = ReactRouterDOM.HashRouter
const { Routes, Route } = ReactRouterDOM

export function RootCmp() {
    return (
        <Router>
            <section className="app main-layout">
                <UserMsg />
                <AppHeader />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/book" element={<BookApp />} />
                        <Route path="/book/:bookId" element={<BookDetails />}/>
                        <Route path="/book/add" element={<AddBook/>}>
                            <Route path="/book/add/manual" element={<AddBookManual/>}/>
                            <Route path="/book/add/import" element={<ImportBook/>}/>
                        </Route>
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/*" element={<Err404 />} />
                    </Routes>
                </main>
            </section>
        </Router>
    )
}

