import Link from "next/link"
import styles from '../styles/Cipher.module.css'
import React, { useEffect, useState } from "react"
import LetterFrequencies from "./components/letterFrequencies"
import { getChiSquared } from "./cipherSolver/chiSquared"
import { getIoc } from "./cipherSolver/ioc"
import { getCaesarDecode } from "./cipherSolver/caesar"
import { getSubstitutionDecode } from "./cipherSolver/substitution"
import { getAffineDecode } from "./cipherSolver/affine"
import { getPolybiusDecode } from "./cipherSolver/polybius"
import { getAtbashDecode } from "./cipherSolver/atbash"
import { getAlbamDecode } from "./cipherSolver/albam"
import { getFrequencies } from "./cipherSolver/chiSquared"
import { formatString } from "./cipherSolver/formatString"

export default function CipherSolver() {
    const [encoded, setEncoded] = useState("")
    const [decoded, setDecoded] = useState("")
    const [selectedCipher, setSelectedCipher] = useState("caesar")
    const [keyUsed, setKeyUsed] = useState("")
    const [ioc, setIoc] = useState(0)
    const [chi, setChi] = useState(0) 
    const [frequencies, setFrequencies] = useState(new Map())

    useEffect(() => {
        setChi(getChiSquared(encoded))
        setIoc(getIoc(encoded))
    }, [encoded])
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFrequencies(getFrequencies(formatString(encoded)))
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
                    setDecoded(decodedText)
                    setKeyUsed(keyUsed) 
                    break
                case "atbash":
                    res = getAtbashDecode(encoded)
                    decodedText = res[1]
                    keyUsed = res[0]
                    setDecoded(decodedText)
                    setKeyUsed(keyUsed) 
                    break
                case "albam":
                    res = getAlbamDecode(encoded)
                    decodedText = res[1]
                    keyUsed = res[0]
                    setDecoded(decodedText)
                    setKeyUsed(keyUsed) 
                    break
                case "polybius":
                    res = getPolybiusDecode(encoded)
                    decodedText = res[1]
                    keyUsed = res[0]
                    setDecoded(decodedText)
                    setKeyUsed(keyUsed) 
                    break
                case "stats":
                    setDecoded("")
                    setKeyUsed("")
                    break
                case "unknown":
                    alert("It appears you do not know what cipher is used")
                    break
                default:
                    alert("this website appears to be fucking dogshit")
            }
            //console.log(`submitted encoded text is: ${encoded}\n`)
            //console.log(`selected cipher is: ${selectedCipher}`)
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
                <LetterFrequencies frequ={frequencies}/>
                <select value={selectedCipher} onChange={handleCipherChange}>
                    <option value="caesar">caesar</option>
                    <option value="affine">affine</option>
                    <option value="atbash">atbash</option>
                    <option value="albam">albam</option>
                    <option value="substitution">substitution</option>
                    <option value="polybius">polybius</option>
                    <option value="vigenere">vigenere</option>
                    <option value="railFence">rail fence</option>
                    <option value="unknown">unknown</option>
                    <option value="stats">stats</option>
                </select>
                <form onSubmit={handleSubmit}>
                    <label>
                        Encoded text:
                        <br />
                        <textarea className={styles.encodedInput} placeholder="write encoded cipher here..." value={encoded} 
                            onChange={(e) => setEncoded(e.target.value)} />
                    </label>
                    <br />
                    <input className={styles.submitBtn} type="submit" value="Submit" />
                </form>
                <br />
                <div className={styles.decodedText}>
                    <p>Decoded text:</p>
                    <p>Key used: <br/>{keyUsed}</p>
                    <textarea className={styles.decodedInput} placeholder="decoded cipher here..." value={decoded} readOnly/>
                </div>
            </main>
            <footer className={styles.footer}>
                <Link href="/" className="return">back home</Link>
            </footer>
        </div>
    )
}