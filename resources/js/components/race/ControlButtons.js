import React from "react"
import './buttons.css'

const ControlButtons = () => {
    return (
        <div className="button-wrapper">
            <div className="controlButton stopButton redButton"><span>STOP</span></div>
            <div className="controlButton goButton greenButton"><span>GO</span></div>
            <div className="controlButton reduceThrottleButton whiteButton"> <span>REDUCE THROTTLE</span> </div>
            <div className="controlButton increaseThrottleButton whiteButton"> <span>INCREASE THROTTLE</span> </div> 
            <div className="controlButton doNotPassButton whiteButton"> <span>DO NOT PASS</span> </div> 
            <div className="controlButton pitLaneButton whiteButton"> <span>GO TO PIT LANE</span> </div> 
            <div className="controlButton repairFailureButton whiteButton"> <span>REPAIR FAILURE</span> </div> 
            <div className="controlButton walkingSpeedButton whiteButton"> <span>WALKING SPEED</span> </div> 
            <div className="controlButton checkSeatbeltButton whiteButton"> <span>CHECK SEATBELT</span> </div> 
            <div className="controlButton changeBallastButton whiteButton"> <span>CHANGE BALLAST</span> </div> 
            <div className="controlButton checkHelmetButton whiteButton"> <span>CHECK HELMET</span> </div> 
            <div className="controlButton checkMirrorsButton whiteButton"> <span>CHECK MIRRORS</span> </div> 
            <div className="controlButton swapBatteriesButton whiteButton"> <span>SWAP BATTERIES</span> </div> 
            <div className="controlButton chargeBatteriesButton whiteButton"> <span>CHARGE BATTERIES</span> </div> 
        </div>
    )
}

export default ControlButtons