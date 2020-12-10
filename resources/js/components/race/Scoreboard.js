import React, {useState, useEffect} from "react"

const sortByTotalLaps = (cars) => {
    cars.sort((a, b) => {
        // return < 0: a comes before b
        if (a.data.totalLaps > b.data.totalLaps) return -1
        if (a.data.totalLaps < b.data.totalLaps) return 1
        if (a.data.timeSinceLastFinish > b.data.timeSinceLastFinish) return -1
        if (a.data.timeSinceLastFinish < b.data.timeSinceLastFinish) return 1
        
        return 0
    })
}

const sortByFastestLap = (cars) => {
    cars.sort((a, b) => {
        if (a.data.fastestLapTime < b.data.fastestLapTime) return -1
        return 1
    })
}

const sortCars = (cars, sortMode) => {
    if (sortMode === "Total laps") {
        sortByTotalLaps(cars)
    }
    if (sortMode === "Fastest lap") {
        sortByFastestLap(cars)
    }
}

const myRank = (cars, user) => {
    for(let i = 0; i < cars.length; i++) {
        if(cars[i].user.username === user.userName) {
            return cars[i].rank
        }
    }
    return 0
}

const table = (cars, user) => {
    for(let i = 0; i < cars.length; i++) {
        const rank = i + 1
        cars[i].rank = rank
    }

    let tableBody = [];
    cars.forEach((car) => {
        const data = car.data
        const fastestLapTime = data.fastestLapTime ? data.fastestLapTime.toFixed(2) : "-"
        const lastLapTime = data.lastLapTime ? data.lastLapTime.toFixed(2) : "-"
        const heatLaps = data.heatLaps ? data.heatLaps : 0
        const totalLaps = data.totalLaps ? data.totalLaps : 0
        let extraTime = ""
        if(data.extraTime) {
            extraTime = " + " + data.extraTime.toFixed(1) + " sec"
        }
        tableBody.push(
            <tr key={car.user.username} className={(car.user.username === user.userName) ? "tableRow yellow" : "tableRow green"}>
                <td>{car.user.carNr}</td>
                <td style={{"textAlign": "left"}}>{car.user.fullName}</td>
                <td>{car.rank}</td>
                <td>{lastLapTime}</td>
                <td>{fastestLapTime}</td>
                <td>{heatLaps}</td>
                <td>{totalLaps}{extraTime}</td>
            </tr>
        )
    })

    return (
        <table className="scoreboard" style={{}}>
            <thead>
                <tr className="tableRow">
                    <th>CAR NO.</th>
                    <th style={{"textAlign": "left"}}>TEAM</th>
                    <th>RANK</th>
                    <th>LAST LAP</th>
                    <th>FASTEST LAP</th>
                    <th>NO. OF LAPS</th>
                    <th>OVERALL LAPS</th>
                </tr>
            </thead>
            <tbody className="scrollableSjors">
                {tableBody}
            </tbody>
        </table>
    )
}

const getHeatState = (admin) => {
    if(admin.mode === "Heat 1")  return 1 
    if(admin.mode === "Heat 2")  return 2
    return 0
}

const handleAdmin = (admin, setHeat, setTimeRemainingText) => {
    if(admin.mode) {
        setHeat(getHeatState(admin))
        const mode = admin.mode
        if(mode === 'Break 0') setTimeRemainingText(" QUALIFICATION STARTS IN: ")
        if(mode === 'Qualification') setTimeRemainingText(" QUALIFICATION ENDS IN: ")
        if(mode === 'Break 1') setTimeRemainingText(" HEAT 1 STARTS IN: ")
        if(mode === 'Heat 1') setTimeRemainingText(" TIME REMAINING THIS HEAT: ")
        if(mode === 'Break 2') setTimeRemainingText(" HEAT 2 STARTS IN: ")
        if(mode === 'Heat 2') setTimeRemainingText(" TIME REMAINING THIS HEAT: ")
    }
}

const Scoreboard = (props) => {
    const [heat, setHeat] = useState(getHeatState(props.admin))
    const [timeRemainingText, setTimeRemainingText] = useState("")

    useEffect(() => handleAdmin(props.admin, setHeat, setTimeRemainingText), [props.admin])
    const cars = props.highScore
    sortCars(cars, props.admin.sort)
    useEffect(() => {
        const rank = myRank(cars, props.user)
        props.setRank(rank)
    })
    const myTable = table(cars, props.user)
    let heatNrFormatted = <></>
    if(heat) {
        heatNrFormatted = <> 
             <span className="fontHeader" style={{"fontWeight": "bold"}}>HEAT NUMBER:</span>
         <span className="fontHeader red" style={{"marginLeft": "2em"}} ><strong>{heat}</strong></span>
         </>
     }
    
    let timerFormatted = <></>
    if(props.timer) {
        const sign = props.timer < 0 ? "-" : ""
        const timeString = new Date(1000 * Math.abs(props.timer)).toISOString().substr(14, 5)
        const minutes = timeString.substr(0, 2)
        const seconds = timeString.substr(3, 2)
        timerFormatted = <>
        <span className="fontHeader" style={{"margin": "1em"}} > {timeRemainingText} </span>
        <span className="fontHeader red"> {sign}{minutes} MIN {seconds} SEC</span>
        </>
    }
       
    return (
        <div style={{"marginLeft": "1vh", "height": "100%",}}>
            <div className="" style={{"height": "15%", "overflow": "hidden"}}>
                {heatNrFormatted}
                <span style={{"float": "right", "marginRight": "1.5vw"}} >
                    {timerFormatted}
                </span>
            </div>
            <div className="scrollable" style={{"height": "85%"}}>
                {myTable}
            </div>
        </div>
    )
}

export default Scoreboard