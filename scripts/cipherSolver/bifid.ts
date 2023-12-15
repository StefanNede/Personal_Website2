import { bigramFitness } from "./fitness"
import { formatString } from "./formatString"
import { getFrequencies } from "./chiSquared"
import { trigramFitness } from "./fitness"

const modifyKey = (key:string):string[][] => {
    let newKey:string[][] = [Array.from(key.substring(0,5)), Array.from(key.substring(5,10)), Array.from(key.substring(10,15)), Array.from(key.substring(15,20)), Array.from(key.substring(20,25))]
    return newKey
}

const getCoordinates = (key:string, letter:string):Number[] => {
    let i = key.indexOf(letter)
    let coor:Number[] = [Math.floor(i/5), i%5]
    return coor
}

const getLetter = (key:string, coor:any[]):string => {
    let letter:string = key[coor[0]*5 + coor[1]]
    return letter
}

const applyKey = (text:string, period:number, key:string):string => {
    
    // split into groups of 2 as period is length 2
    let pairs:string[] = []
    for (let i=0; i<text.length; i+=2) {
        pairs.push(text.substring(i, i+2))
    }

    let decodedPairs:string[] = []

    // console.log(pairs)

    // get coordinates of pairs based on key
    for (let pair of pairs) {
        let coor1:Number[] = getCoordinates(key, pair.charAt(0))
        let coor2:Number[] = getCoordinates(key, pair.charAt(1))

        let decryptedCoor1:Number[] = [coor1[0], coor2[0]]
        let decryptedCoor2:Number[] = [coor1[1], coor2[1]]
        // console.log(pair)
        // console.log(coor1)
        // console.log(coor2)
        // console.log(decryptedCoor1)
        // console.log(decryptedCoor2)

        let decryptedLetter1:string = getLetter(key, decryptedCoor1)
        let decryptedLetter2:string = getLetter(key, decryptedCoor2)

        // console.log(decryptedLetter1)
        // console.log(decryptedLetter2)
        decodedPairs.push(decryptedLetter1 + decryptedLetter2)
    }

    let decoded:string = decodedPairs.join('')

    return decoded
}

const getRandomNum = (min:number, max:number):number => {
    // includes min and max
    return Math.floor(Math.random() * (max+1 - min) + min);
}

const swapTwo = (parentKey:Array<string>):Array<string> => {
    let resKey:Array<string> = []

    for (let key of parentKey) {
        resKey.push(key)
    }

    let x:number = getRandomNum(0, 24)
    let y:number = getRandomNum(0, 24)

    while (y === x) {
        // must be distinct
        y = getRandomNum(0,24)
    }

    // perform the swap
    let temp:string = resKey[x]
    resKey[x] = resKey[y]
    resKey[y] = temp

    return resKey 
}

const swapRows = (parentKey:Array<string>):Array<string> => {
    let resKey:Array<string> = []

    // split into groups of 5
    let newKey:string[][] = [Array.from(parentKey.slice(0,5)), Array.from(parentKey.slice(5,10)), Array.from(parentKey.slice(10,15)), Array.from(parentKey.slice(15,20)), Array.from(parentKey.slice(20,25))]

    // the rows to swap
    let x:number = getRandomNum(0, 4)
    let y:number = getRandomNum(0, 4)

    while (y === x) {
        // must be distinct
        y = getRandomNum(0,4)
    }

    // perform the swap
    let temp:string[] = newKey[x]
    newKey[x] = newKey[y]
    newKey[y] = temp

    // populate resKey
    for (let key of newKey) {
        resKey.push(key.join(''))
    }

    return resKey
}

