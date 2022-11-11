import { getChiSquared } from "./chiSquared"

const alphabet:Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

const getPosMod = (num:number, mod:number):number => {
    return (((num)%mod)+mod)%26
}

const gcd = (a:number, b:number):number => {
    if (!b) { return a }
    return gcd(b,a%b)
}

const getPossibleAInv = (m:number) => {
    let res:Array<number> = []
    for (let a=0;a<m;a++) {
        if (gcd(a,m) === 1) {
            res.push(a)
        }
    }
    return res
}

const inverse = (x:number, m:number):number => {
    // extended euclidean algorithm only works if gcd is 1
    let possible_a_inv:Array<number> = getPossibleAInv(m)
    
    // try each possibility for a^-1 until one fulfills equation 1 = a a^-1 mod m
    for (let i of possible_a_inv) {
        let posMod:number = getPosMod(x*i, m)
        if (posMod === 1) { return i }
    }
    return -1
}

const decryptLetter = (a:number, b:number, m:number, letter:string):number => {
    let letterIndex:number = alphabet.indexOf(letter)
    let a_inv:number = inverse(a,m)
    if (a_inv !== -1) {
        return (getPosMod(a_inv * (letterIndex-b),m))
    } else {
        return -1
    }
}

export const getAffineDecode = (text:string):Array<any> => {
    text = text.toLowerCase()
    let aPsbs:Array<number> = [1,1,3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]
    let bPsbs:Array<number> = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
    let a:number = 1
    let b:number = 0
    let bestRating:number = 10000000000
    let solvedCode:string = ""

    for (let aPsb of aPsbs) {
        for (let bPsb of bPsbs) {
            let res:string = ""
            for (let letter of text) {
                if (alphabet.includes(letter)) {
                    let decryptedLetter:number = decryptLetter(aPsb, bPsb, 26, letter)
                    if (decryptedLetter !== -1) {
                        letter = alphabet[decryptedLetter]
                    }
                }
                res += letter
            }
            let currentRating:number = getChiSquared(res)
            console.log(res, currentRating)

            if (currentRating < bestRating) {
                a = aPsb
                b = bPsb
                bestRating = currentRating
                solvedCode = res
            }
        }
    }


    // format of [[multiplier, shift size], solved code]
    return [[a, b],solvedCode]
}