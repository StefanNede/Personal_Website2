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
    let usedUpper:boolean = false
    if (text === text.toUpperCase()) {
        usedUpper = true
    } 
    text = text.toLowerCase()
    let key:number = 0
    let highestRating:number = -1
    let solvedCode:string = ""
    const alphabet:Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

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
        console.log(currentRating)
        if (currentRating > highestRating) {
            key = i
            highestRating = currentRating
            solvedCode = res
            console.log(solvedCode)
        }

    }
    
    if (usedUpper) {
        solvedCode = solvedCode.toUpperCase()
    }
    return [key,solvedCode]
}