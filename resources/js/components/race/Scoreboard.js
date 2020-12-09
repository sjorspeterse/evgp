import React, {useState, useEffect} from "react"

const table = (cars, user, props) => {
    const userName = user.userName
    if(!cars) {
        return
    }

    let userCar = {} 
    for(let i = 0; i < cars.length; i++) {
        const car = cars[i]
        const carUser = car.user
        const carUserName = carUser.username
        if (carUserName == userName) {
            userCar = car.data
            break
        }
    }

    const fastestLapTime = userCar.fastestLapTime ? userCar.fastestLapTime : 0
    const heatLaps = userCar.heatLaps ? userCar.heatLaps : 0
    const lastLapTime = userCar.lastLapTime ? userCar.lastLapTime : 0
    const totalLaps = userCar.totalLaps ? userCar.totalLaps : 0

    cars.sort((a, b) => {
        // return < 0: a comes before b
        if (a.data.totalLaps > b.data.totalLaps) return -1
        if (a.data.totalLaps < b.data.totalLaps) return 1
        if (a.data.timeSinceLastFinish > b.data.timeSinceLastFinish) return -1
        if (a.data.timeSinceLastFinish < b.data.timeSinceLastFinish) return 1
        
        return 0
    })
    for(let i = 0; i < cars.length; i++) {
        cars[i].rank = i + 1
    }

    let tableBody = [];
    cars.forEach((car) => {
        const data = car.data
        const fastestLapTime = data.fastestLapTime ? data.fastestLapTime.toFixed(2) : "-"
        const lastLapTime = data.lastLapTime ? data.lastLapTime.toFixed(2) : "-"
        const heatLaps = data.heatLaps ? data.heatLaps : 0
        const totalLaps = data.totalLaps ? data.totalLaps : 0
        let extraTime = ""
        if(props.extraTime) {
            extraTime = " + " + data.extraTime.toFixed(1) + " sec"
            console.log("Extra time: ", extraTime)
        }
        tableBody.push(
            <tr key={car.user.username} className={(car.user.username === user.userName) ? "tableRow yellow" : "tableRow green"}>
                <td>{car.user.carNr}</td>
                <td style={{"textAlign": "left"}}>{car.user.fullName}</td>
                <td>{car.rank}</td>
                <td>{lastLapTime}</td>
                <td>{fastestLapTime}{extraTime}</td>
                <td>{heatLaps}</td>
                <td>{totalLaps}</td>
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

const handleAdmin = (admin, setHeat) => {
    if(admin.mode) {
        setHeat(getHeatState(admin))
    }
}

const Scoreboard = (props) => {
    const [heat, setHeat] = useState(getHeatState(props.admin))
    const initialize = () => {
        window.Echo.channel('adminState')
            .listen('AdminUpdated', (e) => {
                handleAdmin(e.adminState, setHeat)
            })
    }

    useEffect(initialize, [])

    const myTable = table(props.highScore, props.user, props)
    let heatNrFormatted = <></>
    if(heat) {
        heatNrFormatted = <> 
             <span className="fontHeader" style={{"fontWeight": "bold"}}>HEAT NUMBER:</span>
         <span className="fontHeader red" style={{"marginLeft": "2em"}} ><strong>{heat}</strong></span>
         </>
     }
    
    let timerFormatted = <></>
    if(props.timer) {
        const timeString = new Date(1000 * props.timer).toISOString().substr(14, 5)
        const minutes = timeString.substr(0, 2)
        const seconds = timeString.substr(3, 2)
        console.log("Timer: ", timeString)
        timerFormatted = <>
        <span className="fontHeader" style={{"margin": "1em"}} > TIME REMAINING THIS HEAT: </span>
        <span className="fontHeader red"> {minutes} MIN {seconds} SEC</span>
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