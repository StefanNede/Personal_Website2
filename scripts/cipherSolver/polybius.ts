import { getSubstitutionDecode } from "./substitution"
import { formatString } from "./formatString"
import { alphabet } from "./alphabet"

const getGridHeadings = (text:string):string => {
    let lettersUsed:Set<string> = new Set()
    for (let letter of text) {
        lettersUsed.add(letter)
    }
    return Array.from(lettersUsed).join("")
} 

const decode = (text:string, letterMap:Map<string, string>):string => {
    let res:string = ""
    for (let i=0;i<text.length-1;i+=2) {
        let letterPair = text.substring(i, i+2)
        res += letterMap.get(letterPair)
    }
    return res
}

const formatKey = (key:Map<string, string>):string[] => {
    let res:string[] = []
    key.forEach((value:string, key:string) => {
        res.push(`${key.toUpperCase()}->${value.toUpperCase()}`)
    })
    return res
}

export const getPolybiusDecode = (text:string, speedPrecision:string):Array<any> => {
    text = formatString(text)
    let decoded:string = ""
    let key:Map<string, string> = new Map()
    let lettersUsed = getGridHeadings(text)
    lettersUsed = Array.from(lettersUsed).sort().join("")
    
    if (lettersUsed.length !== 10 && lettersUsed.length !== 5) {
        decoded = "cannot creat polybius square from inputted text"
    } 
    
    else if (lettersUsed.length === 5) {
        // the heading for the column and row is the same
        let headings:string[] = Array.from(lettersUsed).sort()
        let columns:string[] = headings 
        let letterMap:Map<string, string> = new Map()
        let ptr:number = 0 // pointer to the letter of the alphabet currently on
        for (let i=0;i<5;i++) {
            for (let j=0;j<5;j++) {
                let comb:string = headings[i] + columns[j]
                letterMap.set(comb, alphabet[ptr])
                if (alphabet[ptr] === "i") {
                    ptr+=2
                } else{
                    ptr++
                }
            }
        }
        key = letterMap
        decoded = decode(text, letterMap)
    }
    
    else if (lettersUsed.length === 10) {
        let letterMap:Map<string, string> = new Map()
        let ptr:number = 0 // pointer to the letter of the alphabet currently on
        // go through text and assign a letter to each pair
        for (let i=0;i<text.length-1;i+=2) {
            let letterPair = text.substring(i, i+2)
            if (letterMap.get(letterPair) === undefined) {
                if (ptr > 25) {
                    
                }
                letterMap.set(letterPair, alphabet[ptr])
                if (alphabet[ptr] === "i") {
                    ptr+=2
                } else{
                    ptr++
                }
            } 
        }
        key = letterMap
        decoded = decode(text, letterMap)
    }

    let interDecoded:any[] = getSubstitutionDecode(decoded, speedPrecision)
    decoded = interDecoded[1] 
    let resKey:string[] = formatKey(key)
    resKey.push(interDecoded[0])
    return [resKey, decoded.toUpperCase()]
}