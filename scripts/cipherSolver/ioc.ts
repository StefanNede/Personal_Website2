import { formatString } from "./formatString"

const getCount = (text:string, letter:string):number => {
    let count:number = 0
    for(let i=0; i<text.length; count+=+(letter===text[i++]));
    return count
}

export const getIoc = (text:string):number => {
    /*
    a measure of how often we can expect 2 characters chosen at random from at text to be identical
    multiply by 26 for a normalisation factor
    formula: 26*(ni(ni-1)) / (N(N-1)) where N is number of letters in the text
    typical english has IoC close to 1.75
    */
    text = formatString(text)
    const lengthOfText:number = text.length
    const alphabet:Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let res:number = 0.0
    for (let letter of alphabet) {
        let letterCount:number = getCount(text, letter)
        if (letterCount > 0) {
            let tempRes = letterCount*(letterCount-1)
            tempRes /= lengthOfText*(lengthOfText-1)
            res += tempRes
        }
    }

    res *= 26
    return res
}