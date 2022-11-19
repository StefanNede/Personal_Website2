import { getChiSquared } from "./chiSquared";
import { alphabet } from "./alphabet";
import { bigramFitness } from "./fitness";
import { trigramFitness } from "./fitness";
import { tetragramFitness } from "./fitness";
import { formatString } from "./formatString";


const getRandomNum = (min:number, max:number):number => {
    // includes min and max
    return Math.floor(Math.random() * (max+1 - min) + min);
}

const getFitness = (text:string, speedPrecision:string):number => {
    //let bFit:number = bigramFitness(text)
    if (speedPrecision === "speed") {
        let trFit:number = trigramFitness(text)
        return trFit
    } else {
        let teFit:number = tetragramFitness(text)
        return teFit
    }
    //return ((bFit+teFit+trFit)/3)
}

const getChildKey = (parentKey:Array<string>):Array<string> => {
    // if i set res key to parent key and changed res key it also changes parent key
    // cuz why the fuck wouldn't it
    let resKey:Array<string> = []

    for (let key of parentKey) {
        resKey.push(key)
    }

    let x:number = getRandomNum(0, 25)
    let y:number = getRandomNum(0, 25)
    while (y === x) {
        // must be distinct
        y = getRandomNum(0,25)
    }

    // perform the swap
    let temp:string = resKey[x]
    resKey[x] = resKey[y]
    resKey[y] = temp

    return resKey 
}

const decipherText = (text:string, key:Array<string>):string => {
    text = text.toLowerCase()
    let res:string = ""
    for (let letter of text) {
        if (alphabet.includes(letter)) {
            let i:number = key.indexOf(letter)
            letter = alphabet[i]
        }
        res += letter 
    }
    return res
}

export const getSubstitutionDecode = (text:string, speedPrecision:string):Array<any> => {
    text = text.toLowerCase()
    let key:Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let deciphered:string = decipherText(text, key)
    let fitness:number = getFitness(deciphered, speedPrecision) 
    let counter:number = 0
    let upperBound:number = text.length
    if (upperBound > 10000) { upperBound = 10000}
    while (counter < upperBound) {
        let oldKey:Array<string> = []
        for (let k of key) { oldKey.push(k)}
        let childKey:Array<string> = getChildKey(oldKey)
        let deciphered2:string = decipherText(text, childKey)
        let fitness2:number = getFitness(deciphered2, speedPrecision)
        if (fitness2 > fitness) {
            key = childKey
            deciphered = deciphered2
            fitness = fitness2
            counter = 0
        } else {
            counter++
        }
    }
    return [`${key.join('').toUpperCase()} \n ${alphabet.join('').toUpperCase()}`,deciphered.toUpperCase()];
}