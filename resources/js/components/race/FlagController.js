import React, {useState} from "react"
import Flags from "./Flags"

const FlagController = (props) => {
    const [topColor, setTopColor] = useState("green")
    const [centerColor, setCenterColor] = useState("gone")
    const [bottomColor, setBottomColor] = useState("gone")

    const clickedTopFlag = () => {
        if(topColor==="green") setTopColor("yellow")
        if(topColor==="yellow") setTopColor("red")
        if(topColor==="red") setTopColor("green")
    }

    const clickedCenterFlag = () => {
        if(centerColor==="gone") setCenterColor("blue")
        if(centerColor==="blue") setCenterColor("white")
        if(centerColor==="white") setCenterColor("gone")
    }

    const clickedBottomFlag = () => {
        if(bottomColor==="gone") setBottomColor("black")
        if(bottomColor==="black") setBottomColor("gone")
    }

    return <Flags 
        topFlag={topColor} centerFlag={centerColor} bottomFlag={bottomColor} 
        clickedTopFlag={clickedTopFlag} clickedCenterFlag={clickedCenterFlag} clickedBottomFlag={clickedBottomFlag}
    />
}

export default FlagController