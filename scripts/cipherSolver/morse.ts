import { morseLookup } from "./data/morseLook";
export const decodeMorse = (text:string):Array<any> => {
    let letters:string[] = text.split(' ')
    let res:string = ""
    let parenthesesUsed:boolean = false
    for (let letter of letters) {
        if (morseLookup.get(letter) == "()") {
            if (parenthesesUsed) {
                res += ")"
                parenthesesUsed = false
            } else {
                res += "("
                parenthesesUsed = true
            }
        } else {
            res += morseLookup.get(letter)
        }
    }
    return ["", res]
}