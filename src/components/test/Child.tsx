import { useState, useEffect, memo } from "react"

interface IChild{
    message:string,
    onReply: (text:string) => void
}

function Child({message, onReply}:IChild) {
const [childMessage, setChildMessage] = useState("")
    console.log("child loaded")
    useEffect(() => {
        //console.log("child loaded")
    }, []);


    return (
         <div style={{ border: "2px solid green", padding: "10px", margin: "10px 0" }}>
            <input type="text" value={childMessage} onChange={(e) => setChildMessage(e.currentTarget.value)}></input>
            <div>
            Am a Child and my parent told me to say: {message}
            </div>
            <div>
            Am a Child and I say: {childMessage}
            </div>            
            <div>
            <button onClick={() => onReply(childMessage)}>Send to my parent</button>
            </div>
        </div>
    )
}

export default memo(Child)