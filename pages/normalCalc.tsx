import {useState} from "react"
import Link from "next/link"
import styles from "../styles/NormalCalc.module.css"
import {NumberPad} from "./components/numberPad"

export default function NormalCalc() {
    const [count, setCount] = useState(0);
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>Normal Calculator</h1>
            </div>
            <main className={styles.main}>
                <p> 
                    I am a normal  calculator
                </p>
                <button onClick={() => setCount(count+1)}>{count}</button>
                <NumberPad num={count}/>
            </main>
            <footer className={styles.footer}>
                <Link href="/calculator">back to calculator option page</Link>
                <br />
                <Link href="/">back home</Link>
            </footer>
        </div>
    )
}