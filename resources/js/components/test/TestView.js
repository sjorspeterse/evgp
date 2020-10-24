import React, { useState, useEffect} from 'react';

import '../../../css/app.css';


const TestView = (props) => {
    return (
        <div className="container p-2 text-white">
            <div className="row no-gutters justify-content-center mb-2">
                <div className="col-md-3 pt-3">
                    <h1>Counter</h1>
                    <h3>{props.count}</h3>
                    <button className="btn btn-dark" onClick={props.onToggleRunning} disabled={props.fetching}>
                    {props.running ? 'STOP' : 'START'}
                </button>
                </div>
            </div>
        </div>
    );
}

export default TestView;
