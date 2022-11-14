import { alphabet } from "./alphabet"

const reverseAlphabet:Array<string> = ['z', 'y', 'x', 'w', 'v', 'u', 't', 's', 'r', 'q', 'p', 'o', 'n', 'm', 'l', 'k', 'j', 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']

export const getAtbashDecode = (text:string):Array<any> => {
    // the key alphabet is the reverse of the original
    let solvedCode:string = ""
    for (let letter of text) {
        if (alphabet.includes(letter)) {
            letter = alphabet[reverseAlphabet.indexOf(letter)]
        }
        solvedCode += letter
    }

    return [`${reverseAlphabet.join('').toUpperCase()} \n ${alphabet.join('').toUpperCase()}`, solvedCode.toUpperCase()]
}