import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import RaceView from "./race/RaceView"
import LandingPage from "./landing/LandingPage"
import ConfigurationPage from "./configuration/ConfigurationPage"
import '../../css/app.css';

const landing = (setPage) => 
        <LandingPage
            setPage={setPage}
        />

const configuration = (user) => 
    <ConfigurationPage
        user={user}
    />


const race = (user, initialState) => 
        <RaceView 
            user={user}
            initialState={initialState}
        />


const WebApp = (props) => {
    const [page, setPage] = useState("configuration")

    if(page == "landing") {
        return landing(setPage)
    } else if (page == "configuration") {
        return configuration(props.user)
    } else {
        return race(props.user, props.initialState)
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
