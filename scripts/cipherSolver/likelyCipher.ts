export const getLikelyCipher = (ioc:number, chi:number):string => {
    let randomIoc:number = 1.00
    let englishIoc:number = 1.77
    let likelyCipher:string = ""
    if (Math.abs(ioc-englishIoc) < 0.2) {
        likelyCipher = "Transposition, Caesar, Affine, Substitution" 
    } else if (Math.abs(ioc-randomIoc) < 0.2) {
        likelyCipher = "Vigenere/Beaufort"
    } else {
        likelyCipher = "unknown"
    }
    return likelyCipher
}