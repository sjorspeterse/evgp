import React from "react"
import './buttons.css'

const emptyButton = <div className="inactiveButton"></div>

const stopButton = <div className="controlButton stopButton redButton"><span>STOP</span></div>

const goButton = 
    <div className="controlButton goButton greenButton"
        onClick={() => props.go()} 
    ><span>GO</span></div>

const reduceThrottleButton = 
    <div className="controlButton reduceThrottleButton whiteButton"> <span>REDUCE<br/>THROTTLE</span> </div>

const increaseThrottleButton =
    <div className="controlButton increaseThrottleButton whiteButton"> <span>INCREASE<br/>THROTTLE</span> </div> 

const doNotPassButton = 
    <div className="controlButton doNotPassButton whiteButton"> <span>DO NOT<br/>PASS</span> </div>

const goToPitLaneButton = 
    <div className="controlButton pitLaneButton whiteButton"
        onClick={() => props.goToPitLane()}
    > <span>GO TO<br/>PIT LANE</span> </div> 

const repairFailureButton = 
    <div className="controlButton repairFailureButton whiteButton"> <span>REPAIR<br/>FAILURE</span> </div> 

const walkingSpeedButton = 
    <div className="controlButton walkingSpeedButton whiteButton"
        onClick={() => props.walkingSpeed()}
    > <span>WALKING<br/>SPEED</span> </div> 

const checkSeatbeltButton = 
    <div className="controlButton checkSeatbeltButton whiteButton"> <span>CHECK<br/>SEATBELT</span> </div> 

const changeBallastButton = 
    <div className="controlButton changeBallastButton whiteButton"> <span>CHANGE<br/>BALLAST</span> </div> 

const checkHelmetButton = 
    <div className="controlButton checkHelmetButton whiteButton"> <span>CHECK<br/>HELMET</span> </div> 

const checkMirrorsButton = 
    <div className="controlButton checkMirrorsButton whiteButton"> <span>CHECK<br/>MIRRORS</span> </div> 

const swapBatteriesButton = 
    <div className="controlButton swapBatteriesButton whiteButton"> <span>SWAP <br/>BATTERIES</span> </div> 

const chargeBatteriesButton = 
    <div className="controlButton chargeBatteriesButton whiteButton"> <span>CHARGE<br/>BATTERIES</span> </div> 

const resetControllerButton = 
    <div className="controlButton resetControllerButton whiteButton"> <span>RESET<br/>CONTROLLER</span> </div> 

const resetCycleAnalystButton =
    <div className="controlButton resetCycleAnalystButton whiteButton"> <span>RESET CYCLE<br/>ANALYST</span> </div> 

const show = (button, status) => {
    return status ? button : emptyButton
}

const ControlButtons = (props) => {
    const status = props.activeButtons
    return (
        <div className="button-wrapper">
            {show(stopButton, status.stop)}
            {show(goButton, status.go)}
            {show(reduceThrottleButton, status.reduceThrottle)}
            {show(increaseThrottleButton, status.increaseThrottle)}
            {show(doNotPassButton, status.doNotPass)}
            {show(goToPitLaneButton, status.goToPitLane)}
            {show(repairFailureButton, status.repairFailure)}
            {show(walkingSpeedButton, status.walkingSpeed)}
            {show(checkSeatbeltButton, status.checkSeatbelt)}
            {show(checkHelmetButton, status.checkHelmet)}
            {show(checkMirrorsButton, status.checkMirrors)}
            {show(swapBatteriesButton, status.swapBatteries)}
            {show(chargeBatteriesButton, status.chargeBatteries)}
            {show(changeBallastButton, status.chargeBatteries)}
            {show(resetControllerButton, status.resetController)}
            {show(resetCycleAnalystButton, status.resetCycleAnalyst)}
        </div>
    )
}

export default ControlButtons