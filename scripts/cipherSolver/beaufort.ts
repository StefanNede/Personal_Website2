import { trigramFitness } from "./fitness"
import { formatString } from "./formatString"
import { getColumns, getPeriodIOC, getPeriodLRS } from "./period"
import { alphabet } from "./alphabet"

const reverseAlphabet:Array<string> = ['z', 'y', 'x', 'w', 'v', 'u', 't', 's', 'r', 'q', 'p', 'o', 'n', 'm', 'l', 'k', 'j', 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']

// caesar with inverse alphabet part
const getBCaesarScore = (text:string):number => {
    // use this because for some weird english strings chi squared won't be a good judge
    const frequentLetters:string = "etaoin"
    const infrequentLetters:string = "vkjxqz"
    let score:number = 0
    for (let letter of text) {
        if (frequentLetters.includes(letter)) {
            score++
        } else if (infrequentLetters.includes(letter)) {
            score--
        }
    }
    return score
}

const getBCaesarDecode = (text:string):Array<any> => {
    text = text.toLowerCase()
    let key:number = 0
    let highestRating:number = -1
    let solvedCode:string = ""

    // get the key that gives the highest english rating
    for (let i=0;i<26;i++) {
        let res:string = ""
        for (let char of text) {
            if (alphabet.includes(char)) {
                // have to write that waffle because javascript returns the negative modulo
                // e.g. -1mod26 -> -1
                char = reverseAlphabet[(((alphabet.indexOf(char)-i)%26)+26)%26]
            }
            res += char
        }
        let currentRating:number = getBCaesarScore(res)
        if (currentRating > highestRating) {
            key = i
            highestRating = currentRating
            solvedCode = res
        }

    }
    
    return [key,solvedCode.toUpperCase()]
}

// beaufort part 
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
        let decodedColumn = getBCaesarDecode(column)[1]
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

export const getBeaufortDecode = (text:string):any[] => {
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