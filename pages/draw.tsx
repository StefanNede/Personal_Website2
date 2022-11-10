import Link from "next/link"

export default function Draw() {
    return (
        <div className="container">
            <main>

                <p>you can draw here</p>
            </main>
            <footer>
                <Link href="/">back home</Link>
            </footer>
        </div>
    )
}