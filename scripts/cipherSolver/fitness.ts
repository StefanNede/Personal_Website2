import { formatString } from "./formatString"
import {bigrams} from "./data/bigrams"
import {trigrams} from "./data/trigrams"
import {tetragrams} from "./data/tetragrams"

const getBigrams = (text:string):Map<string, number> => {
    text = formatString(text)
    let bigras:Map<string,number> = new Map()
    for (let i=0;i<text.length-1;i++) {
        let bigra:string = text.substring(i,i+2)
        if (bigras.has(bigra)) {
            bigras.set(bigra, bigras.get(bigra)!+1)
        } else {
            bigras.set(bigra, 1)
        }
    }
    return bigras 
}

export const bigramFitness = (text:string):number => {
    let res = 0
    let bigras = getBigrams(text)
    bigras.forEach((count, bigra) => {
        let p:number = 0
        if (bigrams.has(bigra.toUpperCase())) { 
            p = bigrams.get(bigra.toUpperCase())!
        } else {
            p = -10
        }
        res += p
    })
    return res
}

const getTrigrams = (text:string):Map<string, number> => {
    text = formatString(text)
    let titras:Map<string,number> = new Map()
    for (let i=0;i<text.length-2;i++) {
        let titra:string = text.substring(i,i+3)
        if (titras.has(titra)) {
            titras.set(titra, titras.get(titra)!+1)
        } else {
            titras.set(titra, 1)
        }
    }
    return titras 
}

export const trigramFitness = (text:string):number => {
    let res = 0
    let trigras = getTrigrams(text)
    trigras.forEach((count, trigra) => {
        let p:number = 0
        if (trigrams.has(trigra.toUpperCase())) { 
            p = trigrams.get(trigra.toUpperCase())!
        } else {
            p = -10
        }
        res += p
    })
    return res
}

const getTetragrams = (text:string):Map<string, number> => {
    text = formatString(text)
    let tetras:Map<string,number> = new Map()
    for (let i=0;i<text.length-3;i++) {
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