import React from "react"
import './buttons.css'

const ControlButtons = () => {
    return (
        <div className="button-wrapper">
            <div className="controlButton stopButton redButton"><span>STOP</span></div>
            <div className="controlButton goButton greenButton"><span>GO</span></div>
            <div className="controlButton reduceThrottleButton whiteButton"> <span>REDUCE<br/>THROTTLE</span> </div>
            <div className="controlButton increaseThrottleButton whiteButton"> <span>INCREASE<br/>THROTTLE</span> </div> 
            <div className="controlButton doNotPassButton whiteButton"> <span>DO NOT<br/>PASS</span> </div> 
            <div className="controlButton pitLaneButton whiteButton"> <span>GO TO<br/>PIT LANE</span> </div> 
            <div className="controlButton repairFailureButton whiteButton"> <span>REPAIR<br/>FAILURE</span> </div> 
            <div className="controlButton walkingSpeedButton whiteButton"> <span>WALKING<br/>SPEED</span> </div> 
            <div className="controlButton checkSeatbeltButton whiteButton"> <span>CHECK<br/>SEATBELT</span> </div> 
            <div className="controlButton changeBallastButton whiteButton"> <span>CHANGE<br/>BALLAST</span> </div> 
            <div className="controlButton checkHelmetButton whiteButton"> <span>CHECK<br/>HELMET</span> </div> 
            <div className="controlButton checkMirrorsButton whiteButton"> <span>CHECK<br/>MIRRORS</span> </div> 
            <div className="controlButton swapBatteriesButton whiteButton"> <span>SWAP <br/>BATTERIES</span> </div> 
            <div className="controlButton chargeBatteriesButton whiteButton"> <span>CHARGE<br/>BATTERIES</span> </div> 
            <div className="controlButton resetControllerButton whiteButton"> <span>RESET<br/>CONTROLLER</span> </div> 
            <div className="controlButton resetCycleAnalystButton whiteButton"> <span>RESET CYCLE<br/>ANALYST</span> </div> 
        </div>
    )
}

export default ControlButtons