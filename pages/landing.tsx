import {useState, useEffect} from "react";
import Link from 'next/link';
import styles from '../styles/Landing.module.css'

export default function Landing() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        console.log("count has changed"); 
    }, [count])
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>neommm</h1>
                <div className={styles.nav}>
                    <ul>
                        <Link href= "/cipherSolver"><div className="nav_elements cipher_solver_link">cipher solver</div></Link>
                        <Link href="/calculator"><div className="nav_elements stats_calc_link">calculator</div></Link>
                        <Link href="/snakeGame"><div className="nav_elements project_link">snake game</div></Link>
                        <Link href="/draw"><div className="nav_elements project_link">draw</div></Link>
                        <Link href="/projects"><div className="nav_elements project_link">projects</div></Link>
                    </ul>
                </div>
            </header>
            <button className={styles.counter} onClick={() => setCount(count+1)}>{count}</button>
        </div>
    )
}
