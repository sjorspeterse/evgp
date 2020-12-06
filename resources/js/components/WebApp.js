import React, {useEffect, useState} from 'react';
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
    const admin = props.admin
    const [page, setPage] = useState(admin ? admin.forcepage : "landing")
    const [carParams, setCarParams] = useState({
        mass: 159, cd: 0.45, A: 1.4, D:0.392, crr: 0.018, C: 26, 
    })
    const initialize = () => {
        window.Echo.channel('adminState')
            .listen('AdminUpdated', (e) => {
                handleAdmin(e.adminState)
            })
    }

    const handleAdmin = (adminState) => {
        if(adminState.forcepage) {
            setPage(adminState.forcepage)
        }
    }

    useEffect(initialize, [])

    if(page == "landing") {
        return landing(setPage)
    } else if (page == "configuration") {
        return configPage(props.user, setPage, setCarParams)
    } else {
        return race(props.user, props.initialState, carParams)
    }
}

export default WebApp;

const view =  document.getElementById('race_container')

if (view) {
    let json_user= view.getAttribute('user')
    let user = JSON.parse(json_user)
    let json_state= view.getAttribute('state')
    const state = JSON.parse(json_state)
    let json_admin= view.getAttribute('admin')
    const admin = JSON.parse(json_admin)
    ReactDOM.render(<WebApp user={user} initialState={state} admin={admin}/>, view);
}
