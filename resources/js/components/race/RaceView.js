import React from 'react';
import ReactDOM from 'react-dom';
import Scoreboard from "./Scoreboard"
import ControlButtons from "./ControlButtons"
import RaceControl from "./RaceControl"
import Anlyst from "./Analyst"
import Breakdowns from "./Breakdowns"
import Flags from "./Flags"
import '../../../css/app.css';
import Logo from "../Logo";
import TrackController from "./TrackController";

const RaceView = (props) => {
    return (
        <div className="race-wrapper text-light" style={{"height": "95vh"}}>
            <div className="logo-div m-1"><Logo/></div>
            <div className="flags-div m-1 border"><Flags/></div>
            <div className="buttons-div m-1 border"><ControlButtons/></div>
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
