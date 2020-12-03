import React from "react"

export const getChassisBreakdown = (repairTime) => ({text: "Broken chassis", repairTime: repairTime})
export const getDrivesysBreakdown = (repairTime) => ({text: "Loose chain", repairTime: repairTime})
export const getWheelBreakdown = (repairTime) => ({text: "Loose spoke", repairTime: repairTime})

const timeLeft = (breakdown) => {
    if(!breakdown.startTime) {
        return breakdown.repairTime
    }
    const timeSinceStart = (breakdown.startTime + breakdown.repairTime * 1000 - Date.now()) / 1000
    return Math.max(timeSinceStart, 0)
}

const currentBreakdownStatus = (breakdown) => {
    const time = timeLeft(breakdown)
    if (time > 0) {
        return <span className='fontHeader'>{" " + time.toFixed(0)} sec</span>
    } else {
        return <span className='fontHeader green'> fixed</span>
    }
}

const Breakdowns = (props) => {
    const list = props.list.map((breakdown, i) => {
        return <div 
            key={i} 
            className="text-center" >
            <span className='yellow fontHeader'>
                {breakdown.text}:
            </span>
            {currentBreakdownStatus(breakdown)}
        </div>
    })
    return (
        <div className="p-2" style={{"height": "100%", "overflow":"hidden"}}>
            <h2 className='red text-center sectionHeader' style={{"paddingBottom": "0px"}}>BREAKDOWNS</h2>
            {list}
            {/* <div className='text-center'> */}
                {/* <span className='yellow fontHeader'>Loose chain: </span><span className='fontHeader'>20 sec</span> */}
            {/* </div> */}
            {/* <div className='text-center'> */}
                {/* <span className='yellow fontHeader'>Loose connector: </span><span className='fontHeader green'>fixed</span> */}
            {/* </div> */}
        </div>
    )
}

export default Breakdowns