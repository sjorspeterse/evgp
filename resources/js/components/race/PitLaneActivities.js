import React from "react"
import "./pit-lane-activities.css"

const StageSetting = (props) => {

    if (props.show) {
        return(
            <div className=" pitLaneActivitiesDiv border">
                <div className="pitLaneHeader">PIT LANE ACTIVITIES</div>
                <div className="pitLaneRow"><span style={{"color": "gray"}}>REMAINING TIME:</span> <span style={{"color": "white"}}>12 SEC</span></div>
                <div className="pitLaneRow"><span style={{"color": "yellow"}}>Driver change:</span> <span style={{"color": "green"}}>Done</span></div>
                <div className="pitLaneRow"><span style={{"color": "yellow"}}>Ballast change:</span> <span style={{"color": "green"}}>Done</span></div>
                <div className="pitLaneRow"><span style={{"color": "yellow"}}>Helmet/mirror/belt:</span> <span style={{"color": "green"}}>Checked</span></div>
                <div className="pitLaneRow"><span style={{"color": "yellow"}}>Pit lane penalty:</span> <span style={{"color": "white"}}>12 sec</span></div>
            </div>
        )
    } else {
        return <></>
    }
}

export default StageSetting