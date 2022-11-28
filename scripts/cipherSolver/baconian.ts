import {baconian24, baconian26} from "./data/baconian"
import { bigramFitness } from "./fitness"
import { formatString } from "./formatString"
import { getFrequencies } from "./chiSquared"

const decode24 = (text:string):string => {
    let res:string = ""
    let l = text.length
    text = text.toLowerCase()
    for (let i=0;i<=l-5;i+=5) {
        let letter = text.substring(i, i+5)
        if (baconian24.get(letter) === undefined) {
            // baconian 24 was not used
            return ''
        }
        res += baconian24.get(letter)
    }
    return res
}

const decode26 = (text:string):string => {
    let res:string = ""
    let l = text.length
    text = text.toLowerCase()
    for (let i=0;i<=l-5;i+=5) {
        let letter = text.substring(i, i+5)
        if (baconian26.get(letter) === undefined) {
            // baconian 26 was not used
            return ''
        }
        res += baconian26.get(letter)
    }
    return res
}

const getPerms = (lettersUsed:string):Map<string,string> => {
    // either the first letter used is A and the second letter is B or the other way round
    let perms:Map<string,string> = new Map([
        [lettersUsed[0], "A"],
        [lettersUsed[0], "B"]
    ])
    return perms
}

export const decodeBaconian = (text:string):Array<any> => {
    text = formatString(text)
    let frequencies:Map<string,number> = getFrequencies(text)
    let charsUsed:string[] = Array.from(frequencies.keys())

    if (charsUsed.length !== 2) {
        return ["baconian not likely used", "for baconian cipher only 2 characters are used"]
    }

    let perms:string[][] = [[charsUsed[0], charsUsed[1]], [charsUsed[1], charsUsed[0]]]
    let bestD24:any[] = ["", 0, ["A", "B"]]
    let bestD26:any[] = ["", 0, ["A", "B"]]

    for (let p of perms) {
        let ammText:string = text
        ammText = ammText.replaceAll(p[0], "A")
        ammText = ammText.replaceAll(p[1], "B")
        let d24:string = decode24(ammText)
        let d26:string = decode26(ammText)
        let d24Fit:number = bigramFitness(d24)
        let d26Fit:number = bigramFitness(d26)
        if (d24.length > 0 && (d24Fit > bestD24[1] || bestD24[1] === 0)) {
            bestD24 = [d24, d24Fit, [p[0], p[1]]]
        } 
        if (d26.length > 0 && (d26Fit > bestD26[1] || bestD26[1] === 0)) {
            bestD26 = [d26, d26Fit, [p[0], p[1]]]
        }
    }

    if (bestD24[1] > bestD26[1]) {
        return [`24 key, ${bestD24[2][0].toUpperCase()}:A, ${bestD24[2][1].toUpperCase()}:B`, bestD24[0]]
    } else {
        return [`26 key, ${bestD26[2][0].toUpperCase()}:A, ${bestD26[2][1].toUpperCase()}:B`, bestD26[0]]
    }
}