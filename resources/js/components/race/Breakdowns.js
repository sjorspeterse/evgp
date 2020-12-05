import React, {useEffect} from "react"

export const getChassisBreakdown = (duration) => ({text: "Broken chassis", duration: duration})
export const getDrivesysBreakdown = (duration) => ({text: "Loose chain", duration: duration})
export const getWheelBreakdown = (duration) => ({text: "Loose spoke", duration: duration})

const timeLeft = (breakdown) => {
    if(!breakdown.startTime) {
        return breakdown.duration
    }
    const timeSinceStart = (breakdown.startTime + breakdown.duration * 1000 - Date.now()) / 1000
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

const totalRemainingTime = (list) => list.reduce((acc, cur) => acc + timeLeft(cur), 0)

const Breakdowns = (props) => {
    const activeList = props.list.filter(activity => timeLeft(activity) > 0)
    const doneList = props.list.filter(activity => timeLeft(activity) <= 0)
    const list = [...activeList, ...doneList]
    const formattedList = list.map((breakdown, i) => {
        return <div 
            key={i} 
            className="text-center" >
            <span className='yellow fontHeader'>
                {breakdown.text}:
            </span>
            {currentBreakdownStatus(breakdown)}
        </div>
    })
    const isReady = totalRemainingTime(props.list) == 0
    useEffect(() => {
        props.setActiveButtons(old => ({...old, go: isReady, walkingSpeed: isReady, doNotPass: isReady})) 
    }, [props.list, isReady])
    return (
        <div className="p-2" style={{"height": "100%", "overflow":"hidden"}}>
            <h2 className='red text-center sectionHeader' style={{"paddingBottom": "0px"}}>BREAKDOWNS</h2>
            {formattedList}
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