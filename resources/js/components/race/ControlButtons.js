import React from "react"
import './buttons.css'

const emptyButton = <div className="inactiveButton"></div>

const stopButton = (callback ) => 
    <div className="controlButton stopButton redButton"
        onClick={callback}
    ><span>STOP</span></div>

const goButton = (callback) =>
    <div className="controlButton goButton greenButton"
        onClick={callback} 
    ><span>GO</span></div>

const reduceThrottleButton = (callback) =>
    <div className="controlButton reduceThrottleButton whiteButton"
        onClick={callback}
    > <span>REDUCE<br/>THROTTLE</span> </div>

const increaseThrottleButton = (callback) =>
    <div className="controlButton increaseThrottleButton whiteButton"
        onClick={callback}
    > <span>INCREASE<br/>THROTTLE</span> </div> 

const doNotPassButton = (callback) =>
    <div className="controlButton doNotPassButton whiteButton"
        onClick={callback}
    > <span>DO NOT<br/>PASS</span> </div>

const goToPitLaneButton = (callback) =>
    <div className="controlButton pitLaneButton whiteButton"
        onClick={callback}
    > <span>GO TO<br/>PIT LANE</span> </div> 

const repairFailureButton = (callback) => 
    <div className="controlButton repairFailureButton whiteButton"
        onClick={callback}
    > <span>REPAIR<br/>FAILURE</span> </div> 

const walkingSpeedButton = (callback) => 
    <div className="controlButton walkingSpeedButton whiteButton"
        onClick={callback}
    > <span>WALKING<br/>SPEED</span> </div> 

const checkSeatbeltButton = (callback) => 
    <div className="controlButton checkSeatbeltButton whiteButton"
        onClick={callback}
    > <span>CHECK<br/>SEATBELT</span> </div> 

const changeBallastButton = (callback) =>
    <div className="controlButton changeBallastButton whiteButton"
        onClick={callback}
    > <span>CHANGE<br/>BALLAST</span> </div> 

const checkHelmetButton = (callback) => 
    <div className="controlButton checkHelmetButton whiteButton"
        onClick={callback}
    > <span>CHECK<br/>HELMET</span> </div> 

const checkMirrorsButton = (callback) =>
    <div className="controlButton checkMirrorsButton whiteButton"
        onClick={callback}
    > <span>CHECK<br/>MIRRORS</span> </div> 

const swapBatteriesButton = (callback) =>
    <div className="controlButton swapBatteriesButton whiteButton"
        onClick={callback}
    > <span>SWAP <br/>BATTERIES</span> </div> 

const chargeBatteriesButton = (callback) =>
    <div className="controlButton chargeBatteriesButton whiteButton"
        onClick={callback}
    > <span>CHARGE<br/>BATTERIES</span> </div> 

const resetControllerButton = (callback) =>
    <div className="controlButton resetControllerButton whiteButton"
        onClick={callback}
    > <span>RESET<br/>CONTROLLER</span> </div> 

const resetCycleAnalystButton = (callback) => 
    <div className="controlButton resetCycleAnalystButton whiteButton"
        onClick={callback}
    > <span>RESET CYCLE<br/>ANALYST</span> </div> 

const show = (button, status, callback=()=>console.log("not implemented yet")) => {
    return status ? button(callback) : emptyButton
}

const ControlButtons = (props) => {
    const status = props.activeButtons
    const callbacks = props.callbacks
    return (
        <div className="button-wrapper">
            {show(stopButton, status.stop)}
            {show(goButton, status.go, callbacks.go)}
            {show(reduceThrottleButton, status.reduceThrottle)}
            {show(increaseThrottleButton, status.increaseThrottle)}
            {show(doNotPassButton, status.doNotPass)}
            {show(goToPitLaneButton, status.goToPitLane, callbacks.goToPitLane)}
            {show(repairFailureButton, status.repairFailure)}
            {show(walkingSpeedButton, status.walkingSpeed, callbacks.walkingSpeed)}
            {show(checkSeatbeltButton, status.checkSeatbelt, callbacks.checkSeatbelt)}
            {show(checkHelmetButton, status.checkHelmet, callbacks.checkHelmet)}
            {show(checkMirrorsButton, status.checkMirrors, callbacks.checkMirrors)}
            {show(swapBatteriesButton, status.swapBatteries)}
            {show(chargeBatteriesButton, status.chargeBatteries)}
            {show(changeBallastButton, status.chargeBatteries)}
            {show(resetControllerButton, status.resetController)}
            {show(resetCycleAnalystButton, status.resetCycleAnalyst)}
        </div>
    )
}

export default ControlButtons