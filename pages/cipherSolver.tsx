import Link from "next/link"
import styles from '../styles/Cipher.module.css'
import React, { useEffect, useState } from "react"
import { getChiSquared } from "./cipherSolver/chiSquared"
import { getIoc } from "./cipherSolver/ioc"
import { getCaesarDecode } from "./cipherSolver/caesar"
import { getSubstitutionDecode } from "./cipherSolver/substitution"
import { getAffineDecode } from "./cipherSolver/affine"

export default function CipherSolver() {
    const [encoded, setEncoded] = useState("")
    const [decoded, setDecoded] = useState("")
    const [selectedCipher, setSelectedCipher] = useState("caesar")
    const [keyUsed, setKeyUsed] = useState(0)
    const [ioc, setIoc] = useState(0)
    const [chi, setChi] = useState(0) 

    useEffect(() => {
        setChi(getChiSquared(encoded))
        setIoc(getIoc(encoded))
    }, [encoded])
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (encoded.length < 1) {
            alert("no encoded text was entered")
        } else{
            let res:Array<any> = []
            let decodedText:string = ''
            let keyUsed:any = 0
            switch (selectedCipher) {
                case "caesar":
                    res = getCaesarDecode(encoded)
                    decodedText= res[1]
                    keyUsed = res[0]
                    setDecoded(decodedText)
                    setKeyUsed(keyUsed) 
                    break
                case "substitution":
                    res = getSubstitutionDecode(encoded)
                    decodedText= res[1]
                    keyUsed= res[0]
                    setDecoded(decodedText)
                    setKeyUsed(keyUsed) 
                    break
                case "affine":
                    res = getAffineDecode(encoded)
                    decodedText = res[1]
                    keyUsed = res[0]
                    console.log(keyUsed)
                    setDecoded(decodedText)
                    setKeyUsed(keyUsed) 
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
                <p>chi: {chi}</p>
                <p>ioc: {ioc}</p>
                <select value={selectedCipher} onChange={handleCipherChange}>
                    <option value="caesar">caesar</option>
                    <option value="substitution">substitution</option>
                    <option value="affine">affine</option>
                    <option value="vigenere">vigenere</option>
                    <option value="railFence">rail fence</option>
                    <option value="unknown">unknown</option>
                </select>
                <form onSubmit={handleSubmit}>
                    <label>
                        Encoded text:
                        <br />
                        <textarea className={styles.encodedInput} placeholder="write encoded cipher here..." value={encoded} 
                            onChange={(e) => setEncoded(e.target.value)} />
                    </label>
                    <br />
                    <input type="submit" value="Submit" />
                </form>
                <br />
                <div className={styles.decodedText}>
                    <p>Decoded text:</p>
                    <p>Key used: {keyUsed}</p>
                    <textarea className={styles.decodedInput} placeholder="decoded cipher here..." value={decoded} readOnly/>
                </div>
            </main>
            <footer className={styles.footer}>
                <Link href="/" className="return">back home</Link>
            </footer>
        </div>
    )
}