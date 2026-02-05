import { useCallback, useEffect, useState } from "react"
import Child from "./Child"
import Menu from "./Menu"

function Parent(){
    console.log("parent loaded")
    const [darkMode, setDarkMode] = useState(false)
    const [message, setMessage] = useState("default message")
    const [childMessages, setChildMessages] = useState(["pop"])

    const toggleDarkMode = useCallback(() => {
        setDarkMode(!darkMode)
        console.log("dark mode is now "+!darkMode)
    }, [darkMode])

    const handleMessage = useCallback((test: string) => {
        console.log("parent handling message: "+test)
        
        //setChildMessages( prev => [...childMessages, test])
        setChildMessages( prev => [...prev, test])
    },[])

    useEffect(() => {
        
    }, []);

    return(
        <>
        <Menu onToggle={toggleDarkMode}/>
        <div>Parent message:{message}</div>
        <div>Child message: {childMessages.join(", ")}</div>
        <Child message={message} onReply={handleMessage}/>
        <Child message={message} onReply={handleMessage}/>
        </>
    )
}

export default Parent