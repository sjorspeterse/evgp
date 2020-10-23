import React from "react"

const Scoreboard = () => {
    return (
        <div className="border border-light ml-1 p-2" style={{"color": "white", "height": "100%"}}>
            <strong>HEAT NUMBER:</strong>
            <span style={{"color": "red", "marginLeft": "2em"}} ><strong>2</strong></span>
            <span style={{"float": "right", "marginRight": "1.5em"}} >
                <span style={{"margin": "1em"}} >
                    <strong>TIME REMAINING THIS HEAT: </strong>
                </span>
                <span style={{"color": "red"}} >
                    <strong>19 MIN 20 SEC</strong>
                </span>
            </span>
            <table className="scoreboard mt-2"><tbody>
                <tr>
                    <th>CAR NO.</th>
                    <th style={{"textAlign": "left"}}>TEAM</th>
                    <th>LAST LAP <br/> (SECONDS)</th>
                    <th>FASTEST LAP <br/> (SECONDS)</th>
                    <th>NO. OF LAPS <br/>THIS HEAT</th>
                    <th>OVERALL LAPS <br/> + EXTRA TIME</th>
                </tr>
                <tr>
                    <td>999</td>
                    <td style={{"textAlign": "left"}}>Best High School on Earth</td>
                    <td>91.28</td>
                    <td>88.63</td>
                    <td>16</td>
                    <td>63 + 22 sec</td>
                </tr>
                <tr>
                    <td>185</td>
                    <td style={{"textAlign": "left"}}>Second Best High School on Earth</td>
                    <td>89.63</td>
                    <td>89.63</td>
                    <td>17</td>
                    <td>62 + 05 sec</td>
                </tr>
                <tr>
                    <td>007</td>
                    <td style={{"textAlign": "left"}}>Third Best High School on Earth</td>
                    <td>88.21</td>
                    <td>87.98</td>
                    <td>17</td>
                    <td>59 + 58 sec</td>
                </tr>
                <tr><td>.</td><td style={{"textAlign": "left"}}>.</td><td>.</td><td>.</td><td>.</td><td>.</td></tr>
                <tr><td>.</td><td style={{"textAlign": "left"}}>.</td><td>.</td><td>.</td><td>.</td><td>.</td></tr>
                <tr><td>.</td><td style={{"textAlign": "left"}}>.</td><td>.</td><td>.</td><td>.</td><td>.</td></tr>
                <tr><td>.</td><td style={{"textAlign": "left"}}>.</td><td>.</td><td>.</td><td>.</td><td>.</td></tr>
                <tr><td>.</td><td style={{"textAlign": "left"}}>.</td><td>.</td><td>.</td><td>.</td><td>.</td></tr>
                <tr><td>.</td><td style={{"textAlign": "left"}}>.</td><td>.</td><td>.</td><td>.</td><td>.</td></tr>
            </tbody></table>
        </div>
    )
}

export default Scoreboard