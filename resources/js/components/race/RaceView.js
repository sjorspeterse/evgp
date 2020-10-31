import React from 'react';
import ReactDOM from 'react-dom';
import Scoreboard from "./Scoreboard"
import RaceControl from "./RaceControl"
import Anlyst from "./Analyst"
import Breakdowns from "./Breakdowns"
import Flags from "./Flags"
import '../../../css/app.css';
import './buttons.css'
import Logo from "../Logo";
import TrackController from "./TrackController";

const RaceView = (props) => {
    return (
        <div className="race-wrapper text-light" style={{"height": "95vh"}}>
            <div className="logo-div m-1"><Logo/></div>
            <div className="flags-div m-1 border"><Flags/></div>
            <div className="buttons-div m-1 border">
                <div className="button-wrapper">
                    <div className="controlButton stopButton redButton"><span>STOP</span></div>
                    <div className="controlButton goButton greenButton"><span>GO</span></div>
                    <div className="controlButton reduceThrottleButton whiteButton"> <span>REDUCE THROTTLE</span> </div>
                    <div className="controlButton increaseThrottleButtonx whiteButton"> 
                    <span>INCREASE THROTTLE</span> </div>
                </div>
            </div>
            <div className="highscore-div m-1 border"><Scoreboard/></div>
            <div className="track-div m-1 border"><TrackController user={props.user}/></div>
            <div className="voltage-div m-1 border"><Anlyst/></div>
            <div className="control-div m-1 border"><RaceControl/></div>
            <div className="breakdown-div m-1 border"><Breakdowns/></div>
            <div className="g-force-div m-1 border">G-FORCE</div>
        </div>
    );
}

export default RaceView;

let view =  document.getElementById('race_container')

if (view) {
    let json_user= view.getAttribute('user')
    let user = JSON.parse(json_user)
    console.log("RaceView: user = ", user)
    ReactDOM.render(<RaceView user={user}/>, view);
}
