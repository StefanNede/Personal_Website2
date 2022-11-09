import Link from "next/link"
import styles from '../styles/Cipher.module.css'
import React, { useEffect, useState } from "react"
import { getChiSquared } from "./cipherSolver/chiSquared"
import { getCaesarDecode } from "./cipherSolver/caesar"
import { getSubstitutionDecode } from "./cipherSolver/substitution"
import { getAffineDecode } from "./cipherSolver/affine"

export default function CipherSolver() {
    const [encoded, setEncoded] = useState("")
    const [selectedCipher, setSelectedCipher] = useState("caesar")
    const [decoded, setDecoded] = useState("")

    useEffect(() => {
        console.log(getChiSquared('hello'))
    }, [])
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (encoded.length < 1) {
            alert("no encoded text was entered")
        } else{
            let res:string = ''
            switch (selectedCipher) {
                case "caesar":
                    res = getCaesarDecode(encoded)
                    setDecoded(res)
                    break
                case "substitution":
                    res = getSubstitutionDecode(encoded)
                    setDecoded(res)
                    break
                case "affine":
                    res = getAffineDecode(encoded)
                    setDecoded(res)
                    break
                case "unknown":
                    alert("It appears you do not know what cipher is used")
                    break
                default:
                    alert("this website appears to be fucking dogshit")
            }
            console.log(`submitted encoded text is: ${encoded}\n`)
            console.log(`selected cipher is: ${selectedCipher}`)
        }
    }

    const handleCipherChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCipher(event.target.value)
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>Cipher Solver</h1>
            </div>
            <main className={styles.main}>
                <p>
                    I am a cipher solver thingy lol
                </p>
                <form onSubmit={handleSubmit}>
                    <label>
                        Encoded text:
                        <br />
                        <input type="text" value={encoded} 
                            onChange={(e) => setEncoded(e.target.value)} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <select value={selectedCipher} onChange={handleCipherChange}>
                    <option value="caesar">caesar</option>
                    <option value="substitution">substitution</option>
                    <option value="affine">affine</option>
                    <option value="unknown">unknown</option>
                </select>
                <br />
                <div className={styles.decodedText}>
                    <p>Decoded text:</p>
                    <p>{decoded}</p>
                </div>
            </main>
            <footer className={styles.footer}>
                <Link href="/" className="return">back home</Link>
            </footer>
        </div>
    )
}