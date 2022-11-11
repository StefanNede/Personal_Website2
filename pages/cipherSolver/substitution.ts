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

const getFitness = (text:string):number => {
    //let bFit:number = bigramFitness(text)
    //let trFit:number = trigramFitness(text)
    let teFit:number = tetragramFitness(text)
    //return ((bFit+teFit+trFit)/3)
    return teFit
}

const getChildKey = (parentKey:Array<string>):Array<string> => {
    let x:number = getRandomNum(0, 25)
    let y:number = getRandomNum(0, 25)
    while (y === x) {
        // must be distinct
        y = getRandomNum(0,25)
    }

    // perform the swap
    let temp:string = parentKey[x]
    parentKey[x] = parentKey[y]
    parentKey[y] = temp

    return parentKey
}

const decipherText = (text:string, key:Array<string>):string => {
    text = text.toLowerCase()
    let res:string = ""
    for (let letter of text) {
        if (alphabet.includes(letter)) {
            console.log(key)
            let i:number = key.indexOf(letter)
            letter = alphabet[i]
        }
        res += letter 
    }
    return res
}

export const getSubstitutionDecode = (text:string):Array<any> => {
    text = text.toLowerCase()
    let key:Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let deciphered:string = decipherText(text, key)
    let fitness:number = getFitness(deciphered) 
    let counter:number = 0
    while (counter < 10000) {
        let childKey:Array<string> = getChildKey(key)
        let deciphered2:string = decipherText(text, childKey)
        let fitness2:number = getFitness(deciphered2)
        if (fitness2 > fitness) {
            key = childKey
            deciphered = deciphered2
            fitness = fitness2
            counter = 0
        } else {
            counter++
        }
    }
    alert("done")
    return [`${key.join('').toUpperCase()} => ${alphabet.join('').toUpperCase()}`,deciphered.toUpperCase()];
}