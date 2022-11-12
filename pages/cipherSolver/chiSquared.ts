import { formatString } from "./formatString"
export const getFrequencies = (text:string):Map<string,number> => {
    let resMap:Map<string, number> = new Map()
    for (let i:number=0;i<text.length;i++) {
        let cLook:string = text[i]
        if (resMap.has(cLook)) {
            let currentValue:number = resMap.get(cLook)!
            resMap.set(cLook, currentValue+1)
        } else {
            resMap.set(cLook, 1)
        }
    }
    return resMap
}

const getExpectedFrequencies = (alphabet:Array<string>, tLength:number):Map<string,number> => {
    let resMap:Map<string,number> = new Map()
    const expectedPercentages:Map<string,number> = new Map ([
        ['a',8.55],
        ['b',1.6],
        ['c',3.16],
        ['d',3.87],
        ['e',12.1],
        ['f',2.18],
        ['g',2.09],
        ['h',4.96],
        ['i',7.33],
        ['j',0.22],
        ['k',0.81],
        ['l',4.21],
        ['m',2.53],
        ['n',7.17],
        ['o',7.47],
        ['p',2.07],
        ['q',0.1],
        ['r',6.33],
        ['s',6.74],
        ['t',8.94],
        ['u',2.68],
        ['v',1.06],
        ['w',1.83],
        ['x',0.19],
        ['y',1.72],
        ['z',0.11]
    ])
    for (let i:number=0; i<alphabet.length;i++) {
        let expFrequ:number = ((expectedPercentages.get(alphabet[i])!)/100) * tLength
        resMap.set(alphabet[i], expFrequ) 
    }
    return resMap
}

export const getChiSquared = (text:string):number => {
    text = formatString(text)
    const alphabet:Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    const frequencies:Map<string,number> = getFrequencies(text)
    const expectedFrequencies:Map<string,number> = getExpectedFrequencies(alphabet,text.length)
    //console.log(frequencies)
    //console.log(expectedFrequencies)
    let res:number = 0;
    for (let i:number = 0; i < alphabet.length;i++) {
        let expFrequ:number = expectedFrequencies.get(alphabet[i])!
        let frequ:number = frequencies.get(alphabet[i])!
        let cRes:number = Math.pow((frequ-expFrequ), 2)/(expFrequ)!
        if (cRes > 0) {
            res += cRes
        }
    }
    return res
}