import { formatString } from "./formatString"
export const getRows = (text:string, rowLength:number):string[] => {
    text = formatString(text)
    text = text.toUpperCase()
    let rows:string[] = []
    for (let i=0;i<text.length;i+=rowLength) {
        let sRow:string = text.substring(i, i+rowLength)
        rows.push(sRow)
    }
    return rows
}

export const getColumns = (text:string, rowLength:number):string[] => {
    let rows:string[] = getRows(text, rowLength)
    let columns:string[] = []
    for (let i=0; i<rowLength;i++) {
        let column:string = ""
        for (let row of rows) {
            column += row.charAt(i)
        }
        columns.push(column)
    }
    return columns
}