import { getCaesarDecode } from "./caesar"
import { trigramFitness } from "./fitness"
import { formatString } from "./formatString"
import { getColumns, getPeriodIOC, getPeriodLRS } from "./period"

const applyPeriod = (text:string, period:number):string => {
    let decoded:string = ""
    let columns:string[] = []
    let resColumns:string[] = []
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
        let decodedColumn = getCaesarDecode(column)[1]
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

    return decoded
}

export const getVigenereDecode = (text:string):any[] => {
    let decoded:string = ""
    let period:number = 0
    let periods:number[] = getPeriodLRS(text)
    if (periods.length === 0) {
        // we need to use another technique to find the period
        period = getPeriodIOC(text)
        console.log(period)
        decoded = applyPeriod(text, period)
    } else {
        let bestPeriod:number = periods[0]
        let bestDecoded:string = ""
        let bestRating:number = trigramFitness(text)
        for (let period of periods) {
            let interDecoded:string = applyPeriod(text, period)
            let interFitness:number = trigramFitness(interDecoded)
            if (interFitness > bestRating) {
                bestPeriod = period
                bestDecoded = interDecoded
                bestRating = interFitness
            }
        }
        decoded = bestDecoded
        period = bestPeriod
    }

    return [`Period of ${period}`, decoded.toUpperCase()]
}