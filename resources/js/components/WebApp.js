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

const race = (user, initialState, carParams) => 
        <RaceView 
            user={user}
            initialState={initialState}
            carParams={carParams}
        />

const getOption = (carConfig, part) => co.getOption(part, carConfig[part])

const calculateMass = (carConfig) => {
    const chassis = getOption(carConfig, co.chassis).mass
    const body = getOption(carConfig, co.body).mass
    const canopy = getOption(carConfig, co.canopy).mass
    const frontWheel = getOption(carConfig, co.frontWheel).mass
    const battery = getOption(carConfig, co.battery).mass
    return 159 + chassis + body + canopy + frontWheel + battery
}

const calculateDrag = (carConfig) => {
    const body = getOption(carConfig, co.body).Cd
    const canopy = getOption(carConfig, co.canopy).Cd
    return body + canopy
}

const calculateArea = (carConfig) => {
    const body = getOption(carConfig, co.body).A
    const canopy = getOption(carConfig, co.canopy).A
    return body + canopy
}

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
    const carParams = {
        mass: calculateMass(config),
        Cd: calculateDrag(config),
        A: calculateArea(config)
    }
    console.log("Precomputed area: ", carParams.A)

    if(page == "landing") {
        return landing(setPage)
    } else if (page == "configuration") {
        return configPage(props.user, setPage, config, setConfig)
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
    ReactDOM.render(<WebApp user={user} initialState={state}/>, view);
}
