import { useState, useEffect } from "react"
import { alphabet } from "../scripts/cipherSolver/alphabet"
import styles from "../styles/LetterFrequ.module.css"

interface Props {
    frequ: Map<string, number>
}

const LetterFrequencies:React.FC<Props> = ({frequ}) => {
    // default array has 26 0s for each of the 26 letters
    const [rows, setRows] = useState<JSX.Element[] | null>(null)

    let counts:Array<number> = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    const changeCounts = () => {
        // go through frequ and set states 
        frequ.forEach((count, letter) => {
            counts[alphabet.indexOf(letter)] = count
        })
    }

    const getCountRows = () => {
        let bufferRows:Array<JSX.Element> = []
        for (let i=0; i< (counts.length/2);i++) {
            bufferRows.push(<tr key={i}>
                        <td className={styles.td}>{alphabet[i]}</td>
                        <td className={styles.td}>{counts[i]}</td>
                        <td className={styles.td}>{alphabet[13+i]}</td>
                        <td className={styles.td}>{counts[13+i]}</td>
                    </tr>)
        }
        setRows(bufferRows)
    }
    
    useEffect(() => {
        changeCounts()
        getCountRows()
    }, [frequ])

    return (
        <div>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <th className={styles.th}>letter</th>
                        <th className={styles.th}>frequency</th>
                        <th className={styles.th}>letter</th>
                        <th className={styles.th}>frequency</th>
                    </tr>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}

export default LetterFrequencies