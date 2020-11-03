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
    const setRoadSide = props.setRoadSide
    const setThrottle = props.setThrottle

    return (
        <>
            <div className="stageSettingsHeader">
                <span>STAGE SETTING: </span>
                <span style={{"color": "white"}}>{(props.currentStage+1)}</span>
            </div>
            <div className="stageSettingsLane">LANE</div>
            <div className="laneButtons">
                <span className={"laneButton " + (getSelectedClass(roadSide, "Left"))}
                    onClick={() => setRoadSide(currentStage, "Left")}
                > Left </span>
                <span className={"laneButton " + (getSelectedClass(roadSide, "Center"))}
                    onClick={() => setRoadSide(currentStage, "Center")}
                > Center </span>
                <span className={"laneButton " + (getSelectedClass(roadSide, "Right"))}
                    onClick={() => setRoadSide(currentStage, "Right")} 
                > Right </span>
            </div>
            <div className="stageSettingsThrottle">THROTTLE</div>
            <div className="throttleButtons">
                <span className={"throttleButton " + (getSelectedClass(throttle, -1))}
                    onClick={() => setThrottle(currentStage, -1)} 
                >-1</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 0))}
                    onClick={() => setThrottle(currentStage, 0)} 
                >0</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 1))}
                    onClick={() => setThrottle(currentStage, 1)} 
                >1</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 2))}
                    onClick={() => setThrottle(currentStage, 2)} 
                >2</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 3))}
                    onClick={() => setThrottle(currentStage, 3)} 
                >3</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 4))}
                    onClick={() => setThrottle(currentStage, 4)} 
                >4</span>
                <span className={"throttleButton " + (getSelectedClass(throttle, 5))}
                    onClick={() => setThrottle(currentStage, 5)} 
                >5</span>
            </div>
        </>
    )
})

export default StageSetting