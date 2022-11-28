import {baconian24, baconian26} from "./data/baconian"
import { bigramFitness } from "./fitness"
import { formatString } from "./formatString"

const decode24 = (text:string):string => {
    let res:string = ""
    let l = text.length
    text = text.toLowerCase()
    for (let i=0;i<=l-5;i+=5) {
        let letter = text.substring(i, i+5)
        if (baconian24.get(letter) === undefined) {
            // baconian 24 was not used
            return ''
        }
        res += baconian24.get(letter)
    }
    return res
}

const decode26 = (text:string):string => {
    let res:string = ""
    let l = text.length
    text = text.toLowerCase()
    for (let i=0;i<=l-5;i+=5) {
        let letter = text.substring(i, i+5)
        if (baconian26.get(letter) === undefined) {
            // baconian 24 was not used
            return ''
        }
        res += baconian26.get(letter)
    }
    return res
}

export const decodeBaconian = (text:string):Array<any> => {
    text = formatString(text)
    let d24:string = decode24(text)
    let d26:string = decode26(text)
    if (d24.length === 0 && d26.length === 0) {
        return ["baconian not likely used", text]
    }
    else if (d24.length === 0 || bigramFitness(d24) < bigramFitness(d26)) {
        return ["26 letter baconian cipher likely used", d26]
    } else {
        return ["24 letter baconian cipher likely used", d24]
    }
}