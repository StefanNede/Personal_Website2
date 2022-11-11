import { getChiSquared } from "./chiSquared";
import { alphabet } from "./alphabet";
import { bigramFitness } from "./fitness";
import { trigramFitness } from "./fitness";
import { tetragramFitness } from "./fitness";
import { formatString } from "./formatString";

const getFitness = (text:string):number => {
    //let bFit:number = bigramFitness(text)
    //let trFit:number = trigramFitness(text)
    let teFit:number = tetragramFitness(text)
    //return ((bFit+teFit+trFit)/3)
    return teFit
}

const getChildKey = (parentKey:Array<string>):Array<string> => {
    return [""]
}

const decipherText = (text:string, key:Array<string>):string => {
    text = text.toLowerCase()
    return ""
}

export const getSubstitutionDecode = (text:string):Array<any> => {
    text = text.toLowerCase()
    let key:Array<string> = alphabet
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
    return [`${key.join('').toUpperCase()} => ${alphabet.join('').toUpperCase()}`,deciphered.toUpperCase()];
}