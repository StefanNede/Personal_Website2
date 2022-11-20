import { getCaesarDecode } from "./caesar"
import { alphabet } from "./alphabet"
import { getLongestSubstrings, getFactorsCommon } from "./stats"
import { trigramFitness } from "./fitness"
import { formatString } from "./formatString"

const getPeriodLRS = (text:string):number[] => {
    let lrs:any[][] = getLongestSubstrings(text)
    let allGaps:number[] = []
    let gapCounts:Map<number,number> = new Map() // to make sure we don't add duplicate gaps to allGaps
    // get all the distinct gaps
    for (let r of lrs) {
        let gaps:number[] = r[3]
        for (let gap of gaps) { 
            if (gapCounts.get(gap) === undefined) {
                allGaps.push(gap) 
                gapCounts.set(gap, 1)
            }
        }
    }
    let periods:number[] = getFactorsCommon(allGaps)
    return periods
}

const getPeriodTwist = (text:string):number => {
    // uses the twist method published by Barr and Simoson in 2015
    return 0
}

const applyPeriod = (text:string, period:number):string => {
    let decoded:string = ""
    let columns:string[] = []
    let resColumns:string[] = []
    for (let k=0;k<period;k++) {
        columns.push("")
        resColumns.push("")
    }

    text = formatString(text)
    let interText:string = text
    while (interText.length%period !== 0) {
        interText += " "
    }

    // get columns
    for (let i=0;i<=interText.length-period;i+=period) {
        let row:string = interText.substring(i, i+period)
        for (let j=0;j<row.length;j++) {
            columns[j] += row[j]
        }
    }

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