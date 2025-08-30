
const { useNavigate } = ReactRouterDOM;

export function BookDetailsFooter( { booknext, bookprev } ) {
    const navigate = useNavigate();

    return (
        <footer className="book-details-footer"> 
            <section className="actions">
                <img src={"./assets/img/ArrowBack.png"} alt="Back" onClick={() => navigate(`/book/${bookprev}`)} />
                <img src={"./assets/img/ArrowForward.png"} alt="Next" onClick={() => navigate(`/book/${booknext}`)} />
            </section>
        </footer>
    )
}
