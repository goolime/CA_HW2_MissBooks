
const {Navigate} = ReactRouterDOM
const {useEffect, useState} = React

export function Err404() {
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        if (!countdown) return
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        return () => clearTimeout(timer)
    }, [countdown])

    if (!countdown) return <Navigate to="/" />
    
    return (
        <section className="err404">
            <h1>☹</h1>
            <h2>404 - Page Not Found!</h2>
            <p>Redirecting to home in {countdown} seconds...</p>
        </section>
    )
}