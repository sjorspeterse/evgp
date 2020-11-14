import React, {useState} from "react"
import Flags from "./Flags"

const FlagController = (props) => {
    const [topColor, setTopColor] = useState("green")
    const [centerColor, setCenterColor] = useState("gone")
    const [bottomColor, setBottomColor] = useState("gone")

    const clickedTopFlag = () => {
        console.log("Clicked top flag! ")
        if(topColor==="green") setTopColor("yellow")
        if(topColor==="yellow") setTopColor("red")
        if(topColor==="red") setTopColor("green")
    }

    const clickedCenterFlag = () => {
        console.log("Clicked center flag! ")
        if(centerColor==="gone") setCenterColor("blue")
        if(centerColor==="blue") setCenterColor("white")
        if(centerColor==="white") setCenterColor("gone")
    }

    const clickedBottomFlag = () => {
        console.log("Clicked bottom flag! ")
        if(bottomColor==="gone") setBottomColor("black")
        if(bottomColor==="black") setBottomColor("gone")
    }

    return <Flags 
        topFlag={topColor} centerFlag={centerColor} bottomFlag={bottomColor} 
        clickedTopFlag={clickedTopFlag} clickedCenterFlag={clickedCenterFlag} clickedBottomFlag={clickedBottomFlag}
    />
}

export default FlagController