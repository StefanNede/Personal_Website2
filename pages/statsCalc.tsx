import {useState} from "react"
import Link from "next/link"
import styles from "../styles/StatsCalc.module.css"

export default function StatsCalc() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>Stats Calculator</h1>
            </div>
            <main>
                <p className={styles.main}>
                    I am a stats calculator
                </p>
            </main>
            <footer className={styles.footer}>
                <Link href="/calculator">back to calculator option page</Link>
                <br />
                <Link href="/">back home</Link>
            </footer>
        </div>
    )
}