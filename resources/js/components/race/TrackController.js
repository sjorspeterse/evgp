import React, {useEffect, useState} from "react"
import Track from "./Track";

const TrackController = () => {
    const [count, setCount] = useState(0)

    const sleep = (ms) => {
       return new Promise(resolve => setTimeout(resolve, ms));
     } 

    const initialize = () => {
        loop()
    }

    const loop = async () => {
        let c = 0
        while(true) {
            c++
            setCount(c)
            await sleep(50);
        }
    }

    useEffect(initialize, [])

    return (
        <div id="trackContainer"
            style={{
                "height": "100%",
                "margin": "auto",
            }}
        >
            <Track count={count}/> 
        </div> 
    )
    
} 

export default TrackController