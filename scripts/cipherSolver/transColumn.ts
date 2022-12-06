import { getFactorsCommon } from "./stats"
import { formatString } from "./formatString"
import { getColumns, getRows } from "./transData"
import { getTransSimpleDecode } from "./transSimple"
import { bigramFitness, trigramFitness } from "./fitness"

const getBigRatingFromCols = (rows:string[], arrangement:number[]):number => {
    let res:number = 0
    for (let row of rows) {
        let bigr:string = row[arrangement[0]-1] + row[arrangement[1]-1]
        if (bigr.length >= 1) {
            res += bigramFitness(bigr)
        }
    }
    return res
}

const compileArrangements = (arrangements:Map<number, number>, worstCol:number, targetLength:number):number[] => {
    // place the number with the worst pairing score at the end of res, as it is likely not followed by any of the columns 
    // then look for the one that has that as a target and place that before it
    // continue in this look for target and place key way until the resKey is length of arrangement.keys
    let resKey:number[] = [worstCol]
    while (resKey.length < targetLength) {
        let startLength:number = resKey.length
        // get the arrangement pair that points to the first index in resKey and add it in the left side of resKey
        for (let [key, value] of arrangements) {
            if (value === resKey[0] && !resKey.includes(key)) {
                resKey.unshift(key)
                break
            }
        }
        if (resKey.length === startLength) {
            // there are no matches for the thing that should be last in the resKey
            // the cipher is not simple transposisition or a different length key is the right one
            return [0]
        }
    }
    return resKey
}

const decrementArray = (arr:number[]):number[] => {
    // decrements every value in an array
    let resArray:number[] = []
    for (let num of arr) {
        resArray.push(num-1)
    }
    return resArray
}

const getDecoded = (rows:string[], key:number[]):string => {
    let decoded:string = "" 
    for (let row of rows) {
        let resRow:string[] = Array<string>(row.length)
        for (let i=0; i<row.length;i++) {
            resRow[i] = row[key[i]]
        }
        decoded += resRow.join("")
    }
    return decoded
}

const transSimpleMod = (text:string, rowLength:number):any[] => {
    // console.log(text, rowLength)
    // using the bigram method
    text = formatString(text)
    text = text.toUpperCase()
    let decoded:string = ""
    let key:number[] = []
    let bestFitness:number = -1000000

    let rows:string[] = getRows(text, rowLength)
    let worstColumnArrangementScore:number = 0
    let worstColumn:number = 1
    // stores 1:2, 2:5 ... meaning 1 is followed by 2 and 2 by 5
    let columnArrangement:Map<number, number> = new Map()
    for (let column1=1; column1<=rowLength;column1++) {
        // try all possibilities for pairing with column k
        let bestColRating:number = -10000000000
        let arrangement:number[] = []
        for (let column2=1; column2<=rowLength; column2++) {
            if (column1 !== column2) { 
                let interRating:number = getBigRatingFromCols(rows, [column1, column2])
                if (interRating > bestColRating) {
                    bestColRating = interRating
                    arrangement = [column1, column2]
                }
            }
        }
        if (worstColumnArrangementScore === 0) {
            // if hasn't been initialised
            worstColumnArrangementScore = bestColRating
            worstColumn = column1
        } else if (bestColRating < worstColumnArrangementScore) {
            worstColumnArrangementScore = bestColRating
            worstColumn = column1
        }
        columnArrangement.set(arrangement[0], arrangement[1])
    }
    // get compiled key
    let compiledKey:number[] = compileArrangements(columnArrangement, worstColumn, rowLength)
    if (compiledKey.length !== 1) {
        compiledKey = decrementArray(compiledKey)
        let interDecoded:string = getDecoded(rows, compiledKey)
        let interFitness = trigramFitness(interDecoded)
        if (interFitness > bestFitness) {
            bestFitness = interFitness
            decoded = interDecoded
            key = compiledKey
        }
    }

    return [`${key}`, decoded.toUpperCase()]
}

const getRowMod = (text:string, numColumns:number):string[] => {
    let rows:string[] = []
    let rowLength:number = Math.floor(text.length/numColumns)
    // issue is if the cipher does not divide evenly, then you don't know on which column the left-over characters should go

    return rows
}

export const getTransColumnDecode = (text:string) => {
    // try different keys to get rows 
    // then run simple transposition on the rows and read them off
    text = formatString(text)
    text = text.toUpperCase()
    let decoded:string = ""
    let bestFitness:number = 0
    let key:string = ""
    // let lengthFactors:number[] = getFactorsCommon([text.length])
    for (let i =2; i<20; i++) {
        // console.log(text.length)
        let columns:string[] = getColumns(text, i)
        // console.log(columns)
        let interRes:string[] = transSimpleMod(columns.join(""), columns[0].length)
        // console.log(interRes)
        let interKey = interRes[0]
        let interDecoded:string = interRes[1]
        let interFitness:number = trigramFitness(interDecoded)
        if (interFitness !== 0 && interFitness > bestFitness || bestFitness === 0) {
            bestFitness = interFitness
            decoded = interDecoded 
            key = interKey
        }
        // console.log(bestFitness, decoded)
    }
    return [key, decoded]
}