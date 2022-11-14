import { formatString } from "./formatString"
import {tetragrams} from "./data/tetragrams"

export const bigramFitness = (text:string):number => {
    return 0.0
}

export const trigramFitness = (text:string):number => {
    return 0.0
}

const getTetragrams = (text:string):Map<string, number> => {
    text = formatString(text)
    let tetras:Map<string,number> = new Map()
    for (let i=0;i<text.length-4;i++) {
        let tetra:string = text.substring(i,i+4)
        if (tetras.has(tetra)) {
            tetras.set(tetra, tetras.get(tetra)!+1)
        } else {
            tetras.set(tetra, 1)
        }
    }
    return tetras
}

export const tetragramFitness = (text:string):number => {
    let res = 0
    let tetras = getTetragrams(text)
    tetras.forEach((count, tetra) => {
        let p:number = 0
        if (tetragrams.has(tetra.toUpperCase())) { 
            p = tetragrams.get(tetra.toUpperCase())!
        } else {
            p = -10
        }
        res += p
    })
    return res
}