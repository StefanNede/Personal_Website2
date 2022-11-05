import Link from "next/link"
import styles from "../styles/Projects.module.css"

export default function Projects() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>Projects</h1>
            </div>
            <main className={styles.main}>
                <p>
                   here are my projects 
                </p>
            </main>
            <footer className={styles.footer}>
                <Link href="/" className="return">back home</Link>
            </footer>
        </div>
        
    )
}