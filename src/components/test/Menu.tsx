import { useState } from "react"

interface IMenu{
    onToggle: () => void
}

function Menu({onToggle}:IMenu) { 
    //const [ischecked, setIsChecked] = useState(true)

    return (
        <>
            <input type="checkbox" onClick={() => onToggle()}/>
        </>
    )
}

export default Menu
