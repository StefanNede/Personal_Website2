import { formatString } from "./formatString"

const getMatrix = (length:number):number[][] => {
    // for tabulation
	let lrs = []
	for (let i=0;i<length+1;i++) {
		let inter = []
		for (let j=0;j<length+1;j++) {
			inter.push(0)
		}
		lrs.push(inter)
	}
	return lrs
}

const LRS = (str:string):any[][] => {
    // to get a lower bound for this (e.g. show substrings with length from lower bound upwards)
    // run dp LRS to get the longest one and set lower bound to its length -4


    // non overlapping, repeating substrings
    // return [substring, length, [appearance1, appearance2, appearance3...],  [gap1, gap2, gap3...]]

	let stringLength:number = str.length
	// holds all the repeating substrings above a length of 6
    // because there are multiple appearances of each substring and we want to monitor this this should be a map
	let substrings:Map<string, any[]> = new Map()

	// creating the 2d matrix for tabulation
	let lrs:number[][] = getMatrix(stringLength)

	let index:number = 0 
    // build from bottom up
	for (let i=1;i<stringLength+1;i++) {
		for (let j=i+1;j<stringLength+1;j++) {
			if (str.charAt(i-1) === str.charAt(j-1) && lrs[i-1][j-1] < (j-i)) {
				lrs[i][j] = 1 + lrs[i-1][j-1]
				if (lrs[i][j] >= 6) {
					let subIndex:number = Math.max(i, index)
					let subLength:number = lrs[i][j]
                    let appearance1:number = subIndex-subLength
                    let appearance2:number = j-subLength
					let sub:string = str.substring(subIndex-subLength, subIndex)
                    let subArray:any[] = [sub, subLength, [appearance1, appearance2], [appearance2-appearance1]]
                    if (substrings.get(sub) === undefined) {
                        substrings.set(sub, subArray)
                    } else {
                        let prevSubArray:any[] = substrings.get(sub)!
                        let compiledAppearances:number[] = [appearance1, appearance2]
                        let compiledGaps:number[] = [appearance2-appearance1]
                        // compile the appearances and the gaps
                        for (let app of prevSubArray[2]) {
                            if (!compiledAppearances.includes(app)) {
                                compiledAppearances.push(app)
                            }
                        }
                        for (let g of prevSubArray[3]) {
                            if (!compiledGaps.includes(g)) {
                                compiledGaps.push(g)
                            }
                        }
                        compiledAppearances.sort((a,b) => a-b)
                        compiledGaps.sort((a,b) => a-b)
                        let compiledSubArray:any[] = [sub, subLength, compiledAppearances, compiledGaps]
                        substrings.set(sub, compiledSubArray)
                    }
				}
			} 
			else {
				lrs[i][j] = 0
			}
		}
	}

    return Array.from(substrings.values())
}

export const getLongestSubstrings = (text:string):any[][] => {
    text = formatString(text)
    text = text.toUpperCase()
    let res:any[][] = LRS(text)
    // sort res list by length of repeating substrings - highest at the start, and lowest at the end
    res.sort((a,b) => b[1] - a[1])
    return res 
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
                    if (individualFactors.get(i) == numGaps) {
                        // if individual factor has a count == to length of gaps this means they appear in all the gaps
                        factors.push(i)
                    }
                    if (gap/i !== i && interFactors.get(gap/i) === undefined) { 
                        interFactors.set(gap/i,1)
                        addToMap(individualFactors, gap/i)
                        if (individualFactors.get(gap/i) == numGaps) {
                            factors.push(gap/i)
                        }
                    }
                }
            }
        }
    }
    factors.sort() // uses insertion and merge sort to get O(nlogn) for time complexity
    return factors
}

export const getStats = (text:string) => {
    /* get longest repeating substrings - done 
     * get factors common to the gaps between substrings - for transposition ciphers - done
     * display stats updated - check stats section - done
     */
}