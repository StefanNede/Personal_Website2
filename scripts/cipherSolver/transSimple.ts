import { formatString } from "./formatString"
import { trigramFitness, bigramFitness } from "./fitness"
import { getRows } from "./transData"

function shuffle(array:number[]):number[] {
    let currentIndex = array.length,  randomIndex
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }
    return array
}

const getRandomParentKey = (period:number):number[] => {
    let parentKey:number[] = []
    for (let i=0;i<period;i++) {
        parentKey.push(i)
    }
    parentKey = shuffle(parentKey)
    return parentKey
}

const rollKey = (key:number[]):number[] => {
    let resKey:number[] = key
    let numRolls:number = Math.floor(Math.random()*key.length)
    for (let i=0;i<numRolls;i++) {
        let toBeRemoved:number = resKey[0]
        resKey = resKey.splice(1) // remove first element
        resKey.push(toBeRemoved)
    }
    return resKey
}

const padText = (text:string, period:number):string => {
    let interText:string = text
    while (interText.length%period !== 0) {
        interText += " "
        break
    }
    return interText
}

const separateByPeriod = (text:string, period:number):string[] => {
    let res:string[] = []
    for (let i=0;i<text.length/period;i+=period) {
        res.push(text.substring(i, i+period))
    }
    return res
}

const decipher = (cipherText:string, period:number, key:number[]):string => {
    let res:string = ""
    let cipherTextList:string[] = separateByPeriod(cipherText, period)
    let decodedTextList:string[] = []
    // apply key
    for (let textList of cipherTextList) {
        let interRes:string[] = []
        // fill interRes
        for (let i=0;i<textList.length;i++) {
            interRes.push("")
        }
        // do the key stuff
        for (let j=0;j<textList.length;j++) {
            interRes[key[j]] = textList[j]
        }
        res += interRes.join("")
    }

    return res
}

const getProbability = (target:number, nums:number) => {
    if (Math.floor(Math.random()*(nums-1)) === target) {
        return true
    } else {
        return false
    }
}

const performHillClimbing = (text:string, period:number):any[] => {
    let decoded:string = ""
    let bestFitness:number = trigramFitness(text)
    let parentKey:number[] = getRandomParentKey(period)
    let counter:number = 0
    while (counter < 110*period) {
        let childKey:number[] = []
        for (let p of parentKey) {
            childKey.push(p)
        }
        let choice:number = Math.floor(Math.random() * 2)
        if (choice === 0) {
            // swap 2 randomly selected elements of the child key
            let random1:number = Math.floor(Math.random()*(childKey.length-1))
            let random2:number = Math.floor(Math.random()*(childKey.length-1))
            let temp:number = childKey[random1]
            childKey[random1] = childKey[random2]
            childKey[random2] = temp
        } else if (choice === 1) {
            //roll the child key a randomly chosen number of steps
            childKey = rollKey(childKey)
        }
        // decipher text with child key
        let interDecoded:string = decipher(text, period, childKey)

        // calculate new fitness
        let interFitness = trigramFitness(interDecoded)

        // margin of 0.15 with probability of 5%
        if (interFitness > bestFitness || (interFitness>(bestFitness-0.15) && getProbability(1,20))) {
            decoded = interDecoded
            parentKey = childKey
            bestFitness = interFitness
            counter = 0
        }

        counter++
    }


    return [decoded, bestFitness, parentKey]
}

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

export const getTransSimpleDecode = (text:string):any[] => {
    // using the bigram method
    text = formatString(text)
    text = text.toUpperCase()
    let decoded:string = ""
    let key:number[] = []
    let bestFitness:number = -1000000

    // the different row lengths to try
    for (let i=2; i<20; i++) {
        let rowLength:number = i
        let rows:string[] = getRows(text, rowLength)
        let worstColumnArrangementScore:number = 0
        let worstColumn:number = 1
        // stores 1:2, 2:5 ... meaning 1 is followed by 2 and 2 by 5
        let columnArrangement:Map<number, number> = new Map()
        for (let column1=1; column1<=i;column1++) {
            // try all possibilities for pairing with column k
            let bestColRating:number = -10000000000
            let arrangement:number[] = []
            for (let column2=1; column2<=i; column2++) {
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
        let compiledKey:number[] = compileArrangements(columnArrangement, worstColumn, i)
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
    }

    return [`${key}`, decoded.toUpperCase()]
}