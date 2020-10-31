import React from "react"

const ControlButtons = () => {
    return (
        <div className="button-wrapper">
            <div className="controlButton stopButton redButton"><span>STOP</span></div>
            <div className="controlButton goButton greenButton"><span>GO</span></div>
            <div className="controlButton reduceThrottleButton whiteButton"> <span>REDUCE THROTTLE</span> </div>
            <div className="controlButton increaseThrottleButtonx whiteButton"> 
            <span>INCREASE THROTTLE</span> </div>
        </div>
    )
}

export default ControlButtons