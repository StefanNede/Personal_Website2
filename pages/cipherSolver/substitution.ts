import { getChiSquared } from "./chiSquared";
export const getSubstitutionDecode = (text:string):Array<any> => {
    let englishRating:number = getChiSquared(text)
    return ["",text];
}