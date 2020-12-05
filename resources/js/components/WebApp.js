import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import RaceView from "./race/RaceView"
import LandingPage from "./landing/LandingPage"
import ConfigurationPage from "./configuration/ConfigurationPage"
import '../../css/app.css'

const landing = (setPage) => 
        <LandingPage
            setPage={setPage}
        />

const configPage = (user, setPage, setCarParams) => 
    <ConfigurationPage
        user={user}
        setPage={setPage}
        setParams={setCarParams}
    />

const race = (user, initialState, carParams) => 
        <RaceView 
            user={user}
            initialState={initialState}
            carParams={carParams}
        />

const WebApp = (props) => {
    const [page, setPage] = useState("landing")
    const [carParams, setCarParams] = useState({
        mass: 159, cd: 0.45, A: 1.4, D:0.392, crr: 0.018, C: 26, 
    })

    if(page == "landing") {
        return landing(setPage)
    } else if (page == "configuration") {
        return configPage(props.user, setPage, setCarParams)
    } else {
        return race(props.user, props.initialState, carParams)
    }
}

export default WebApp;

let view =  document.getElementById('race_container')

if (view) {
    let json_user= view.getAttribute('user')
    let user = JSON.parse(json_user)
    let json_state= view.getAttribute('state')
    const state = JSON.parse(json_state)
    console.log("Initial state: ", state)
    ReactDOM.render(<WebApp user={user} initialState={state}/>, view);
}
