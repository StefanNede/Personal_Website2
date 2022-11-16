import Link from "next/link"
import DrawingCanvas from "../components/drawingCanvas"
import styles from '../styles/Draw.module.css'

export default function Draw() {
    return (
        <div className="container">
            <header className={styles.header}>
                <h1>drawing app</h1>
            </header>
            <main className={styles.main}>
                <div className={styles.options}>
                    <button>download</button>
                    <button>share</button>
                </div>
                <div className={styles.canvas}>
                    <DrawingCanvas/>
                </div>
            </main>
            <footer>
                <Link href="/">back home</Link>
            </footer>
        </div>
    )
}