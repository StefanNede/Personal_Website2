import { wigwagLook } from "./data/wigwagLook"

export const decodeWigWag = (text:string):Array<any> => {
    let letters:string[] = text.split(' ')
    let res:string = ""
    for (let letter of letters) {
        res += wigwagLook.get(letter)
    }
    return ["", res]
}