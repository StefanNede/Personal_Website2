import { formatString } from "./formatString"
const getFrequencies = (text:string):Map<string,number> => {
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
        ['a',8.2],
        ['b',1.5],
        ['c',2.8],
        ['d',4.3],
        ['e',12.7],
        ['f',2.2],
        ['g',2.0],
        ['h',6.1],
        ['i',7.0],
        ['j',0.2],
        ['k',0.8],
        ['l',4.0],
        ['m',2.4],
        ['n',6.7],
        ['o',7.5],
        ['p',1.9],
        ['q',0.1],
        ['r',6.0],
        ['s',6.3],
        ['t',9.1],
        ['u',2.8],
        ['v',1.0],
        ['w',2.4],
        ['x',0.2],
        ['y',2.0],
        ['z',0.1]
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
    // console.log(frequencies)
    // console.log(expectedFrequencies)
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