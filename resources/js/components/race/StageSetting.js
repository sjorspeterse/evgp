import React, {useState} from "react"
import "./stage-setting.css"

const getSelectedClass = (name1, name2) => {
    if(name1 === name2) {
        return "selectd"
    } else {
        return "notSelected"
    }
}

const StageSetting = React.memo((props) => {
    const controlPoint = props.controlPoint
    const roadSide = controlPoint.lane
    const throttle = controlPoint.throttle
    const currentStage = props.currentStage
    const setControlPoint = (lane, throttle) => props.setControlPoint(currentStage, lane, throttle)


    const throttleButton = (number) => {
        return <span className={"throttleButton " + (getSelectedClass(throttle, number))}
            onClick={() => setControlPoint(null, number)} 
            onDoubleClick={() => props.setAllThrottles(number)}
        >{number}</span>
    }

    const laneButton = (lane) => {
        return <span className={"laneButton " + (getSelectedClass(roadSide, lane))}
            onClick={() => setControlPoint(lane, -2)}
        > {lane} </span>
    }

    return (
        <>
            <div className="stageSettingsHeader">
                <span>STAGE SETTING: </span>
                <span style={{"color": "white"}}>{(props.currentStage+1)}</span>
            </div>
    <div className="stageSettingsLane">LANE</div>
            <div className="laneButtons">
                {laneButton("Left")}
                {laneButton("Center")}
                {laneButton("Right")}
            </div>
            <div className="stageSettingsThrottle">THROTTLE</div>
            <div className="throttleButtons">
                {throttleButton(-1)}
                {throttleButton(0)}
                {throttleButton(1)}
                {throttleButton(2)}
                {throttleButton(3)}
                {throttleButton(4)}
                {throttleButton(5)}
            </div>
        </>
    )
})

export default StageSetting