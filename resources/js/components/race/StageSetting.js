import React, {useState} from "react"
import "./stage-setting.css"

const StageSetting = (props) => {
    return (
        <>
            <div className="stageSettingsHeader">
                <span>STAGE SETTING: </span>
            <span style={{"color": "white"}}>{(props.currentStage+1)}</span></div>
            <div className="stageSettingsLane">LANE</div>
            <div className="laneButtons">
                <span className="laneButton selected"> Left </span>
                <span className="laneButton notSelected"> Center </span>
                <span className="laneButton notSelected"> Right </span>
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
}

export default StageSetting