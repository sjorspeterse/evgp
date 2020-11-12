import React, {useEffect} from "react"


const table = (cars, user) => {
    const userName = user.userName
    if(!cars) {
        console.log("cars = ", cars, ", returning")
        return
    }

    let userCar = {} 
    console.log("cars to loop over: ", cars)
    for(let i = 0; i < cars.length; i++) {
        console.log("i = ", i)
        const car = cars[i]
        console.log("car: ", car)
        const carUser = car.user
        console.log("carUser: ", carUser)
        const carUserName = carUser.username
        console.log("carUserName: ", carUserName)
        if (carUserName == userName) {
            console.log("found user! ")
            userCar = car.data
            break
        }
    }

    console.log("userCar: ", userCar)
    const fastestLapTime = userCar.fastestLapTime
    const heatLaps = userCar.heatLaps
    const lastLapTime = userCar.lastLapTime
    const totalLaps = userCar.totalLaps


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
                <tr className="tableRow grey" style={{"borderBottom": "1px dashed"}}>
                    <td>051</td>
                    <td style={{"textAlign": "left"}}>TEAM LEADING THE RACE</td>
                    <td>1</td>
                    <td>91.28</td>
                    <td>88.63</td>
                    <td>20</td>
                    <td>66 + 03 sec</td>
                </tr>
                <tr className="tableRow green">
                    <td>999</td>
                    <td style={{"textAlign": "left"}}>TEAM DIRECTLY AHEAD</td>
                    <td>7</td>
                    <td>89.63</td>
                    <td>89.63</td>
                    <td>16</td>
                    <td>63 + 22 sec</td>
                </tr>
                <tr className="tableRow yellow">
                    <td>185</td>
                <td style={{"textAlign": "left"}}>{user.name}</td>
                    <td>8</td>
                    <td>{lastLapTime.toFixed(2)}</td>
                    <td>{fastestLapTime.toFixed(2)}</td>
                    <td>{heatLaps}</td>
                    <td>{totalLaps} + 05 sec</td>
                </tr>
                <tr className="tableRow green">
                    <td>007</td>
                    <td style={{"textAlign": "left"}}>TEAM DIRECTLY BEHIND</td>
                    <td>9</td>
                    <td>88.21</td>
                    <td>87.98</td>
                    <td>14</td>
                    <td>59 + 58 sec</td>
                </tr>
            </tbody>
        </table>
    )
}

const Scoreboard = (props) => {

    useEffect(() => console.log("cars: ", props.highScore), [props.highScore])
    
    const myTable = table(props.highScore, props.user)

    return (
        <div style={{"marginLeft": "1vh", "height": "100%",}}>
            <div className="" style={{"height": "15%", "overflow": "hidden"}}>
                <span className="fontHeader" style={{"fontWeight": "bold"}}>HEAT NUMBER:</span>
                <span className="fontHeader red" style={{"marginLeft": "2em"}} ><strong>2</strong></span>
                <span style={{"float": "right", "marginRight": "1.5vw"}} >
                    <span className="fontHeader" style={{"margin": "1em"}} > TIME REMAINING THIS HEAT: </span>
                    <span className="fontHeader red"> 19 MIN 20 SEC </span>
                </span>
            </div>
            <div className="scrollable" style={{"height": "85%"}}>
                {myTable}
            </div>
        </div>
    )
}

export default Scoreboard