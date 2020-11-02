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
    const roadSide = props.roadSide
    const currentStage = props.currentStage
    const setRoadSide = props.setRoadSide

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
                <span className="throttleButton notSelected">-1</span>
                <span className="throttleButton notSelected">0</span>
                <span className="throttleButton notSelected">1</span>
                <span className="throttleButton notSelected">2</span>
                <span className="throttleButton notSelected">3</span>
                <span className="throttleButton notSelected">4</span>
                <span className="throttleButton selected">5</span>
            </div>
        </>
    )
})

export default StageSetting