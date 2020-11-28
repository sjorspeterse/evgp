import React from "react"
import './buttons.css'

const stopText = <>STOP</>
const goText = <>GO</>
const reduceThrottleText = <>REDUCE<br/>THROTTLE</>
const increaseThrottleText = <>INCREASE<br/>THROTTLE</>  
const doNotPassText = <>DO NOT<br/>PASS</>
const goToPitLaneText = <>GO TO<br/>PIT LANE</>
const repairFailureText = <>REPAIR<br/>FAILURE</>
const walkingSpeedText = <>WALKING<br/>SPEED</> 
const checkSeatbeltText = <>CHECK<br/>SEATBELT</>
const changeBallastText = <>CHANGE<br/>BALLAST</>
const checkHelmetText = <>CHECK<br/>HELMET</>
const checkMirrorsText = <>CHECK<br/>MIRRORS</>
const swapBatteriesText = <>SWAP <br/>BATTERIES</>
const chargeBatteriesText = <>CHARGE<br/>BATTERIES</>
const resetControllerText = <>RESET<br/>CONTROLLER</> 
const resetCycleAnalystText = <>RESET CYCLE<br/>ANALYST</>

const defaultCallback = () => console.log("Not implemented yet. SAD!")
const noOp = () => {}

const generalWhiteButton = (buttonClassName, buttonText, status, callback=defaultCallback, release=noOp) => {
    const clickable = status ? "clickable white-clickable" : ""
    return <div className={"controlButton " + buttonClassName + " whiteButton " + clickable}
                onMouseDown={clickable ? callback : noOp}
                onMouseUp={clickable ? release: noOp}
            > <span>{buttonText}</span> </div> 
}

const stopButton = (status, callback=defaultCallback) => {
    const clickable = status ? "clickable red-clickable" : ""
    return <div className={"controlButton stopButton redButton " + clickable} 
        onClick={clickable ? callback : noOp}
    ><span>{stopText}</span></div>
}

const goButton = (status, callback=defaultCallback) => {
    const clickable = status ? "clickable green-clickable" : ""
    return <div className={"controlButton goButton greenButton " + clickable}
        onClick={clickable ? callback : noOp} 
    ><span>{goText}</span></div>
}

const ControlButtons = (props) => {
    const status = props.activeButtons
    const callbacks = props.callbacks
    return (
        <div className="button-wrapper">
            {stopButton(status.stop, callbacks.stop)}
            {goButton(status.go, callbacks.go)}
            {generalWhiteButton("reduceThrottleButton", reduceThrottleText, status.reduceThrottle, callbacks.reduceThrottle, callbacks.reduceReleased)}
            {generalWhiteButton("increaseThrottleButton", increaseThrottleText, status.increaseThrottle, callbacks.increaseThrottle, callbacks.increaseReleased)}
            {generalWhiteButton("doNotPassButton", doNotPassText, status.doNotPass, callbacks.doNotPass)}
            {generalWhiteButton("goToPitLaneButton", goToPitLaneText, status.goToPitLane, callbacks.goToPitLane)}
            {generalWhiteButton("repairFailureButton", repairFailureText, status.repairFailure, callbacks.repairFailure)}
            {generalWhiteButton("walkingSpeedButton", walkingSpeedText, status.walkingSpeed, callbacks.walkingSpeed)}
            {generalWhiteButton("checkSeatbeltButton", checkSeatbeltText, status.checkSeatbelt, callbacks.checkSeatbelt)}
            {generalWhiteButton("checkHelmetButton", checkHelmetText, status.checkHelmet, callbacks.checkHelmet)}
            {generalWhiteButton("checkMirrorsButton", checkMirrorsText, status.checkMirrors, callbacks.checkMirrors)}
            {generalWhiteButton("swapBatteriesButton", swapBatteriesText, status.swapBatteries, callbacks.swapBatteries)}
            {generalWhiteButton("chargeBatteriesButton", chargeBatteriesText, status.chargeBatteries, callbacks.chargeBatteries)}
            {generalWhiteButton("changeBallastButton", changeBallastText, status.changeBallast, callbacks.changeBallast)}
            {generalWhiteButton("resetControllerButton", resetControllerText, status.resetController, callbacks.resetController)}
            {generalWhiteButton("resetCycleAnalystButton", resetCycleAnalystText, status.resetCycleAnalyst, callbacks.resetCycleAnalyst)}
        </div>
    )
}

export default ControlButtons