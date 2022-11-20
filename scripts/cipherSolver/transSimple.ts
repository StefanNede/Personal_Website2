import { formatString } from "./formatString"
import { tetragramFitness, trigramFitness } from "./fitness"
import { getPeriodIOC, getPeriodLRS, getColumns } from "./period"

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

export const getTransSimpleDecode = (text:string):any[] => {
    // using hill climbing attack
    // with transposition ciphers it is easy to get trapped in a local maximum fitness
    // hence we add a little leeway to the hill-climbing and allow it to take small steps
    // toward lower fitness once in a while - a good margin is 0.15 with prob of stepping downward at 5%
    // using same technique from vigenere to get period length
    let decoded:string = ""
    let period:number = 0
    let periods:number[] = getPeriodLRS(text)
    let key:number[] = []
    text = formatString(text)
    if (periods.length === 0) {
        // we need to use another technique to find the period
        period = getPeriodIOC(text)
        text = padText(text, period)
        let [interDecoded, periodFitness, keyUsed] = performHillClimbing(text, period) // get best option with current period
        decoded = interDecoded
        key = keyUsed
    } else {
        let bestPeriod:number = 0
        let bestDecoded:string = ""
        let bestFitness:number = trigramFitness(text) 
        let bestKeyUsed:number[] = []
        for (let period of periods) {
            text = padText(text, period)
            let [interDecoded, periodFitness, keyUsed] = performHillClimbing(text, period) // get best option with current period
            if (periodFitness > bestFitness) {
                bestPeriod = period
                bestDecoded = interDecoded
                bestFitness = periodFitness
                bestKeyUsed = keyUsed
            }
        }
        period = bestPeriod
        decoded = bestDecoded 
        key = bestKeyUsed
    }

    return [`Period of ${period} (${key})`, decoded.toUpperCase()]
}