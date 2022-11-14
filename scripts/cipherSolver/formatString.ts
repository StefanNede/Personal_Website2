export const formatString = (text:string):string => {
    text = text.toLowerCase()
    text = text.replace(' ','')
    text = text.replace(/\s+/g, '') //removes spaces 
    text = text.replace(/(\r\n|\n|\r)/gm, "") //removes line breaks
    text= text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"") // remove punctuation
    text = text.replace(/\s{2,}/g," ") // remove spaces left over from punctuation
    return text
} 