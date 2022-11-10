import { getChiSquared } from "./chiSquared"
export const getAffineDecode = (text:string):Array<any> => {
    let englishRating:number = getChiSquared(text)
    return ["",text]
}