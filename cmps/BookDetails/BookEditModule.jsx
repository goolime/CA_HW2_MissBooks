
export function BookEditModule({ book }) {
    return (
        <section className="book-edit">
            <h2>Edit Book</h2>
            <form>
                <input type="text" defaultValue={book.title} />
                <input type="text" defaultValue={book.author} />
                <button>Save</button>
            </form>
        </section>
    )
}