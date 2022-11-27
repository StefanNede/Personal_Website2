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
import { getStats, getLongestSubstrings, getFactorsCommon } from "../scripts/cipherSolver/stats"
import { getVigenereDecode } from "../scripts/cipherSolver/vigenere"
import { getTransSimpleDecode } from "../scripts/cipherSolver/transSimple"
import { decodeMorse } from "../scripts/cipherSolver/morse"
import { decodeWigWag } from "../scripts/cipherSolver/wigwag"
import { getRailfenceDecode } from "../scripts/cipherSolver/railFence"

export default function CipherSolver() {
    const [encoded, setEncoded] = useState("")
    const [decoded, setDecoded] = useState("")
    const [selectedCipher, setSelectedCipher] = useState("caesar")
    const [keyUsed, setKeyUsed] = useState<string | JSX.Element[]>("")
    const [ioc, setIoc] = useState(0)
    const [chi, setChi] = useState(0) 
    const [textLength, setTextLength] = useState(0) 
    const [textLength2, setTextLength2] = useState(0) 
    const [likelyCipher, setLikelyCipher] = useState("") 
    const [frequencies, setFrequencies] = useState(new Map())
    const [buttonPressed, setButtonPressed] = useState(1)
    const [speedPrecision, setSpeedPrecision] = useState("speed")

    useEffect(() => {
        setChi(getChiSquared(encoded))
        setIoc(getIoc(encoded))
        setTextLength(encoded.length)
        setTextLength2(formatString(encoded).length)
        setLikelyCipher(getLikelyCipher(ioc, chi))
    }, [encoded])
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFrequencies(getFrequencies(formatString(encoded)))
        setLikelyCipher(getLikelyCipher(ioc, chi))
        if (buttonPressed === 1) {
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
                        res = getSubstitutionDecode(encoded, speedPrecision)
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
                    case "transpositionS":
                        res = getTransSimpleDecode(encoded)
                        decodedText = res[1]
                        keyUsed = res[0]
                        setDecoded(decodedText)
                        setKeyUsed(keyUsed)
                        break
                    case "transpositionC":
                        break
                    case "vigenere":
                        res = getVigenereDecode(encoded)
                        decodedText = res[1]
                        keyUsed = res[0]
                        setDecoded(decodedText)
                        setKeyUsed(keyUsed)
                        break
                    case "railFence":
                        res = getRailfenceDecode(encoded)
                        decodedText = res[1]
                        keyUsed = res[0]
                        setDecoded(decodedText)
                        setKeyUsed(keyUsed)
                        break
                    case "transRows":
                        alert("this feature is not ready yet")
                        break
                    case "transCols":
                        alert("this feature is not ready yet")
                        break
                    case "polybius":
                        res = getPolybiusDecode(encoded, speedPrecision)
                        decodedText = res[1]
                        keyUsed = res[0]
                        let resKeyEls:JSX.Element[] = []
                        for (let key of keyUsed) {
                            resKeyEls.push(<div>{key}</div>)
                        }
                        setDecoded(decodedText)
                        setKeyUsed(resKeyEls)
                        break
                    case "morse":
                        res = decodeMorse(encoded)
                        decodedText = res[1]
                        setDecoded(decodedText)
                        break
                    case "wigwag":
                        res = decodeWigWag(encoded)
                        decodedText = res[1]
                        setDecoded(decodedText)
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
        } else if (buttonPressed === 2) {
            if (encoded.length < 1) {
                alert("no encoded text was entered")
            } else {
                let res:any[][] = getLongestSubstrings(encoded)
                let resString:string = "STATS:\n"
                let allGaps:number[] = [] // stores all the unique gaps between longest repeating substrings
                let gapCounts:Map<number,number> = new Map() // to make sure we don't add duplicate gaps to allGaps
                resString += "\nLongest repeating substrings:"
                for (let r of res) {
                    let substr = r[0]
                    let length = r[1]
                    let positions:number[] = r[2]
                    let gaps:number[] = r[3]
                    for (let gap of gaps) { 
                        if (gapCounts.get(gap) === undefined) {
                            allGaps.push(gap) 
                            gapCounts.set(gap, 1)
                        }
                    }
                    let positionsJoined:string = positions.join(', ')
                    let gapsJoined:string = gaps.join(', ')
                    resString += `\n${substr}  \t ${length} chars \t positions: ${positionsJoined}    \t gaps: ${gapsJoined}`
                }
                // factors common to unique gaps between longest repeating substrings
                let factorsCommon = getFactorsCommon(allGaps)
                resString += `\n\nFactors common to unique gaps between longest repeating substrings: \n${factorsCommon}\n`
                resString += "\n(analysis section updated)"
                setDecoded(resString)
                setLikelyCipher(getLikelyCipher(ioc, chi))
            }
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
                            <div className={styles.submitBtnsWrapper}>
                                <input className={styles.submitBtn} type="submit" value="Decode" onClick = {() => {setButtonPressed(1)}} />
                                <input className={styles.submitBtn} type="submit" value="Get Stats" onClick = {() => {setButtonPressed(2)}} />
                            </div>
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
                            <option value="transpositionS">transposition (simple)</option>
                            <option value="transpositionC">transposition (columns)</option>
                            <option value="vigenere">vigenere</option>
                            <option value="railFence">rail fence</option>
                            <option value="transRows">extract transposition rows</option>
                            <option value="transCols">extract transposition columns</option>
                            <option value="polybius">polybius</option>
                            <option value="morse">morse</option>
                            <option value="wigwag">wig wag - flag signals</option>
                            <option value="unknown">unknown</option>
                        </select>
                    </div>
                    <label className={styles.speedPrecision}>
                        <div>
                        <label htmlFor="myCheck">speed</label> 
                        {(speedPrecision === "speed") ?
                            <input type="radio" id="myCheck" checked={true} onChange={ () => {setSpeedPrecision("speed")}}/>
                            :
                            <input type="radio" id="myCheck" checked={false} onChange={ () => {setSpeedPrecision("speed")}}/>

                        }
                        </div>
                        <div>
                            <label htmlFor="myCheck">precision</label> 
                            {(speedPrecision === "precision") ?
                                <input type="radio" id="myCheck" checked={true} onChange={ () => {setSpeedPrecision("precision")}}/>
                                :
                                <input type="radio" id="myCheck" checked={false} onChange={ () => {setSpeedPrecision("precision")}}/>
                            }
                        </div>
                    </label>
                    <div className={styles.keyUsedWrapper}>Key used:<div className={styles.keyUsed}>{keyUsed}</div></div>
                </div>
            </main>
        </div>
    )
}