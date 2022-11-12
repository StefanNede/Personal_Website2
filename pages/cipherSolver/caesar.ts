import { alphabet } from "./alphabet"
import { getChiSquared } from "./chiSquared"

const getCaesarScore = (text:string):number => {
    // use this because for some weird english strings chi squared won't be a good judge
    const frequentLetters:string = "etaoin"
    const infrequentLetters:string = "vkjxqz"
    let score:number = 0
    for (let letter of text) {
        if (frequentLetters.includes(letter)) {
            score++
        } else if (infrequentLetters.includes(letter)) {
            score--
        }
    }
    return score
}

export const getCaesarDecode = (text:string):Array<any> => {
    text = text.toLowerCase()
    let key:number = 0
    let highestRating:number = -1
    let solvedCode:string = ""

    // get the key that gives the highest english rating
    for (let i=0;i<26;i++) {
        let res:string = ""
        for (let char of text) {
            if (alphabet.includes(char)) {
                // have to write that waffle because javascript returns the negative modulo
                // e.g. -1mod26 -> -1
                char = alphabet[(((alphabet.indexOf(char)-i)%26)+26)%26]
            }
            res += char
        }
        let currentRating:number = getCaesarScore(res)
        if (currentRating > highestRating) {
            key = i
            highestRating = currentRating
            solvedCode = res
        }

    }
    
    return [key,solvedCode.toUpperCase()]
}