import { getChiSquared } from "./chiSquared"
export const getAffineDecode = (text:string):string => {
    let englishRating:number = getChiSquared(text)
    return text
}