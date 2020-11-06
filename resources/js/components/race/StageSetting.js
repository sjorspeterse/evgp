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

    return (
        <>
            <div className="stageSettingsHeader">
                <span>STAGE SETTING: </span>
                <span style={{"color": "white"}}>{(props.currentStage+1)}</span>
            </div>
            <div className="stageSettingsLane">LANE</div>
            <div className="laneButtons">
                <span className={"laneButton " + (getSelectedClass(roadSide, "Left"))}
                    onClick={() => setControlPoint("Left", null)}
                > Left </span>
                <span className={"laneButton " + (getSelectedClass(roadSide, "Center"))}
                    onClick={() => setControlPoint("Center", null)}
                > Center </span>
                <span className={"laneButton " + (getSelectedClass(roadSide, "Right"))}
                    onClick={() => setControlPoint("Right", null)} 
                > Right </span>
            </div>
            <div className="stageSettingsThrottle">THROTTLE</div>
            <div className="throttleButtons">
                <span className={"throttleButton " + (getSelectedClass(throttle, -1))}
                    onClick={() => setControlPoint(null, -1)} 
                >-1</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 0))}
                    onClick={() => setControlPoint(null, 0)} 
                >0</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 1))}
                    onClick={() => setControlPoint(null, 1)} 
                >1</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 2))}
                    onClick={() => setControlPoint(null, 2)} 
                >2</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 3))}
                    onClick={() => setControlPoint(null, 3)} 
                >3</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 4))}
                    onClick={() => setControlPoint(null, 4)} 
                >4</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 5))}
                    onClick={() => setControlPoint(null, 5)} 
                >5</span>
            </div>
        </>
    )
})

export default StageSetting