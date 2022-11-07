import Link from "next/link"
import styles from "../styles/Calc.module.css"

export default function StatsCalc() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>Choose your calculator</h1>
            </div>
            <main className={styles.main}>
                <p>
                   here is a calculator :0
                </p>
                <Link href="/normalCalc"><div style={{textDecoration:"underline"}}>Normal Calculator</div></Link>
                <Link href="/statsCalc"><div style={{textDecoration:"underline"}}>Stats Calculator</div></Link>
            </main>
            <footer className={styles.footer}>
                <Link href="/" className="return">back home</Link>
            </footer>
        </div>
    )
}