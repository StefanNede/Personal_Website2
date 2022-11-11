import { alphabet } from "./alphabet"

const ammendedAlphabet:Array<string> = ['l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']

export const getAlbamDecode = (text:string):Array<any> => {
    // the key is: the 2 halves of the alphabet that have been swapped
    // NOPQRSTUVWXYZABCDEFGHIJKLM corresponds to ABCDEF...
    let solvedCode:string = ""
    for (let letter of text) {
        if (alphabet.includes(letter)) {
            letter = alphabet[ammendedAlphabet.indexOf(letter)]
        }
        solvedCode += letter
    }

    return [`${ammendedAlphabet.join('').toUpperCase()} => ${alphabet.join('').toUpperCase()}`, solvedCode.toUpperCase()]
}