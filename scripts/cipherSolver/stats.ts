export const getLongestSubstrings = (text:string):any[][] => {
    // if substring length is greater than 6 add to array
    // in the array hold the length of the substring, it's locations in the 
    // text and the gap between it's location in the text
    let res:any[][] = []
    let sampleRes:any[][] = [["hello", 5, [1, 10, 28, 55], [9, 18, 27]], ["hello", 5, [1, 10, 28, 55], [9, 18, 27]]]
    return sampleRes
}

// not using this function because I would've had to use another for loop 
// to go over the factors but this way i can check if update the total factors map 
// at the same time 
/* const getFactors = (num:number):number[] => {
    let res:number[] = [1, num]
    if (num < 2) { return [1] }
    if (num == 2) { return [1,2] } 

    for (let i=2; i<Math.sqrt(num)+1;i++) {
        if (num%i === 0 && !res.includes(i)) {
            res.push(i)
            if (num/i !== i) { res.push(num/i) }
        }
    } 
    console.log(res.join(' '))

    return res
} */

const addToMap = (m:Map<number,number>, num:number) => {
    if (m.get(num) !== undefined) {
        m.set(num, m.get(num)!+1)
    } else {
        m.set(num, 1)
    }
}

export const getFactorsCommon = (gaps:number[]):number[] => {
    let factors:number[] = []
    let numGaps:number = gaps.length
    // this will hold the prime factors that intersect fro
    let individualFactors:Map<number, number> = new Map()
    for (let gap of gaps) {
        // use this to make sure we do not add a duplicate of a factor to the individual factors list 
        let interFactors:Map<number,number> = new Map([[1,1], [gap,1]])
        addToMap(individualFactors, gap)
        if (gap > 2) {
            for (let i=2; i<Math.sqrt(gap)+1;i++) {
                if (gap%i === 0 && interFactors.get(i) === undefined) {
                    interFactors.set(i,1)
                    addToMap(individualFactors, i) 
                    if (gap/i !== i && interFactors.get(gap/i) === undefined) { 
                        interFactors.set(gap/i,1)
                        addToMap(individualFactors, gap/i)
                    }
                }
            }
        }
    }
    // go over individual factors and check if they have a count >= to length of gaps
    // as this mean that they appear in all the gaps
    for (let [key, value] of individualFactors) {
        if (value >= numGaps) {
            factors.push(key)
        }
    }
    factors.sort() // uses insertion and merge sort to get O(nlogn) for time complexity
    return factors
}

export const getStats = (text:string) => {
    /* get longest repeating substrings  
     * get factors common to the gaps between substrings - for transposition ciphers
     * display stats updated - check stats section
     */
}