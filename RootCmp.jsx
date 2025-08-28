
import { AppHeader } from "./cmps/AppHeader.jsx"
import { Home } from "./pages/Home.jsx"
import { Err404} from "./pages/Err404.jsx"
import { AboutUs } from "./pages/About.jsx"
//import { BookApp } from "./pages/BookApp.jsx"
//import { BookDetails } from "./pages/BookDetails.jsx"
import { InDevelopmet } from "./pages/InDevelopmet.jsx"


const Router = ReactRouterDOM.HashRouter
const { Routes, Route } = ReactRouterDOM

export function RootCmp() {
    return (
        <Router>
            <section className="app main-layout">
                <AppHeader />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/book" element={<InDevelopmet />} />
                        <Route path="/book/:bookId" element={<InDevelopmet />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/*" element={<Err404 />} />
                    </Routes>
                </main>
            </section>
        </Router>
    )
}