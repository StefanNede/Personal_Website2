import Link from "next/link"
import styles from "../styles/CodeEditor.module.css"

export default function CodeEditor() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>Code Editor</h1>
            </div>
            <main className={styles.main}>
                <p>write code here</p>
            </main>
            <footer className={styles.footer}>
                <Link href="/">back home</Link>
            </footer>
        </div>
    )
}