import { formatString } from "./formatString"
import { getIoc } from "./ioc"
import { getFactorsCommon, getLongestSubstrings } from "./stats"

export const getPeriodLRS = (text:string):number[] => {
    let lrs:any[][] = getLongestSubstrings(text)
    let allGaps:number[] = []
    let gapCounts:Map<number,number> = new Map() // to make sure we don't add duplicate gaps to allGaps
    // get all the distinct gaps
    for (let r of lrs) {
        let gaps:number[] = r[3]
        for (let gap of gaps) { 
            if (gapCounts.get(gap) === undefined) {
                allGaps.push(gap) 
                gapCounts.set(gap, 1)
            }
        }
    }
    let periods:number[] = getFactorsCommon(allGaps)
    return periods
}

export const getColumns = (text:string, period:number):string[] => {
    let columns:string[] = []
    for (let k=0;k<period;k++) {
        columns.push("")
    }

    text = formatString(text)
    let interText:string = text
    while (interText.length%period !== 0) {
        interText += " "
    }

    // get columns
    for (let i=0;i<=interText.length-period;i+=period) {
        let row:string = interText.substring(i, i+period)
        for (let j=0;j<row.length;j++) {
            columns[j] += row[j]
        }
    }
    return columns
}

export const getPeriodIOC = (text:string):number => {
    // for a period n get the iocs of all the columns and average them
    // make a note of the greatest average ioc, and the period used for it 
    // repeat for values of n until you get another average ioc that is similar
    // to the greatest one - check if the first period that got that ioc is a factor of
    // the one you just tested, in which case the first period is likely to be the correct one
    let bestIOC:number = 0
    let bestPeriod:number = 0
    let bestPeriods:number[] = []
    let currentPeriod = 2
    while (currentPeriod <= 100) {
        let columns:string[] = getColumns(text, currentPeriod)
        let iocSum = 0
        let iocCount = 0
        let averageIOC = 0
        for (let column of columns) {
            let columnIOC = getIoc(column)
            iocSum += columnIOC
            iocCount++
        }
        averageIOC = iocSum/iocCount
        // check if averageIOC close to bestIOC
        if (Math.abs(bestIOC-averageIOC) <= 0.1 && currentPeriod%bestPeriod === 0 && currentPeriod>=10) {
            break
        }
        else if (averageIOC > bestIOC) {
            bestIOC = averageIOC
            bestPeriod = currentPeriod
        }

        currentPeriod++
    }

    return bestPeriod
}