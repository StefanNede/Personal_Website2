import { getFactorsCommon } from "./stats"
import { formatString } from "./formatString"
import { getColumns } from "./transData"
import { getTransSimpleDecode } from "./transSimple"
import { trigramFitness } from "./fitness"

export const getTransColumnDecode = (text:string) => {
    // try all the factors of the length of the text to get the rows
    // then run simple transposition on the rows and read them off
    // unfortunately this method does not work all the time :(
    text = formatString(text)
    text = text.toUpperCase()
    let decoded:string = ""
    let bestFitness:number = 0
    let key:string = ""
    let lengthFactors:number[] = getFactorsCommon([text.length])
    for (let lengthFactor of lengthFactors) {
        let columns:string[] = getColumns(text, lengthFactor)
        let interRes:string[] = getTransSimpleDecode(columns.join(""))
        let interKey = interRes[0]
        let interDecoded:string = interRes[1]
        let interFitness:number = trigramFitness(interDecoded)
        if (interFitness > bestFitness || bestFitness === 0) {
            console.log(lengthFactor)
            bestFitness = interFitness
            decoded = interDecoded 
            key = interKey
        }
    }
    return [key, decoded]
}