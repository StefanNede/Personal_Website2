import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Landing from './landing'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>neommm</title>
        <meta name="description" content="Stefan Nedelcu personal website" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className={styles.main}>
        <Landing/> 
      </main>

      <footer className={styles.footer}>
        • copyright Stefan Nedelcu •
      </footer>
    </div>
  )
}
