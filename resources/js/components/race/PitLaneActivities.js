import React, {useEffect} from "react"
import "./pit-lane-activities.css"

const getDriverChangeActivity = (carParams) => ({text: "Driver change", duration: carParams.driverTime})
const checkHelmetActivity = {text: "Checking helmet", duration: 1}
const checkMirrorsAcitivity = {text: "Checking mirrors", duration: 1}
const checkSeatbeltActivity = {text: "Checking belt", duration: 1}
const forgotHelmetActivity = {text: "Serving penalty: forgot helmet", duration: 10}
const forgotMirrorsActivity = {text: "Serving penalty: forgot mirrors", duration: 10}
const forgotSeatbeltActivity = {text: "Serving penalty: forgot seatbelt", duration: 10}
const droveTooFastActivity = {text: "Serving penalty: drove too fast in pit lane", duration: 30}

const timeLeft = (activity) => {
    if(!activity.startTime) {
        return activity.duration
    }
    const timeSinceStart = (activity.startTime + activity.duration * 1000 - Date.now()) / 1000
    return Math.max(timeSinceStart, 0)
}

const currentActivityStatus = (activity) => {
    const time = timeLeft(activity)
    if (time > 0) {
        return <span style={{"color": "white"}}> {" " + time.toFixed(0)} sec </span>
    } else {
        return <span style={{"color": "green"}}> Done </span>
    }
}

const totalRemainingTime = (list) => list.reduce((acc, cur) => acc + timeLeft(cur), 0)

const totalRemainingTimeDiv = (list) => {
const remainingTime = totalRemainingTime(list)
    return (
        <div className="pitLaneRow">
            <span style={{"color": "gray"}}>
                REMAINING TIME:
            </span> 
            <span style={{"color": "white"}}>
                {" " + remainingTime.toFixed(0)} SEC
            </span>
        </div>
    )
}

const PitLaneActivities = (props) => {
    const list = props.list.map((activity, i) => {
        return <div 
            key={i} 
            className="pitLaneRow" >
            <span style={{"color": "yellow"}}>
                {activity.text}:
            </span>
            {currentActivityStatus(activity)}
        </div>
    })

    const isReady = totalRemainingTime(props.list) == 0
    if(props.show) {
        useEffect(() => {
            props.setActiveButtons(old => ({...old, go: isReady, walkingSpeed: isReady, doNotPass: isReady})) 
        }, [props.list, props.show, isReady])
    }

    if (props.show) {
        return(
            <div className=" pitLaneActivitiesDiv scrollable border">
                <div className="pitLaneHeader">PIT LANE ACTIVITIES</div>
                {totalRemainingTimeDiv(props.list)}
                {list}
                {/* <div className="pitLaneRow"><span style={{"color": "yellow"}}>Driver change:</span> <span style={{"color": "green"}}>Done</span></div> */}
                {/* <div className="pitLaneRow"><span style={{"color": "yellow"}}>Ballast change:</span> <span style={{"color": "green"}}>Done</span></div> */}
                {/* <div className="pitLaneRow"><span style={{"color": "yellow"}}>Helmet/mirror/belt:</span> <span style={{"color": "green"}}>Checked</span></div> */}
                {/* <div className="pitLaneRow"><span style={{"color": "yellow"}}>Pit lane penalty:</span> <span style={{"color": "white"}}>12 sec</span></div> */}
            </div>
        )
    } else {
        return <></>
    }
}

export {PitLaneActivities, getDriverChangeActivity, checkHelmetActivity, checkMirrorsAcitivity, checkSeatbeltActivity,
    forgotHelmetActivity, forgotMirrorsActivity, forgotSeatbeltActivity, droveTooFastActivity}