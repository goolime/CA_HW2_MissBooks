const {Navigate} = ReactRouterDOM
const {useEffect, useState} = React

export function InDevelopmet() {
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        if (!countdown) return
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        return () => clearTimeout(timer)
    }, [countdown])

    if (!countdown) return <Navigate to="/" />
    
    return (
        <section className="in-development">
            <img src="../assets/img/under-development.png" alt="Under Development" />
            <h2>this page is under development and will be up soon</h2>
            <p>Redirecting to home in {countdown} seconds...</p>
        </section>
    )
}