const swapCols= (parentKey:Array<string>):Array<string> => {
    let resKey:Array<string> = []

    // split into columns of 5
    let newKey:any = [[],[],[],[],[]]
    for (let i =0; i< 25; i++) {
        newKey[i%5].push(parentKey[i])
    }

    // the columns to swap
    let x:number = getRandomNum(0, 4)
    let y:number = getRandomNum(0, 4)

    while (y === x) {
        // must be distinct
        y = getRandomNum(0,4)
    }

    // perform the swap
    let temp:string[] = newKey[x]
    newKey[x] = newKey[y]
    newKey[y] = temp


    // populate resKey
    for (let j=0; j<5; j++ ) {
        for (let k=0; k<5; k++) {
            resKey.push(newKey[k][j])
        }
    }

    return resKey
}

const getChildKey = (parentKey:Array<string>):Array<string> => {
    let x:number = getRandomNum(0, 5)
    let resKey:Array<string> = []

    if (x === 0) {
        // swap 2 randomly selected elements
        resKey = swapTwo(parentKey)
    }

    if (x === 1) {
        // swap 2 randomly selected rows 
        resKey = swapRows(parentKey)
        resKey = Array.from(resKey.join(''))
    }

    if (x === 2) {
        // swap 2 randomly selected columns 
        resKey = swapCols(parentKey)
    }

    if (x === 3) {
        // flip square around the diagonal that runs from upper left to lower right
        let newKey:any = [[],[],[],[],[]]
        for (let i =0; i< 25; i++) {
            newKey[i%5].push(parentKey[i])
        }
        for (let k of newKey) {
            resKey.push(k.join(''))
        }
        resKey = Array.from(resKey.join(''))
    }

    if (x === 4) {
        // flip square vertically
        let newKey:any = [[],[],[],[],[]]
        for (let i =0; i< 25; i++) {
            newKey[i%5].push(parentKey[i])
        }
        // swap columns 1 and 5
        let temp:string[] = newKey[0]
        newKey[0] = newKey[4]
        newKey[4] = temp

        // swap columns 2 and 4
        temp = newKey[1]
        newKey[1] = newKey[3]
        newKey[3] = temp

        for (let j=0; j<5; j++ ) {
            for (let k=0; k<5; k++) {
                resKey.push(newKey[k][j])
            }
        }
    }

    if (x === 5) {
        // flip square horizontally
        let newKey:string[][] = [Array.from(parentKey.slice(0,5)), Array.from(parentKey.slice(5,10)), Array.from(parentKey.slice(10,15)), Array.from(parentKey.slice(15,20)), Array.from(parentKey.slice(20,25))]

        // swap rows 1 and 5
        let temp:string[] = newKey[0]
        newKey[0] = newKey[4]
        newKey[4] = temp

        // swap rows 2 and 4
        temp = newKey[1]
        newKey[1] = newKey[3]
        newKey[3] = temp

        for (let key of newKey) {
            resKey.push(key.join(''))
        }

        resKey = Array.from(resKey.join(''))
    }

    return resKey
}

export const decodeBifid = (text:string):Array<any> => {
    text = formatString(text)
    text = text.toUpperCase()
    let frequencies:Map<string,number> = getFrequencies(text)
    let charsUsed:string[] = Array.from(frequencies.keys())

    let decoded:string = "running"
    let key:string = "abcdefghiklmnopqrstuvwxyz"
    key = key.toUpperCase()

    // for the purpose of the cipher challenge hard set to 2
    let period:number = 2

    // genetic algo
    let bestDecoded:string = applyKey(text, period, key)
    let fitness:number = trigramFitness(bestDecoded)
    let counter:number = 0
    let upperBound:number = 10000

    while (counter < upperBound) {
        let oldKey:Array<string> = []
        for (let k of key) { oldKey.push(k)}
        let childKey:any = getChildKey(oldKey)
        childKey = childKey.join('')
        // console.log(childKey)

        let interDecoded:string = applyKey(text, period, key)
        let interFitness:number = trigramFitness(interDecoded)

        if (interFitness > fitness) {
            key = childKey
            bestDecoded = interDecoded
            fitness = interFitness
            counter = 0
        } else {
            counter++
        }
    }

    decoded = bestDecoded
    
    return [key, decoded]
}
