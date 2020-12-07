import React, {useEffect} from "react"

const table = (cars, user) => {
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
        tableBody.push(
            <tr key={car.user.username} className={(car.user.username === user.userName) ? "tableRow yellow" : "tableRow green"}>
                <td>{car.user.carNr}</td>
                <td style={{"textAlign": "left"}}>{car.user.fullName}</td>
                <td>{car.rank}</td>
                <td>{lastLapTime}</td>
                <td>{fastestLapTime}</td>
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

const Scoreboard = (props) => {
    
    const myTable = table(props.highScore, props.user)

    return (
        <div style={{"marginLeft": "1vh", "height": "100%",}}>
            <div className="" style={{"height": "15%", "overflow": "hidden"}}>
                <span className="fontHeader" style={{"fontWeight": "bold"}}>HEAT NUMBER:</span>
                <span className="fontHeader red" style={{"marginLeft": "2em"}} ><strong>1</strong></span>
                <span style={{"float": "right", "marginRight": "1.5vw"}} >
                    {/* <span className="fontHeader" style={{"margin": "1em"}} > TIME REMAINING THIS HEAT: </span> */}
                    {/* <span className="fontHeader red"> 19 MIN 20 SEC </span> */}
                </span>
            </div>
            <div className="scrollable" style={{"height": "85%"}}>
                {myTable}
            </div>
        </div>
    )
}

export default Scoreboard