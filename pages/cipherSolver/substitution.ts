import { getChiSquared } from "./chiSquared";
export const getSubstitutionDecode = (text:string):string => {
    let englishRating:number = getChiSquared(text)
    return text;
}