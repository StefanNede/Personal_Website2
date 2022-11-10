export const formatString = (text:string):string => {
    text = text.toLowerCase()
    text = text.replace(' ','')
    text = text.replace(/\s+/g, '') //removes spaces 
    text = text.replace(/(\r\n|\n|\r)/gm, "") //removes line breaks
    return text
} 