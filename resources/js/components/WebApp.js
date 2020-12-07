import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import RaceView from "./race/RaceView"
import LandingPage from "./landing/LandingPage"
import ConfigurationPage, {initCarParams} from "./configuration/ConfigurationPage"
import '../../css/app.css'

const landing = (user, setPage) => 
        <LandingPage
            setPage={setPage}
            user={user}
        />

const configPage = (user, setPage, setCarParams, savedConfig) => 
    <ConfigurationPage
        user={user}
        setPage={setPage}
        setParams={setCarParams}
        savedConfig={savedConfig}
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
    const [carParams, setCarParams] = useState(initCarParams(props.config))
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
        return landing(props.user, setPage)
    } else if (page == "configuration") {
        return configPage(props.user, setPage, setCarParams, props.config)
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
    let json_config= view.getAttribute('config')
    const config = JSON.parse(json_config)
    ReactDOM.render(<WebApp user={user} initialState={state} admin={admin} config={config}/>, view);
}
