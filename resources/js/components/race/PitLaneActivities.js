import React from "react"
import "./pit-lane-activities.css"

const timeLeft = (activity) => {
    if(activity.startTime) {
        return (activity.startTime + activity.duration * 1000 - Date.now()) / 1000
    } else {
        return activity.duration
    }
}

const activityStatus = (activity) => {
    const time = timeLeft(activity)
    if (time > 0) {
        return <span style={{"color": "white"}}> {" " + time.toFixed(0)} sec </span>
    } else {
        return <span style={{"color": "green"}}> Done </span>
    }
}

const remainingTime = (list) => list.reduce((acc, cur) => acc + timeLeft(cur), 0)

const StageSetting = (props) => {

    const list = props.list.map((activity, i) => {
        return <div 
            key={i} 
            className="pitLaneRow" >
            <span style={{"color": "yellow"}}>
                {activity.text}:
            </span>
            {activityStatus(activity)}
        </div>
    })

    if (props.show) {
        return(
            <div className=" pitLaneActivitiesDiv border">
                <div className="pitLaneHeader">PIT LANE ACTIVITIES</div>
                <div className="pitLaneRow">
                    <span style={{"color": "gray"}}>
                        REMAINING TIME:
                    </span> 
                    <span style={{"color": "white"}}>
                        {" " + remainingTime(props.list).toFixed(0)} SEC
                    </span>
                </div>
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

export default StageSetting