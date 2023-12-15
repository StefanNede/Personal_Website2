import { bigramFitness } from "./fitness"
import { formatString } from "./formatString"
import { getFrequencies } from "./chiSquared"
import { trigramFitness } from "./fitness"

const alphabet:string = "abcdefghiklmnopqrstuvwxyz".toUpperCase()

const getCoordinates = (key:string, letter:string):Number[] => {
    let i = key.indexOf(letter)
    let coor:Number[] = [Math.floor(i/5), i%5]
    return coor
}

const getLetter = (coor:any[]):string => {
    let letter:string = alphabet[coor[0]*5 + coor[1]]
    return letter
}

const applyKeys = (text:string, period:number, key1:string, key2:string):string => {
    // the actual decoding part given 2 keys
    let pairs:string[] = []
    for (let i=0; i<text.length; i+=2) {
        pairs.push(text.substring(i, i+2))
    }

    let decodedPairs:string[] = []

    for (let pair of pairs) {
        // first character goes to top right square
        // second character goes to bottom left square
        let c1:any = pair.charAt(0)
        let c2:any = pair.charAt(1)

        let coor1:Number[] = getCoordinates(key1, c1)
        let coor2:Number[] = getCoordinates(key2, c2)

        let decryptedCoor1:Number[] = [coor1[0], coor2[1]]
        let decryptedCoor2:Number[] = [coor2[0], coor1[1]]

        let decryptedLetter1:string = getLetter(decryptedCoor1)
        let decryptedLetter2:string = getLetter(decryptedCoor2)

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

export const decodeFourSquare = (text:string):Array<any> => {
    text = formatString(text)
    text = text.toUpperCase()
    let frequencies:Map<string,number> = getFrequencies(text)
    let charsUsed:string[] = Array.from(frequencies.keys())

    let decoded:string = "running"
    let key1:string = "abcdefghiklmnopqrstuvwxyz"
    let key2:string = "abcdefghiklmnopqrstuvwxyz"
    // key1 = "BHICDEFLGAKMNSOPQVRTUWXYZ"
    //key2 = "CEQFGKLMBNIOPADRSTUHVWXYZ"
    // key2 = "VWXYZQRSTULMNOPFGHIKABCDE"
    // key1 = "EBCATKGHFIPMNLOURSQDZWXVY"
    // key2 = "OFLQAWGMRBXHNSCYIVTDZKPUE"
    // key2 = "YVITDZPKUEXNHSCWMGRBOLFQA"
    // key1 = "TACBEIFHGKOLNMPDQSRUYVXWZ"

    // // random 
    // key1 = "HYSXOCBPUIQVZTDKARLMGFWNE"
    // key2 = "LSCMHUFKQIXZWEDNTOYBAVRPG"

    key1 = key1.toUpperCase()
    key2 = key2.toUpperCase()

    // for the purpose of the cipher challenge hard set to 2
    let period:number = 2

    // genetic algo
    let bestDecoded:string = applyKeys(text, period, key1, key2)
    let fitness:number = trigramFitness(bestDecoded)
    let counter:number = 0
    let upperBound:number = 10000

    while (counter < upperBound) {
        // change key 1
        let oldKey1:Array<string> = []
        for (let k of key1) { oldKey1.push(k)}
        let childKey1:any = ""

        // change key 2
        let oldKey2:Array<string> = []
        for (let k of key2) { oldKey2.push(k)}
        let childKey2:any = ""

        let x = getRandomNum(0,1)
        if (x === 0) {
            // modify key 1
            childKey1 = getChildKey(oldKey1)
            childKey1 = childKey1.join('')
            childKey2 = oldKey2.join('')
        } else {
            // modify key 2
            childKey1 = oldKey1.join('')
            childKey2 = getChildKey(oldKey2)
            childKey2 = childKey2.join('')
        }
        

        let interDecoded:string = applyKeys(text, period, key1, key2)
        let interFitness:number = trigramFitness(interDecoded)
        // console.log(childKey1, childKey2, interFitness, fitness)

        if ((interFitness >= fitness) || ((interFitness > fitness-100) && getRandomNum(2,2)==2) ) {
            console.log("HELLO")
            key1 = childKey1
            key2 = childKey2
            bestDecoded = interDecoded
            fitness = interFitness
            counter = 0
        } else {
            counter++
        }
    }

    decoded = bestDecoded
    
    return [key1 + key2, decoded]
}