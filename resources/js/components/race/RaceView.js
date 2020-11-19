import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Scoreboard from "./Scoreboard"
import ControlButtons from "./ControlButtons"
import RaceControl from "./RaceControl"
import Analyst from "./Analyst"
import Breakdowns from "./Breakdowns"
import FlagController from "./FlagController"
import GForce from "./GForce"
import '../../../css/app.css';
import Logo from "../Logo";
import TrackController from "./TrackController";
const RaceView = (props) => {
    const [analystData, setAnalystData] = useState({speed: 0, voltage: 0, current: 0, ampHours: 0, power: 0, wattHours: 0})
    const [gForce, setGForce] = useState([0, 0])
    const [highScore, setHighScore] = useState()
    const [buttonCallbacks, setButtonCallbacks] = useState({})

    const [activeButtons, setActiveButtons] = useState({
        stop: false, go: true, reduceThrottle: false, increaseThrottle: false,
        doNotPass: false, goToPitLane: true, repairFailure: false, walkingSpeed: true,
        checkSeatbelt: false, changeBallast: false, checkHelmet: false, checkMirrors: false,
        swapBatteries: false, chargeBatteries: false, resetController: false, resetCycleAnalyst: false
    })

    return (
        <div className="race-wrapper text-light" style={{"height": "95vh"}}>
            <div className="logo-div m-1"><Logo/></div>
            <div className="flags-div m-1 border"><FlagController/></div>
            <div className="buttons-div m-1 border"><ControlButtons 
                activeButtons={activeButtons}
                callbacks={buttonCallbacks}
            /></div>
            <div className="highscore-div m-1 border"><Scoreboard user={props.user} highScore={highScore}/></div>
            <div className="track-div m-1 border">
                <TrackController 
                    user={props.user} 
                    setAnalystData={setAnalystData} 
                    setGForce={setGForce} 
                    setHighScore={setHighScore}
                    setButtonCallbacks={setButtonCallbacks}
                />
            </div>
            <div className="voltage-div m-1 border">
                <Analyst data={analystData}/>
            </div>
            <div className="control-div m-1 border"><RaceControl/></div>
            <div className="breakdown-div m-1 border"><Breakdowns/></div>
            <div className="g-force-div m-1 border"><GForce gForce={gForce}/></div>
        </div>
    );
}

export default RaceView;

let view =  document.getElementById('race_container')

if (view) {
    let json_user= view.getAttribute('user')
    let user = JSON.parse(json_user)
    ReactDOM.render(<RaceView user={user}/>, view);
}
