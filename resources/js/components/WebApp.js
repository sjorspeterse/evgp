import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import RaceView from "./race/RaceView"
import '../../css/app.css';
import Logo from "./Logo";

const WebApp = (props) => {
    return (
        <RaceView 
            user={props.user}
            initialState={props.initialState}
        />
        // <></>
    );
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
