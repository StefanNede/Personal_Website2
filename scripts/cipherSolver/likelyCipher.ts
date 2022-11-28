import { getFrequencies } from "./chiSquared"
import { formatString } from "./formatString"

export const getLikelyCipher = (ioc:number, chi:number, text:string):string => {
    let randomIoc:number = 1.00
    let englishIoc:number = 1.77
    let likelyCipher:string = ""
    text = formatString(text)
    let frequencies:Map<string,number> = getFrequencies(text)
    let charsUsed:string[] = Array.from(frequencies.keys())
    if (charsUsed.length === 2) {
        likelyCipher = "Baconian"
    } else if (charsUsed.length === 5 || charsUsed.length === 10) {
        likelyCipher = "Polybius"
    } else if (Math.abs(ioc-englishIoc) < 0.2) {
        likelyCipher = "Transposition, Caesar, Affine, Substitution" 
    } else if (Math.abs(ioc-randomIoc) < 0.2) {
        likelyCipher = "Vigenere/Beaufort"
    } else {
        likelyCipher = "unknown"
    }
    return likelyCipher
}