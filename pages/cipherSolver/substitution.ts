import { getChiSquared } from "./chiSquared";
export const getSubstitutionDecode = (text:string):Array<any> => {
    // implement page 72
    let englishRating:number = getChiSquared(text)
    return ["",text];
}