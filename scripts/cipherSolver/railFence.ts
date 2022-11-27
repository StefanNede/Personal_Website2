import { bigramFitness } from "./fitness"
import { formatString } from "./formatString"

const reverseString = (str:string):string => {
    let res:string = ""
    for (let i=str.length-1;i>=0;i--) {
        res += str[i]
    }
    return res
}

const decode = (text:string, rails:number):string => {
    /* formula is 
    1 = (L+y)/(N+((N-1)*x))
    L = length of string 
    y = empty spaces at the end 
    N = rails
    x + 1 = number of diagonals used

    increment x until the denominator is greater than the numerator
    then solve for y
    */
    let decoded:string = ""
    let l:number = text.length
    let n:number = rails
    let x:number = 0
    let y:number = 0
    let numerator:number = l + y
    let denominator = n + (n-1)*x
    // get x
    while (denominator <= numerator) {
        x += 1
        denominator = n + (n-1)*x
    }
    // get y - FIX THIS - sometimes y can be 'negative' as in a diagonal going up is not fully filled
    while (numerator != denominator) {
        y += 1
        numerator = l + y
    }
        
    let numDiagonals = x + 1
    // numDiagonals - 2 is the number of characters in the top and bottom row
    // numDiagonals is the number of characters in the middle rows
    let rows:string[] = []
    let previousIndex:number = 0
    for (let j=0;j<rails;j++) {
        if (j === 0) {
            // FIX THIS
            rows.push(text.substring(0, numDiagonals-2))
            previousIndex = numDiagonals-2
        } else if (j === rails-1) {
            // apply the empty spaces 
            if (j >= rails - y) {
                rows.push(text.substring(previousIndex, text.length) + " ")
            } else {
                rows.push(text.substring(previousIndex, text.length))
            }
        } else {
            // apply the empty spaces 
            if (j >= rails - y) {
                rows.push(text.substring(previousIndex, text.length-2) + " ")
                previousIndex += numDiagonals-1
            } else {
                rows.push(text.substring(previousIndex, previousIndex + numDiagonals))
                previousIndex += numDiagonals
            }
        }
    }

    console.log(rows)
    let topCounter:number = 0
    let topHappened:boolean = false
    let bottomCounter:number = 0
    let bottomHappened:boolean = false

    for (let k=0; k<numDiagonals ;k++) {
        let inter:string = ""
        if (!topHappened) {
            inter += rows[0][topCounter]
        }
        for (let m=1;m<rows.length-1;m++) {
            inter += rows[m][k]
        }
        if (!bottomHappened) {
            inter += rows[rows.length-1][bottomCounter]
        }

        if (topCounter === 0) {
            topCounter++
        } else if (topHappened) {
            topHappened = false
            if (topCounter < rows[0].length - 1) {
                topCounter++
            }
        } else {
            topHappened = true
        }

        if (bottomHappened) {
            bottomHappened = false
            if (bottomCounter < rows[rows.length-1].length-1) {
                bottomCounter++
            }
        } else {
            bottomHappened = true
        }

        if (k % 2 == 1) {
            // reverse the order 
            inter = reverseString(inter)
        }
        decoded += inter
        
    }
    // console.log(decoded)

    return decoded
}


export const getRailfenceDecode = (text:string):any[] => {
    // try rails and stop at the best bigram fitness - try 20 rails     
    // alternatively use chi squared and when you get to a value similar to english stop, otherwise continue until 50 rails and return the best one
    let decoded:string = ""
    let bestFitness:number = bigramFitness(text)
    let key:number = 1
    text = formatString(text)
    console.log(text)
    text = text.toUpperCase()
    for (let i = 2; i<=20; i++) {
        let interDecoded:string = decode(text, i)
        console.log(i, interDecoded)
        let interFitness:number = bigramFitness(interDecoded)
        if (interFitness > bestFitness) {
            decoded = interDecoded
            bestFitness = interFitness
            key = i
        }
        
    }
    return [`num rails: ${key}`, decoded]
}