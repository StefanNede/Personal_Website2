import Link from "next/link"
import styles from '../styles/Cipher.module.css'

export default function CipherSolver() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>Cipher Solver</h1>
            </div>
            <main className={styles.main}>
                <p>
                    I am a cipher solver thingy lol
                </p>
            </main>
            <footer className={styles.footer}>
                <Link href="/" className="return">back home</Link>
            </footer>
        </div>
    )
}