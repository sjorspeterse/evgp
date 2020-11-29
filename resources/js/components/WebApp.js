import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import RaceView from "./race/RaceView"
import LandingPage from "./landing/LandingPage"
import ConfigurationPage from "./configuration/ConfigurationPage"
import '../../css/app.css'
import * as co from "./configuration/ConfigurationOptions"

const landing = (setPage) => 
        <LandingPage
            setPage={setPage}
        />

const configPage = (user, setPage, config, setConfig) => 
    <ConfigurationPage
        user={user}
        setPage={setPage}
        configuration={config}
        setConfiguration={setConfig}
    />

const race = (user, initialState, config) => 
        <RaceView 
            user={user}
            initialState={initialState}
            carConfig={config}
        />

const WebApp = (props) => {
    const [page, setPage] = useState("landing")
    const [config, setConfig] = useState({
        [co.chassis]: co.steel, 
        [co.body]: co.base,
        [co.canopy]: co.none,
        [co.drivesys]: co.wheelMotor,
        [co.sprocket]: co.teeth15,
        [co.rearTire]: co.defaultTire,
        [co.frontWheel]: co.spoked,
        [co.battery]: co.single
    })

    if(page == "landing") {
        return landing(setPage)
    } else if (page == "configuration") {
        return configPage(props.user, setPage, config, setConfig)
    } else {
        return race(props.user, props.initialState, config)
    }
}

export default WebApp;

let view =  document.getElementById('race_container')

if (view) {
    let json_user= view.getAttribute('user')
    let user = JSON.parse(json_user)
    let json_state= view.getAttribute('state')
    const state = JSON.parse(json_state)
    ReactDOM.render(<WebApp user={user} initialState={state}/>, view);
}
