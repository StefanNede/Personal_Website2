import Link from "next/link"
import styles from '../styles/Cipher.module.css'
import React, { useEffect, useState } from "react"
import LetterFrequencies from "../components/letterFrequencies"
import { getChiSquared } from "../scripts/cipherSolver/chiSquared"
import { getIoc } from "../scripts/cipherSolver/ioc"
import { getCaesarDecode } from "../scripts/cipherSolver/caesar"
import { getSubstitutionDecode } from "../scripts/cipherSolver/substitution"
import { getAffineDecode } from "../scripts/cipherSolver/affine"
import { getPolybiusDecode } from "../scripts/cipherSolver/polybius"
import { getAtbashDecode } from "../scripts/cipherSolver/atbash"
import { getAlbamDecode } from "../scripts/cipherSolver/albam"
import { getFrequencies } from "../scripts/cipherSolver/chiSquared"
import { formatString } from "../scripts/cipherSolver/formatString"
import { getLikelyCipher } from "../scripts/cipherSolver/likelyCipher"

export default function CipherSolver() {
    const [encoded, setEncoded] = useState("")
    const [decoded, setDecoded] = useState("")
    const [selectedCipher, setSelectedCipher] = useState("caesar")
    const [keyUsed, setKeyUsed] = useState("")
    const [ioc, setIoc] = useState(0)
    const [chi, setChi] = useState(0) 
    const [textLength, setTextLength] = useState(0) 
    const [textLength2, setTextLength2] = useState(0) 
    const [likelyCipher, setLikelyCipher] = useState("") 
    const [frequencies, setFrequencies] = useState(new Map())

    useEffect(() => {
        setChi(getChiSquared(encoded))
        setIoc(getIoc(encoded))
        setTextLength(encoded.length)
        setTextLength2(formatString(encoded).length)
        setLikelyCipher(getLikelyCipher())
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
                <div><Link href="/" className="return">back home</Link></div>
            </div>
            <main className={styles.main}>
                <div className={styles.left}>
                    <h3>ANALYSIS</h3>
                    <div className={styles.analysis}>
                        <p>chi: {chi}</p>
                        <p>ioc: {ioc}</p>
                        <p>text length: {textLength}</p>
                        <p>text length(just letters): {textLength2}</p>
                        <p>likely cipher: {likelyCipher}</p>
                        <div className={styles.letterTable}>
                            <LetterFrequencies frequ={frequencies}/>
                        </div>
                    </div>
                </div>
                
                <div className={styles.center}>
                    <h3>CODE</h3>
                    <div className={styles.inputCode}>
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
                    </div>
                    <div className={styles.decodedText}>
                        <p>Decoded text:</p>
                        <textarea className={styles.decodedInput} placeholder="decoded cipher here..." value={decoded} readOnly/>
                    </div>
                </div>

                <div className={styles.right}>
                    <h3>OTHER</h3>
                    <div className={styles.cipherSelect}>
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
                    </div>
                    <div className={styles.keyUsedWrapper}>Key used:<div className={styles.keyUsed}>{keyUsed}</div></div>
                </div>
            </main>
        </div>
    )
}