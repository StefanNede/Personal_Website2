import { getCaesarDecode } from "./caesar"
import { trigramFitness } from "./fitness"
import { alphabet } from "./alphabet"
import { formatString } from "./formatString"
import { getColumns, getPeriodIOC, getPeriodLRS } from "./period"

const applyPeriod = (text:string, period:number):any[] => {
    let decoded:string = ""
    let columns:string[] = []
    let resColumns:string[] = []
    let caesarKeysUsed:number[] = []
    for (let k=0;k<period;k++) {
        resColumns.push("")
    }

    text = formatString(text)
    let interText:string = text
    while (interText.length%period !== 0) {
        interText += " "
    }

    columns = getColumns(text, period)

    // apply caesar shift
    for (let j=0;j<columns.length;j++) {
        let column:string = columns[j]
        let caesarDecode = getCaesarDecode(column)
        let cKeyUsed = caesarDecode[0]
        let decodedColumn = caesarDecode[1]
        caesarKeysUsed.push(cKeyUsed)
        resColumns[j] = decodedColumn
    }

    // recompile columns
    for (let l=0;l<interText.length/period;l++){
        let row:string = ""
        for (let column of resColumns) {
            row += column[l]
        }
        decoded += row
    }

    return [decoded, caesarKeysUsed]
}

const getWordKey = (numberKey:number[]):string => {
    let res:string = ""
    for (let num of numberKey) {
        res += alphabet[num]
    }
    return res
}

export const getVigenereDecode = (text:string):any[] => {
    let decoded:string = ""
    let period:number = 0
    let periods:number[] = getPeriodLRS(text)
    let decodedKeys:number[] = []
    if (periods.length === 0) {
        // we need to use another technique to find the period
        period = getPeriodIOC(text)
        console.log(period)
        let decodedData = applyPeriod(text, period)
        decoded = decodedData[0]
        decodedKeys = decodedData[1]
    } else {
        let bestPeriod:number = periods[0]
        let bestDecoded:string = ""
        let bestRating:number = trigramFitness(text)
        for (let period of periods) {
            let decodedData = applyPeriod(text, period)
            let interDecoded:string = decodedData[0]
            let interKeys = decodedData[1]
            let interFitness:number = trigramFitness(interDecoded)
            if (interFitness > bestRating) {
                bestPeriod = period
                bestDecoded = interDecoded
                bestRating = interFitness
                decodedKeys = interKeys
            }
        }
        decoded = bestDecoded
        period = bestPeriod
    }

    console.log(getWordKey(decodedKeys))

    return [[`Period of ${period}`,`${getWordKey(decodedKeys).toUpperCase()}`], decoded.toUpperCase()]
}