import {useState} from "react"

interface Props {
    num: number
}

export const NumberPad : React.FC<Props> = ({num}) => {
    return (
        <div>
            <main>
                <p>Count is: {num}</p>
            </main>
        </div>
    )

}