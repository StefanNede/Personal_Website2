import Link from "next/link"
import styles from "../styles/StatsCalc.module.css"

export default function StatsCalc() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>Stats Calculator</h1>
            </div>
            <main className={styles.main}>
                <p>
                   here is a stats calculator :0
                </p>
            </main>
            <footer className={styles.footer}>
                <Link href="/" className="return">back home</Link>
            </footer>
        </div>
    )
}